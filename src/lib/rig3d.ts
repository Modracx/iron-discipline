/**
 * Drives a Mixamo-rigged mannequin from the 2D blueprint skeleton.
 *
 * Every keyframed move in `rig2d` resolves to a side-view skeleton; here each
 * bone is aimed so that its rest child-direction points along the matching
 * 2D segment (torso, upper arm, shin…). Because the moves live in the
 * sagittal plane, one set of poses animates both the SVG blueprint and the
 * 3D figure — no motion clips required.
 *
 * Figure space: +Y up, +Z forward (the direction the figure faces),
 * origin at the 2D x = 200 column on the ground.
 */
import * as THREE from "three";
import { GROUND, type Skeleton, type Vec } from "./rig2d";

/** 2D units → metres (the standing blueprint figure is 179 units tall) */
export const UNIT = 1.88 / 179;

export const to3 = (v: Vec, x = 0): THREE.Vector3 =>
  new THREE.Vector3(x, (GROUND - v[1]) * UNIT, (v[0] - 200) * UNIT);

/** Mixamo bone → the 2D segment it should point along; `child` disambiguates multi-child bones. */
type Map2D = { bone: string; child?: string; seg: (s: Skeleton) => [Vec, Vec] };

const NEAR = "Right"; // the side facing the camera (drawn on top in 2D)
const FAR = "Left";

const BONE_MAP: Map2D[] = [
  { bone: "Hips", child: "Spine", seg: (s) => [s.hip, s.shoulder] },
  { bone: "Spine", seg: (s) => [s.hip, s.shoulder] },
  { bone: "Spine1", seg: (s) => [s.hip, s.shoulder] },
  { bone: "Spine2", child: "Neck", seg: (s) => [s.hip, s.shoulder] },
  { bone: "Neck", seg: (s) => [s.shoulder, s.headC] },
  { bone: "Head", child: "HeadTop_End", seg: (s) => [s.shoulder, s.headC] },
  { bone: `${NEAR}Arm`, seg: (s) => [s.arms[0].shoulder, s.arms[0].elbow] },
  { bone: `${NEAR}ForeArm`, seg: (s) => [s.arms[0].elbow, s.arms[0].wrist] },
  { bone: `${NEAR}Hand`, child: `${NEAR}HandMiddle1`, seg: (s) => [s.arms[0].wrist, s.arms[0].hand] },
  { bone: `${FAR}Arm`, seg: (s) => [s.arms[1].shoulder, s.arms[1].elbow] },
  { bone: `${FAR}ForeArm`, seg: (s) => [s.arms[1].elbow, s.arms[1].wrist] },
  { bone: `${FAR}Hand`, child: `${FAR}HandMiddle1`, seg: (s) => [s.arms[1].wrist, s.arms[1].hand] },
  { bone: `${NEAR}UpLeg`, seg: (s) => [s.legs[0].hip, s.legs[0].knee] },
  { bone: `${NEAR}Leg`, seg: (s) => [s.legs[0].knee, s.legs[0].ankle] },
  { bone: `${NEAR}Foot`, seg: (s) => [s.legs[0].ankle, s.legs[0].toe] },
  { bone: `${FAR}UpLeg`, seg: (s) => [s.legs[1].hip, s.legs[1].knee] },
  { bone: `${FAR}Leg`, seg: (s) => [s.legs[1].knee, s.legs[1].ankle] },
  { bone: `${FAR}Foot`, seg: (s) => [s.legs[1].ankle, s.legs[1].toe] },
];

const key = (name: string) => name.replace(/^mixamorig[:_]?/i, "").replace(/[^a-z0-9]/gi, "");

interface Driven {
  bone: THREE.Object3D;
  /** rest direction toward the child, in bone-local space */
  axis: THREE.Vector3;
  /** bone world rotation in the bind pose */
  bindQuat: THREE.Quaternion;
  seg: (s: Skeleton) => [Vec, Vec];
}

export class MannequinRig {
  private driven: Driven[] = [];
  private hips: THREE.Object3D | null = null;
  private readonly root: THREE.Object3D;
  private tmpQ = new THREE.Quaternion();
  private tmpQ2 = new THREE.Quaternion();
  private tmpV = new THREE.Vector3();
  private tmpV2 = new THREE.Vector3();

  constructor(root: THREE.Object3D) {
    this.root = root;
    root.updateMatrixWorld(true);
    const byKey = new Map<string, THREE.Object3D>();
    root.traverse((o) => {
      if ((o as THREE.Bone).isBone) byKey.set(key(o.name), o);
    });
    this.hips = byKey.get("Hips") ?? null;
    for (const m of BONE_MAP) {
      const bone = byKey.get(m.bone);
      if (!bone) continue;
      const child = m.child ? byKey.get(m.child) : bone.children.find((c) => (c as THREE.Bone).isBone);
      if (!child) continue;
      const axis = child.position.clone().normalize();
      const bindQuat = new THREE.Quaternion();
      bone.getWorldQuaternion(bindQuat);
      this.driven.push({ bone, axis, bindQuat, seg: m.seg });
    }
  }

  /** Pose the rig from a resolved 2D skeleton. */
  apply(s: Skeleton) {
    if (this.hips) {
      const world = to3(s.hip);
      this.hips.position.copy(this.hips.parent!.worldToLocal(world));
    }
    for (const d of this.driven) {
      const [a, b] = d.seg(s);
      const target = this.tmpV.set(0, (a[1] - b[1]) * UNIT, (b[0] - a[0]) * UNIT);
      if (target.lengthSq() < 1e-8) continue;
      target.normalize();
      // rest aim in world space, then the minimal rotation from it to the target
      const restAim = this.tmpV2.copy(d.axis).applyQuaternion(d.bindQuat);
      const worldQ = this.tmpQ.setFromUnitVectors(restAim, target).multiply(d.bindQuat);
      d.bone.parent!.getWorldQuaternion(this.tmpQ2).invert();
      d.bone.quaternion.copy(this.tmpQ2.multiply(worldQ));
      d.bone.updateMatrixWorld(true);
    }
    this.root.updateMatrixWorld(true);
  }
}
