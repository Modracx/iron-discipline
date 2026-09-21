"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { MuscleId } from "@/data/calisthenics-data";
import { GROUND, muscleAnchor, poseAt, resolve, type Move, type PropSpec } from "@/lib/rig2d";
import { MannequinRig, UNIT, to3 } from "@/lib/rig3d";

interface Props {
  move: Move;
  /** rep progress 0‥1, driven by the parent's cadence loop */
  t: number;
  muscle: MuscleId;
  className?: string;
}

const COLOR_BODY = 0x2a3628;
const COLOR_JOINT = 0x99a184;
const COLOR_EMBER = 0xf97316;
const COLOR_PROP = 0xd8d0bd;

/** Build the equipment for a move in figure space (metres). */
function buildProps(specs: PropSpec[] | undefined): THREE.Group {
  const g = new THREE.Group();
  if (!specs) return g;
  const mat = new THREE.MeshStandardMaterial({ color: COLOR_PROP, roughness: 0.6, metalness: 0.2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x131a13, roughness: 0.9 });
  const h = (y: number) => (GROUND - y) * UNIT;
  const z = (x: number) => (x - 200) * UNIT;
  const post = (x: number, zz: number, top: number, r = 0.02) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, top, 12), mat);
    m.position.set(x, top / 2, zz);
    m.castShadow = true;
    g.add(m);
  };
  const railX = (y: number, zz: number, len: number, r = 0.018) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
    m.rotation.z = Math.PI / 2;
    m.position.set(0, y, zz);
    m.castShadow = true;
    g.add(m);
  };
  const railZ = (y: number, x: number, len: number, r = 0.018) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat);
    m.rotation.x = Math.PI / 2;
    m.position.set(x, y, 0);
    m.castShadow = true;
    g.add(m);
  };
  const block = (x: number, y: number, w: number, hh: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, hh * UNIT, w * UNIT), dark);
    m.position.set(0, (hh * UNIT) / 2, z(x + w / 2));
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: COLOR_PROP }));
    edges.position.copy(m.position);
    g.add(edges);
  };
  for (const p of specs) {
    switch (p.type) {
      case "bar":
        railX(h(p.y), 0, 1.8, 0.02);
        post(-0.85, 0, h(p.y));
        post(0.85, 0, h(p.y));
        break;
      case "lowbar":
        railX(h(p.y), 0, 1.4, 0.02);
        post(-0.65, 0, h(p.y));
        post(0.65, 0, h(p.y));
        break;
      case "pbars":
        for (const x of [-0.26, 0.26]) {
          railZ(h(p.y), x, 1.3, 0.02);
          post(x, -0.5, h(p.y));
          post(x, 0.5, h(p.y));
        }
        break;
      case "parallettes":
        for (const x of [-0.24, 0.24]) {
          railZ(h(p.y), x, 0.45, 0.015);
          post(x, -0.18, h(p.y), 0.012);
          post(x, 0.18, h(p.y), 0.012);
        }
        break;
      case "box":
      case "bench":
        block(p.x, p.y, p.w, p.h);
        break;
      case "wall": {
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.06), dark);
        m.position.set(0, 1.2, z(p.x) + (p.side === "right" ? 0.03 : -0.03));
        m.receiveShadow = true;
        g.add(m);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: COLOR_PROP }));
        edges.position.copy(m.position);
        g.add(edges);
        break;
      }
      case "pole":
        post(0, z(p.x), 2.4, 0.03);
        break;
      case "anchor":
        block(p.x - 8, p.y, 16, GROUND - p.y);
        break;
    }
  }
  return g;
}

export default function MotionFigure3D({ move, t, muscle, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(t);
  const moveRef = useRef(move);
  const muscleRef = useRef(muscle);
  const propsRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [ready, setReady] = useState(false);
  tRef.current = t;
  muscleRef.current = muscle;

  // swap equipment when the move changes
  useEffect(() => {
    moveRef.current = move;
    const scene = sceneRef.current;
    if (!scene) return;
    if (propsRef.current) scene.remove(propsRef.current);
    propsRef.current = buildProps(move.props);
    scene.add(propsRef.current);
  }, [move, ready]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 30);
    const viewDir = new THREE.Vector3(-1, 0.3, 0.55).normalize();
    const lookAt = new THREE.Vector3(0, 0.8, 0);
    let camDist = 3.2;
    camera.position.copy(lookAt).addScaledVector(viewDir, camDist);
    camera.lookAt(lookAt);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.45;
    pmrem.dispose();

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.2);
    keyLight.position.set(-2.5, 4, 2.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.camera.right = keyLight.shadow.camera.top = 2;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);
    const rim = new THREE.DirectionalLight(COLOR_EMBER, 1.2);
    rim.position.set(3, 1.5, -2);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0x99a184, 0x0a0e0b, 0.3));

    // ground: shadow catcher + tactical grid
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.55 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const grid = new THREE.GridHelper(6, 24, COLOR_EMBER, 0x222e23);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.6;
    grid.position.y = 0.002;
    scene.add(grid);

    // muscle glow: emissive marker + local light on the body surface
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 16, 16),
      new THREE.MeshBasicMaterial({ color: COLOR_EMBER, transparent: true, opacity: 0.9 })
    );
    const glowLight = new THREE.PointLight(COLOR_EMBER, 2.5, 0.7, 2);
    scene.add(glow, glowLight);

    let rig: MannequinRig | null = null;
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: COLOR_BODY,
      roughness: 0.45,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.9,
    });
    const jointMat = new THREE.MeshStandardMaterial({ color: COLOR_JOINT, roughness: 0.4, metalness: 0.4 });

    loader.load(
      "/models/mannequin.glb",
      (gltf) => {
        const root = gltf.scene;
        root.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          m.material = /joint/i.test(m.name) ? jointMat : bodyMat;
          m.castShadow = true;
          m.receiveShadow = true;
          m.frustumCulled = false; // skinned bounds don't follow the pose
        });
        scene.add(root);
        rig = new MannequinRig(root);
        setReady(true);
      },
      undefined,
      (err) => console.warn("mannequin load failed", err)
    );

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const tt = tRef.current;
      const skel = resolve(poseAt(moveRef.current, tt), tt);
      if (rig) rig.apply(skel);
      const anchor = to3(muscleAnchor(skel, muscleRef.current), -0.12);
      glow.position.copy(anchor);
      glowLight.position.copy(anchor).x -= 0.1;
      const tension = 0.35 + tt * 0.65;
      (glow.material as THREE.MeshBasicMaterial).opacity = tension;
      glowLight.intensity = 1.2 + tt * 2.2;
      // auto-frame: fit the figure (and its equipment) with a little headroom
      const pts = [skel.hip, skel.shoulder, skel.headC, skel.arms[0].hand, skel.arms[1].hand, skel.legs[0].toe, skel.legs[1].toe, skel.arms[0].elbow, skel.legs[0].knee];
      let minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
      for (const p of pts) {
        const v = to3(p);
        minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
        minZ = Math.min(minZ, v.z); maxZ = Math.max(maxZ, v.z);
      }
      for (const p of moveRef.current.props ?? []) {
        if (p.type === "bar" || p.type === "lowbar" || p.type === "pbars") maxY = Math.max(maxY, (GROUND - p.y) * UNIT + 0.1);
        if (p.type === "box" || p.type === "bench") { minZ = Math.min(minZ, (p.x - 200) * UNIT); maxZ = Math.max(maxZ, (p.x + p.w - 200) * UNIT); }
      }
      minY = Math.min(minY, 0);
      const spanY = Math.max(maxY - minY, 0.6) + 0.22;
      const spanZ = Math.max(maxZ - minZ, 0.8) + 0.4;
      const vFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const hFov = Math.atan(Math.tan(vFov) * camera.aspect);
      const need = Math.max(spanY / 2 / Math.tan(vFov), spanZ / 2 / Math.tan(hFov)) * 1.12 + 0.2;
      const targetLook = new THREE.Vector3(0, (minY + maxY) / 2, (minZ + maxZ) / 2);
      lookAt.lerp(targetLook, 0.06);
      camDist += (need - camDist) * 0.06;
      camera.position.copy(lookAt).addScaledVector(viewDir, camDist);
      camera.lookAt(lookAt);
      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      dracoLoader.dispose();
      scene.environment?.dispose();
      bodyMat.dispose();
      jointMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`}>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center font-cond text-xs font-bold tracking-[0.25em] text-drab">
          LOADING MOTION RIG…
        </div>
      )}
    </div>
  );
}
