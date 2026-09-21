/**
 * 2D articulated rig for the exercise blueprints.
 *
 * One skeleton (hip → torso → head, two-bone arms and legs, side view,
 * figure faces +x) is posed by keyframes. Limbs are given either as an IK
 * target (`{ to }` — wrist / ankle position, contact stays planted) or as
 * explicit angles (`{ a, b }` — relative to the torso, plus joint flexion).
 * Joint angles and motion vectors drawn on the blueprint are derived from
 * the resolved skeleton, not hand-placed.
 */

import type { MuscleId } from "@/data/calisthenics-data";

export type Vec = [number, number];
export type Limb = { to: Vec } | { a: number; b: number };

export interface Pose {
  hip: Vec;
  /** absolute direction hip → shoulder, degrees, SVG y-down (−90 = upright) */
  torso: number;
  /** head tilt relative to torso (+ = nods toward the front) */
  head?: number;
  arm: Limb;
  arm2?: Limb;
  leg: Limb;
  leg2?: Limb;
  /** foot flex relative to the shin; 30 = flat on the ground when standing */
  foot?: number;
  foot2?: number;
  /** breathing / tension sway amplitude for static holds */
  sway?: number;
}

export type PropSpec =
  | { type: "bar"; y: number }
  | { type: "lowbar"; y: number }
  | { type: "pbars"; y: number }
  | { type: "parallettes"; y: number }
  | { type: "box"; x: number; y: number; w: number; h: number }
  | { type: "bench"; x: number; y: number; w: number; h: number }
  | { type: "wall"; x: number; side: "left" | "right" }
  | { type: "pole"; x: number }
  | { type: "anchor"; x: number; y: number };

export type JointName = "elbow" | "knee" | "hip" | "shoulder";

export interface Move {
  keys: { t: number; pose: Pose }[];
  props?: PropSpec[];
  focus?: JointName[];
  /** uniform scale about the ground centre (default 1.35; tall scenes set less) */
  scale?: number;
  /** captions for the three rep phases: [start, mid, peak] */
  phases?: [string, string, string];
}

// ── Skeleton dimensions (px in a 400×250 viewBox) ──────────────────────────
export const GROUND = 222;
export const SEG = {
  torso: 62,
  neck: 10,
  head: 11,
  upperArm: 30,
  forearm: 28,
  hand: 8,
  thigh: 40,
  shin: 38,
  foot: 13,
};
const LEG_LEN = SEG.thigh + SEG.shin; // 78
const ARM_LEN = SEG.upperArm + SEG.forearm; // 58
const BODY_LEN = LEG_LEN + SEG.torso; // 140

const rad = (d: number) => (d * Math.PI) / 180;
export const deg = (r: number) => (r * 180) / Math.PI;
// Coordinates are rounded so server and client renders agree bit-for-bit
// (libm results differ in the last digit between Node and the browser).
const R = (v: number) => Math.round(v * 100) / 100;
export const dir = (p: Vec, angle: number, len: number): Vec => [
  R(p[0] + Math.cos(rad(angle)) * len),
  R(p[1] + Math.sin(rad(angle)) * len),
];
const norm180 = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => a + norm180(b - a) * t;
const lerpVec = (a: Vec, b: Vec, t: number): Vec => [R(lerp(a[0], b[0], t)), R(lerp(a[1], b[1], t))];

// ── Resolved skeleton ──────────────────────────────────────────────────────
export interface ArmR {
  shoulder: Vec;
  elbow: Vec;
  wrist: Vec;
  hand: Vec;
  upperAbs: number;
  foreAbs: number;
  bend: number;
}
export interface LegR {
  hip: Vec;
  knee: Vec;
  ankle: Vec;
  toe: Vec;
  thighAbs: number;
  shinAbs: number;
  bend: number;
}
export interface Skeleton {
  hip: Vec;
  shoulder: Vec;
  headC: Vec;
  torso: number;
  headAbs: number;
  arms: [ArmR, ArmR];
  legs: [LegR, LegR];
}

/**
 * Two-bone IK. Returns the mid joint and the (reach-clamped) end so that the
 * flexion `bendOf(rootAbs, distalAbs)` is non-negative — an elbow or knee can
 * flex but never hyper-extend, so the sign alone selects the solution.
 */
function ik(
  root: Vec,
  target: Vec,
  l1: number,
  l2: number,
  bendOf: (rootAbs: number, distalAbs: number) => number
): { mid: Vec; end: Vec; rootAbs: number; distalAbs: number } {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  let d = Math.hypot(dx, dy);
  d = Math.min(Math.max(d, Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const base = deg(Math.atan2(dy, dx));
  const inner = deg(Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const end = dir(root, base, d);
  let best: { mid: Vec; end: Vec; rootAbs: number; distalAbs: number } | null = null;
  for (const s of [1, -1]) {
    const rootAbs = base + s * inner;
    const mid = dir(root, rootAbs, l1);
    const distalAbs = deg(Math.atan2(end[1] - mid[1], end[0] - mid[0]));
    const bend = norm180(bendOf(rootAbs, distalAbs));
    if (!best || bend >= -0.01) best = { mid, end, rootAbs, distalAbs };
    if (bend >= -0.01) break;
  }
  return best!;
}

const elbowBend = (upper: number, fore: number) => upper - fore; // flexion folds the hand toward the front
const kneeBend = (thigh: number, shin: number) => shin - thigh; // flexion folds the heel toward the back

function resolveArm(shoulder: Vec, torso: number, limb: Limb): ArmR {
  let upperAbs: number, foreAbs: number, elbow: Vec, wrist: Vec;
  if ("to" in limb) {
    const r = ik(shoulder, limb.to, SEG.upperArm, SEG.forearm, elbowBend);
    upperAbs = r.rootAbs;
    foreAbs = r.distalAbs;
    elbow = r.mid;
    wrist = r.end;
  } else {
    upperAbs = torso + 180 - limb.a;
    foreAbs = upperAbs - limb.b;
    elbow = dir(shoulder, upperAbs, SEG.upperArm);
    wrist = dir(elbow, foreAbs, SEG.forearm);
  }
  return {
    shoulder,
    elbow,
    wrist,
    hand: dir(wrist, foreAbs, SEG.hand),
    upperAbs,
    foreAbs,
    bend: norm180(upperAbs - foreAbs),
  };
}

function resolveLeg(hip: Vec, torso: number, limb: Limb, foot: number): LegR {
  let thighAbs: number, shinAbs: number, knee: Vec, ankle: Vec;
  if ("to" in limb) {
    const r = ik(hip, limb.to, SEG.thigh, SEG.shin, kneeBend);
    thighAbs = r.rootAbs;
    shinAbs = r.distalAbs;
    knee = r.mid;
    ankle = r.end;
  } else {
    thighAbs = torso + 180 - limb.a;
    shinAbs = thighAbs + limb.b;
    knee = dir(hip, thighAbs, SEG.thigh);
    ankle = dir(knee, shinAbs, SEG.shin);
  }
  return {
    hip,
    knee,
    ankle,
    toe: dir(ankle, shinAbs - 90 + foot, SEG.foot),
    thighAbs,
    shinAbs,
    bend: norm180(shinAbs - thighAbs),
  };
}

export function resolve(p: Pose, phase = 0): Skeleton {
  const hip: Vec = p.sway ? [p.hip[0], R(p.hip[1] + Math.sin(phase * Math.PI) * p.sway)] : p.hip;
  const shoulder = dir(hip, p.torso, SEG.torso);
  const headAbs = p.torso + (p.head ?? 0);
  const headC = dir(shoulder, headAbs, SEG.neck + SEG.head);
  const foot = p.foot ?? 30;
  return {
    hip,
    shoulder,
    headC,
    torso: p.torso,
    headAbs,
    arms: [resolveArm(shoulder, p.torso, p.arm), resolveArm(shoulder, p.torso, p.arm2 ?? p.arm)],
    legs: [
      resolveLeg(hip, p.torso, p.leg, foot),
      resolveLeg(hip, p.torso, p.leg2 ?? p.leg, p.foot2 ?? foot),
    ],
  };
}

// ── Muscle anchor ──────────────────────────────────────────────────────────
/** Where the target muscle sits on the figure, for the tension glow. */
export function muscleAnchor(s: Skeleton, m: MuscleId): Vec {
  const front = s.torso + 90;
  const along = (f: number): Vec => [R(s.shoulder[0] + (s.hip[0] - s.shoulder[0]) * f), R(s.shoulder[1] + (s.hip[1] - s.shoulder[1]) * f)];
  const mid = (a: Vec, b: Vec): Vec => [R((a[0] + b[0]) / 2), R((a[1] + b[1]) / 2)];
  const arm = s.arms[0];
  const leg = s.legs[0];
  switch (m) {
    case "chest": return dir(along(0.22), front, 7);
    case "abs": return dir(along(0.6), front, 6);
    case "obliques": return dir(along(0.55), front, 2);
    case "lats": return dir(along(0.45), front, -7);
    case "traps": return dir(along(0.08), front, -6);
    case "lower_back": return dir(along(0.75), front, -6);
    case "deltoids": return s.shoulder;
    case "neck": return dir(s.shoulder, s.headAbs, 6);
    case "biceps": return dir(mid(arm.shoulder, arm.elbow), arm.upperAbs + 90, -3);
    case "triceps": return dir(mid(arm.shoulder, arm.elbow), arm.upperAbs + 90, 3);
    case "forearms": return mid(arm.elbow, arm.wrist);
    case "glutes": return dir(s.hip, front, -7);
    case "quads": return dir(mid(leg.hip, leg.knee), leg.thighAbs + 90, -4);
    case "hamstrings": return dir(mid(leg.hip, leg.knee), leg.thighAbs + 90, 4);
    case "calves": return dir(mid(leg.knee, leg.ankle), leg.shinAbs + 90, 4);
    default: return along(0.5);
  }
}

// ── Keyframe interpolation ─────────────────────────────────────────────────
function explicitArm(p: Pose, which: "arm" | "arm2"): Limb {
  const s = resolve(p);
  const r = s.arms[which === "arm" ? 0 : 1];
  return { a: p.torso + 180 - r.upperAbs, b: r.bend };
}
function explicitLeg(p: Pose, which: "leg" | "leg2"): Limb {
  const s = resolve(p);
  const r = s.legs[which === "leg" ? 0 : 1];
  return { a: p.torso + 180 - r.thighAbs, b: r.bend };
}

function lerpLimb(
  a: Limb,
  b: Limb,
  t: number,
  pa: Pose,
  pb: Pose,
  which: "arm" | "arm2" | "leg" | "leg2"
): Limb {
  if ("to" in a && "to" in b) return { to: lerpVec(a.to, b.to, t) };
  // mixed variants: fall back to interpolating resolved joint angles
  const isArm = which.startsWith("arm");
  const ea = "to" in a ? (isArm ? explicitArm(pa, which as "arm") : explicitLeg(pa, which as "leg")) : a;
  const eb = "to" in b ? (isArm ? explicitArm(pb, which as "arm") : explicitLeg(pb, which as "leg")) : b;
  const A = ea as { a: number; b: number };
  const B = eb as { a: number; b: number };
  return { a: lerpAngle(A.a, B.a, t), b: lerpAngle(A.b, B.b, t) };
}

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return {
    hip: lerpVec(a.hip, b.hip, t),
    torso: lerpAngle(a.torso, b.torso, t),
    head: lerp(a.head ?? 0, b.head ?? 0, t),
    arm: lerpLimb(a.arm, b.arm, t, a, b, "arm"),
    arm2: lerpLimb(a.arm2 ?? a.arm, b.arm2 ?? b.arm, t, a, b, "arm2"),
    leg: lerpLimb(a.leg, b.leg, t, a, b, "leg"),
    leg2: lerpLimb(a.leg2 ?? a.leg, b.leg2 ?? b.leg, t, a, b, "leg2"),
    foot: lerp(a.foot ?? 30, b.foot ?? 30, t),
    foot2: lerp(a.foot2 ?? a.foot ?? 30, b.foot2 ?? b.foot ?? 30, t),
    sway: lerp(a.sway ?? 0, b.sway ?? 0, t),
  };
}

const ease = (t: number) => 0.5 - 0.5 * Math.cos(t * Math.PI);

/** Pose at progress t ∈ [0,1] along the move's keyframes. */
export function poseAt(move: Move, t: number): Pose {
  const keys = move.keys;
  if (keys.length === 1) return keys[0].pose;
  const tt = Math.min(1, Math.max(0, t));
  let i = 0;
  while (i < keys.length - 2 && tt > keys[i + 1].t) i++;
  const k0 = keys[i];
  const k1 = keys[i + 1];
  const span = k1.t - k0.t || 1;
  return lerpPose(k0.pose, k1.pose, ease((tt - k0.t) / span));
}

// ── Pose helpers ───────────────────────────────────────────────────────────
const STAND_HIP = GROUND - 7 - LEG_LEN; // 137
const ANKLE_Y = GROUND - 7; // 215

/** Standing upright at x, both feet planted. */
const stand = (x = 200, extra: Partial<Pose> = {}): Pose => ({
  hip: [x, STAND_HIP],
  torso: -90,
  arm: { a: 8, b: 12 },
  leg: { to: [x + 3, ANKLE_Y] },
  ...extra,
});

/** Rigid body line (feet → shoulders) with the ankle planted and shoulders at a given height. */
function bodyLine(ankle: Vec, shoulderY: number, facing: 1 | -1 = 1) {
  const rise = ankle[1] - shoulderY;
  const a = deg(Math.asin(Math.min(1, Math.max(-1, rise / BODY_LEN))));
  const theta = facing === 1 ? -a : 180 + a;
  const shoulder = dir(ankle, theta, BODY_LEN);
  const hip = dir(ankle, theta, LEG_LEN);
  return { shoulder, hip, torso: theta };
}

/** Push-up family: feet planted, hands planted, shoulders drop between top and bottom. */
function pushup(ankle: Vec, topShoulderY: number, bottomShoulderY: number, handDx = 4, feetFoot = 30): Pose[] {
  const top = bodyLine(ankle, topShoulderY);
  // hands sit exactly one arm-length under the top-position shoulder → true lockout
  const hands: Vec = [top.shoulder[0] + handDx, top.shoulder[1] + Math.sqrt(ARM_LEN * ARM_LEN - handDx * handDx)];
  const bottom = bodyLine(ankle, bottomShoulderY);
  const mk = (b: typeof top): Pose => ({
    hip: b.hip,
    torso: b.torso,
    head: 22,
    arm: { to: hands },
    leg: { to: ankle },
    foot: feetFoot,
  });
  return [mk(top), mk(bottom)];
}

/** Hanging from a bar: wrists at the bar, shoulders at a given height. */
function hang(shoulderY: number, torso = -90, legs: Limb = { a: 15, b: 70 }, extra: Partial<Pose> = {}): Pose {
  const shoulder: Vec = [200, Math.min(shoulderY, 32 + ARM_LEN)];
  const hip = dir(shoulder, torso + 180, SEG.torso);
  return { hip, torso, arm: { to: [200, 32] }, leg: legs, foot: 55, ...extra };
}

const PLANK_TOP = pushup([128, 210], 164, 190);

// ── Moves library ──────────────────────────────────────────────────────────
const BAR: PropSpec = { type: "bar", y: 30 };

export const MOVES: Record<string, Move> = {
  // ── push ──
  pushup_standard: {
    keys: [{ t: 0, pose: PLANK_TOP[0] }, { t: 1, pose: PLANK_TOP[1] }],
    focus: ["elbow", "hip"],
    phases: ["TOP LOCKOUT · HOLLOW BODY", "ECCENTRIC · 3s DESCENT", "CHEST 2cm OFF DECK"],
  },
  pushup_diamond: {
    keys: [{ t: 0, pose: pushup([128, 210], 164, 190, -2)[0] }, { t: 1, pose: pushup([128, 210], 164, 190, -2)[1] }],
    focus: ["elbow"],
    phases: ["HANDS UNDER STERNUM", "ELBOWS TRACK BACK", "TRICEPS LOADED"],
  },
  pushup_knee: {
    keys: (() => {
      const knee: Vec = [150, 212];
      const mk = (shoulderY: number): Pose => {
        const a = deg(Math.asin((knee[1] - shoulderY) / (SEG.thigh + SEG.torso)));
        const hip = dir(knee, -a, SEG.thigh);
        const torso = -a;
        return {
          hip,
          torso,
          head: 22,
          arm: { to: [dir(knee, -a, SEG.thigh + SEG.torso)[0] + 4, 164 + Math.sqrt(ARM_LEN * ARM_LEN - 16)] },
          leg: { a: 0, b: 100 },
          foot: 60,
        };
      };
      return [{ t: 0, pose: mk(164) }, { t: 1, pose: mk(192) }];
    })(),
    focus: ["elbow"],
    phases: ["KNEES DOWN · LINE FROM KNEE TO CROWN", "CONTROLLED DESCENT", "CHEST TO DECK"],
  },
  pushup_incline: {
    keys: (() => {
      const box: PropSpec = { type: "box", x: 232, y: 170, w: 60, h: 52 };
      const ankle: Vec = [138, 213];
      const mk = (shoulderY: number): Pose => {
        const b = bodyLine(ankle, shoulderY);
        return { hip: b.hip, torso: b.torso, head: 15, arm: { to: [258, box.y] }, leg: { to: ankle }, foot: 30 };
      };
      return [{ t: 0, pose: mk(112) }, { t: 1, pose: mk(150) }];
    })(),
    props: [{ type: "box", x: 232, y: 170, w: 60, h: 52 }],
    focus: ["elbow"],
    phases: ["HANDS ELEVATED · REDUCED LOAD", "CHEST TO EDGE", "PRESS AWAY"],
  },
  pushup_decline: {
    keys: [{ t: 0, pose: pushup([128, 182], 164, 190, 4, 80)[0] }, { t: 1, pose: pushup([128, 182], 164, 190, 4, 80)[1] }],
    props: [{ type: "box", x: 92, y: 190, w: 62, h: 32 }],
    focus: ["elbow", "hip"],
    phases: ["FEET ELEVATED · UPPER CHEST", "SHOULDERS BELOW FEET", "NOSE TO DECK"],
  },
  pushup_archer: {
    keys: (() => {
      const [top, bot] = pushup([128, 210], 164, 190);
      return [
        { t: 0, pose: { ...top, arm2: { to: [dir(top.hip, top.torso, SEG.torso)[0] + 56, GROUND - 2] } } },
        { t: 1, pose: { ...bot, arm2: { to: [dir(top.hip, top.torso, SEG.torso)[0] + 56, GROUND - 2] } } },
      ];
    })(),
    focus: ["elbow"],
    phases: ["WIDE HAND SET", "SHIFT ONTO WORKING ARM", "FAR ARM STAYS LOCKED"],
  },
  pushup_onearm: {
    keys: [
      { t: 0, pose: { ...PLANK_TOP[0], arm2: { a: -35, b: 60 }, leg2: { to: [118, 212] } } },
      { t: 1, pose: { ...PLANK_TOP[1], arm2: { a: -35, b: 60 }, leg2: { to: [118, 212] } } },
    ],
    focus: ["elbow"],
    phases: ["WIDE STANCE · HAND BEHIND BACK", "ANTI-ROTATION LOCK", "PRESS THROUGH ONE ARM"],
  },
  pushup_clapping: {
    keys: (() => {
      const [top, bot] = pushup([128, 210], 164, 190);
      const air = bodyLine([128, 210], 146);
      return [
        { t: 0, pose: bot },
        { t: 0.55, pose: top },
        { t: 1, pose: { hip: air.hip, torso: air.torso, head: 22, arm: { a: 75, b: 95 }, leg: { to: [128, 210] } } },
      ];
    })(),
    focus: ["elbow"],
    phases: ["LOAD THE SPRING", "EXPLODE OFF THE DECK", "AIRBORNE · CLAP"],
  },
  pushup_pseudo_planche: {
    keys: (() => {
      const mk = (shoulderY: number): Pose => {
        const b = bodyLine([128, 210], shoulderY);
        return { hip: b.hip, torso: b.torso, head: 30, arm: { to: [b.shoulder[0] - 38, GROUND - 2] }, leg: { to: [128, 210] }, foot: 60 };
      };
      return [{ t: 0, pose: mk(170) }, { t: 1, pose: mk(196) }];
    })(),
    focus: ["shoulder", "elbow"],
    phases: ["HANDS BY HIPS · LEAN FORWARD", "SHOULDERS PAST WRISTS", "MAX LEAN"],
  },
  planche_pushup: {
    keys: [
      { t: 0, pose: { hip: [180, 160], torso: -3, head: 30, arm: { to: [246, GROUND - 2] }, leg: { a: 0, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [178, 192], torso: -1, head: 30, arm: { to: [246, GROUND - 2] }, leg: { a: 0, b: 0 }, foot: 60 } },
    ],
    focus: ["shoulder", "elbow"],
    phases: ["FULL PLANCHE · FEET OFF DECK", "LOWER UNDER TENSION", "PRESS BACK TO LOCK"],
  },
  pike_pushup: {
    keys: [
      { t: 0, pose: { hip: [195, 140], torso: 22, head: 10, arm: { to: [256, GROUND - 2] }, leg: { to: [175, ANKLE_Y] } } },
      { t: 1, pose: { hip: [197, 142], torso: 52, head: 10, arm: { to: [256, GROUND - 2] }, leg: { to: [175, ANKLE_Y] } } },
    ],
    focus: ["elbow", "hip"],
    phases: ["HIPS HIGH · INVERTED V", "CROWN TOWARD DECK", "PRESS TO LOCKOUT"],
  },

  // ── pull ──
  pullup_strict: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90) }, { t: 1, pose: hang(44, -100) }],
    props: [BAR],
    focus: ["elbow"],
    phases: ["DEAD HANG · SCAPULA ENGAGED", "DRIVE ELBOWS TO RIBS", "CHIN OVER BAR"],
  },
  pullup_chinup: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90) }, { t: 1, pose: hang(42, -102) }],
    props: [BAR],
    focus: ["elbow"],
    phases: ["SUPINATED · DEAD HANG", "BICEPS DRIVE", "CHIN OVER BAR"],
  },
  pullup_wide: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90) }, { t: 1, pose: hang(46, -98) }],
    props: [BAR],
    focus: ["elbow"],
    phases: ["WIDE GRIP · LATS STRETCHED", "ELBOWS DOWN & BACK", "BAR AT COLLARBONE"],
  },
  pullup_lsit: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90, -90, { a: 90, b: 0 }) }, { t: 1, pose: hang(44, -96, { a: 96, b: 0 }) }],
    props: [BAR],
    focus: ["elbow", "hip"],
    phases: ["L-SIT HOLD · LEGS LOCKED", "PULL WITHOUT LEG DROP", "CHIN OVER · L HELD"],
  },
  pullup_chest_to_bar: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90) }, { t: 1, pose: hang(34, -112) }],
    props: [BAR],
    focus: ["elbow"],
    phases: ["DEAD HANG", "ARCH & DRIVE", "STERNUM TO BAR"],
  },
  pullup_archer: {
    scale: 1,
    keys: [
      { t: 0, pose: hang(90, -90, { a: 15, b: 70 }, { arm2: { a: 92, b: 0 } }) },
      { t: 1, pose: hang(44, -100, { a: 15, b: 70 }, { arm2: { a: 100, b: 0 } }) },
    ],
    props: [BAR],
    focus: ["elbow"],
    phases: ["WIDE GRIP", "PULL TO ONE HAND", "FAR ARM STRAIGHT ALONG BAR"],
  },
  pullup_onearm: {
    scale: 1,
    keys: [
      { t: 0, pose: hang(90, -90, { a: 15, b: 70 }, { arm2: { a: 0, b: 0 } }) },
      { t: 1, pose: hang(44, -100, { a: 15, b: 70 }, { arm2: { a: -10, b: 20 } }) },
    ],
    props: [BAR],
    focus: ["elbow"],
    phases: ["SINGLE-ARM HANG", "FULL-BODY TENSION PULL", "CHIN OVER ON ONE ARM"],
  },
  dead_hang: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90, -90, { a: 8, b: 20 }, { sway: 2 }) }, { t: 1, pose: hang(86, -90, { a: 8, b: 20 }, { sway: 2 }) }],
    props: [BAR],
    focus: ["shoulder"],
    phases: ["PASSIVE HANG", "SCAPULAR DEPRESSION", "ACTIVE HANG · SHOULDERS PACKED"],
  },
  muscle_up: {
    keys: [
      { t: 0, pose: hang(90, -90, { a: 10, b: 40 }) },
      { t: 0.5, pose: hang(30, -80, { a: 15, b: 50 }) },
      { t: 1, pose: { hip: [200, 36], torso: -85, arm: { to: [200, 32] }, leg: { a: 8, b: 30 }, foot: 55 } },
    ],
    props: [BAR],
    scale: 0.82,
    focus: ["elbow", "shoulder"],
    phases: ["HANG · FALSE GRIP", "PULL HIGH · TRANSITION", "LOCK OUT ABOVE THE BAR"],
  },
  front_lever: {
    scale: 1,
    keys: [
      { t: 0, pose: hang(90, -90, { a: 5, b: 15 }) },
      { t: 1, pose: { hip: [262, 90], torso: 180, head: -10, arm: { to: [200, 32] }, leg: { a: 0, b: 0 }, foot: 60 } },
    ],
    props: [BAR],
    focus: ["shoulder", "hip"],
    phases: ["ACTIVE HANG", "LEVER THE BODY UP", "HORIZONTAL · STRAIGHT ARMS"],
  },
  front_lever_tuck: {
    scale: 1,
    keys: [
      { t: 0, pose: hang(90, -90, { a: 5, b: 15 }) },
      { t: 1, pose: { hip: [246, 96], torso: 170, head: -10, arm: { to: [200, 32] }, leg: { a: 115, b: 130 }, foot: 60 } },
    ],
    props: [BAR],
    focus: ["shoulder", "hip"],
    phases: ["ACTIVE HANG", "TUCK & LEVER", "HIPS AT SHOULDER HEIGHT"],
  },
  back_lever: {
    scale: 1,
    keys: [
      { t: 0, pose: hang(90, -90, { a: 5, b: 15 }) },
      { t: 1, pose: { hip: [140, 96], torso: 0, head: 10, arm: { to: [200, 32] }, leg: { a: 0, b: 0 }, foot: 60 } },
    ],
    props: [BAR],
    focus: ["shoulder"],
    phases: ["HANG", "ROTATE THROUGH", "FACE DOWN · HORIZONTAL"],
  },
  pullup_australian: {
    keys: (() => {
      const ankle: Vec = [318, 215];
      const mk = (shoulderY: number): Pose => {
        const b = bodyLine(ankle, shoulderY, -1);
        return { hip: b.hip, torso: b.torso, head: -10, arm: { to: [200, 152] }, leg: { to: ankle }, foot: -25 };
      };
      return [{ t: 0, pose: mk(208) }, { t: 1, pose: mk(166) }];
    })(),
    props: [{ type: "lowbar", y: 150 }],
    focus: ["elbow", "hip"],
    phases: ["HANG UNDER BAR · BODY RIGID", "PULL ELBOWS BACK", "CHEST TO BAR"],
  },

  // ── dips & handstands ──
  dip_parallel: {
    keys: [
      { t: 0, pose: { hip: [191, 124], torso: -82, arm: { to: [200, 120] }, leg: { a: 10, b: 60 }, foot: 60 } },
      { t: 1, pose: { hip: [186, 158], torso: -72, arm: { to: [200, 120] }, leg: { a: 10, b: 60 }, foot: 60 } },
    ],
    props: [{ type: "pbars", y: 118 }],
    focus: ["elbow", "shoulder"],
    phases: ["SUPPORT HOLD · LOCKED OUT", "LOWER TO 90°", "SHOULDER BELOW ELBOW"],
  },
  dip_straight_bar: {
    keys: [
      { t: 0, pose: { hip: [186, 126], torso: -75, arm: { to: [200, 120] }, leg: { a: 25, b: 40 }, foot: 60 } },
      { t: 1, pose: { hip: [178, 160], torso: -62, arm: { to: [200, 120] }, leg: { a: 25, b: 40 }, foot: 60 } },
    ],
    props: [{ type: "lowbar", y: 118 }],
    focus: ["elbow"],
    phases: ["LEAN OVER THE BAR", "LOWER · ELBOWS BACK", "BAR AT LOWER CHEST"],
  },
  dip_bench: {
    keys: [
      { t: 0, pose: { hip: [214, 150], torso: -125, head: 30, arm: { to: [188, 160] }, leg: { to: [262, ANKLE_Y] } } },
      { t: 1, pose: { hip: [214, 184], torso: -110, head: 30, arm: { to: [188, 160] }, leg: { to: [262, ANKLE_Y] } } },
    ],
    props: [{ type: "bench", x: 118, y: 160, w: 72, h: 62 }],
    focus: ["elbow"],
    phases: ["HANDS ON EDGE · HIPS CLEAR", "LOWER TO 90°", "PRESS TO LOCKOUT"],
  },
  handstand_wall: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [214, 100], torso: 90, head: 20, arm: { to: [214, GROUND - 2] }, leg: { a: -14, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [214, 128], torso: 90, head: 20, arm: { to: [214, GROUND - 2] }, leg: { a: -14, b: 0 }, foot: 60 } },
    ],
    props: [{ type: "wall", x: 250, side: "right" }],
    focus: ["elbow", "shoulder"],
    phases: ["HEELS ON WALL · LOCKED OUT", "LOWER · ELBOWS 45°", "CROWN TO DECK"],
  },
  handstand_freestanding: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [214, 100], torso: 90, head: 20, arm: { to: [214, GROUND - 2] }, leg: { a: 0, b: 0 }, foot: 60, sway: 1.5 } },
      { t: 1, pose: { hip: [214, 130], torso: 90, head: 20, arm: { to: [214, GROUND - 2] }, leg: { a: 0, b: 0 }, foot: 60, sway: 1.5 } },
    ],
    focus: ["elbow", "shoulder"],
    phases: ["FREESTANDING · FINGERS BALANCE", "LOWER WITHOUT ARCH", "CROWN TO DECK · PRESS"],
  },
  handstand_hold: {
    scale: 1,
    keys: [{ t: 0, pose: { hip: [214, 100], torso: 90, head: 20, arm: { to: [214, GROUND - 2] }, leg: { a: 0, b: 0 }, foot: 60, sway: 2 } }],
    focus: ["shoulder"],
    phases: ["STACKED · WRIST OVER SHOULDER OVER HIP", "BALANCE", "HOLD"],
  },

  // ── legs ──
  squat_air: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 90, b: 0 } }) },
      { t: 1, pose: { hip: [172, 182], torso: -55, arm: { a: 125, b: 0 }, leg: { to: [203, ANKLE_Y] } } },
    ],
    focus: ["knee", "hip"],
    phases: ["STAND TALL · BRACE", "HIPS BACK & DOWN", "HIP CREASE BELOW KNEE"],
  },
  squat_jump: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [172, 182], torso: -55, arm: { a: 125, b: 0 }, leg: { to: [203, ANKLE_Y] } } },
      { t: 0.5, pose: stand(200, { arm: { a: 150, b: 0 } }) },
      { t: 1, pose: { hip: [200, 92], torso: -90, arm: { a: 165, b: 0 }, leg: { a: 4, b: 18 }, foot: 60 } },
    ],
    focus: ["knee", "hip"],
    phases: ["LOAD THE SQUAT", "TRIPLE EXTENSION", "AIRBORNE · ABSORB THE LANDING"],
  },
  squat_pistol: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 90, b: 0 }, leg2: { a: 35, b: 0 } }) },
      { t: 1, pose: { hip: [180, 188], torso: -60, arm: { a: 120, b: 0 }, leg: { to: [203, ANKLE_Y] }, leg2: { a: 120, b: 0 } } },
    ],
    focus: ["knee", "hip"],
    phases: ["ONE LEG · FREE LEG FORWARD", "SIT BACK · HEEL DOWN", "ASS TO GRASS · LEG LOCKED"],
  },
  squat_pistol_jump: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [180, 188], torso: -60, arm: { a: 120, b: 0 }, leg: { to: [203, ANKLE_Y] }, leg2: { a: 120, b: 0 } } },
      { t: 1, pose: { hip: [200, 100], torso: -90, arm: { a: 160, b: 0 }, leg: { a: 4, b: 15 }, leg2: { a: 60, b: 40 }, foot: 60 } },
    ],
    focus: ["knee"],
    phases: ["PISTOL BOTTOM", "EXPLODE OFF ONE LEG", "AIRBORNE"],
  },
  squat_shrimp: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 90, b: 0 }, leg2: { a: -15, b: 130 } }) },
      { t: 1, pose: { hip: [185, 182], torso: -70, arm: { a: 110, b: 0 }, leg: { to: [203, ANKLE_Y] }, leg2: { a: -30, b: 130 } } },
    ],
    focus: ["knee"],
    phases: ["REAR FOOT HELD", "KNEE TRAVELS TO DECK", "REAR KNEE KISSES FLOOR"],
  },
  squat_sissy: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 20, b: 20 } }) },
      { t: 1, pose: { hip: [222, 165], torso: -115, arm: { a: 20, b: 20 }, leg: { to: [205, 208] }, foot: 70 } },
    ],
    focus: ["knee"],
    phases: ["HEELS UP · HIPS LOCKED", "KNEES FORWARD · LEAN BACK", "QUADS AT FULL STRETCH"],
  },
  squat_bulgarian: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [200, STAND_HIP], torso: -88, arm: { a: 10, b: 15 }, leg: { to: [225, ANKLE_Y] }, leg2: { to: [130, 188] }, foot2: 90 } },
      { t: 1, pose: { hip: [206, 178], torso: -80, arm: { a: 10, b: 15 }, leg: { to: [225, ANKLE_Y] }, leg2: { to: [130, 188] }, foot2: 90 } },
    ],
    props: [{ type: "box", x: 100, y: 190, w: 60, h: 32 }],
    focus: ["knee"],
    phases: ["REAR FOOT ON BOX", "FRONT KNEE TRACKS OVER TOES", "REAR KNEE TO DECK"],
  },
  squat_cossack: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [180, 140], torso: -90, arm: { a: 90, b: 0 }, leg: { to: [205, ANKLE_Y] }, leg2: { a: -35, b: 0 } } },
      { t: 1, pose: { hip: [205, 185], torso: -75, arm: { a: 110, b: 0 }, leg: { to: [215, ANKLE_Y] }, leg2: { a: -55, b: 0 }, foot2: -20 } },
    ],
    focus: ["knee", "hip"],
    phases: ["WIDE STANCE", "SIT INTO ONE SIDE", "FAR LEG STRAIGHT · TOES UP"],
  },
  step_up: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [195, STAND_HIP], torso: -88, arm: { a: 15, b: 30 }, leg: { to: [198, ANKLE_Y] }, leg2: { to: [258, 170] } } },
      { t: 1, pose: { hip: [255, 95], torso: -90, arm: { a: 40, b: 60 }, leg: { to: [242, 170] }, leg2: { to: [258, 170] } } },
    ],
    props: [{ type: "box", x: 232, y: 178, w: 60, h: 44 }],
    focus: ["knee"],
    phases: ["FOOT PLANTED ON BOX", "DRIVE THROUGH THE HEEL", "STAND TALL ON THE BOX"],
  },
  lunge: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 10, b: 15 } }) },
      { t: 1, pose: { hip: [200, 175], torso: -85, arm: { a: 10, b: 15 }, leg: { to: [250, ANKLE_Y] }, leg2: { a: -45, b: 40 }, foot2: 0 } },
    ],
    focus: ["knee"],
    phases: ["TALL · STEP LONG", "FRONT SHIN VERTICAL", "REAR KNEE 2cm OFF DECK"],
  },
  calf_raise: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 5, b: 10 } }) },
      { t: 1, pose: { hip: [200, STAND_HIP - 9], torso: -90, arm: { a: 5, b: 10 }, leg: { to: [203, ANKLE_Y - 9] }, foot: 78 } },
    ],
    focus: ["knee"],
    phases: ["HEELS DOWN · FULL STRETCH", "DRIVE THROUGH THE BALL OF THE FOOT", "TOP · SQUEEZE 2s"],
  },
  calf_raise_single: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 5, b: 10 }, leg2: { a: 10, b: 60 } }) },
      { t: 1, pose: { hip: [200, STAND_HIP - 9], torso: -90, arm: { a: 5, b: 10 }, leg: { to: [203, ANKLE_Y - 9] }, leg2: { a: 10, b: 60 }, foot: 78, foot2: 60 } },
    ],
    focus: ["knee"],
    phases: ["ONE LEG · FULL STRETCH", "DRIVE UP", "TOP · SQUEEZE"],
  },
  nordic_curl: {
    keys: [
      { t: 0, pose: { hip: [200, 175], torso: -90, arm: { a: 20, b: 90 }, leg: { a: 0, b: 90 }, foot: 0 } },
      { t: 1, pose: { hip: [226, 184], torso: -25, head: 10, arm: { a: 95, b: 20 }, leg: { a: 25, b: 50 }, foot: 0 } },
    ],
    props: [{ type: "anchor", x: 150, y: 206 }],
    focus: ["knee", "hip"],
    phases: ["KNEELING · ANKLES ANCHORED", "LOWER SLOW · HIPS OPEN", "HANDS CATCH THE DECK"],
  },
  nordic_curl_tuck: {
    keys: [
      { t: 0, pose: { hip: [200, 175], torso: -90, arm: { a: 20, b: 90 }, leg: { a: 0, b: 90 }, foot: 0 } },
      { t: 1, pose: { hip: [218, 180], torso: -50, head: 10, arm: { a: 60, b: 60 }, leg: { a: 12, b: 60 }, foot: 0 } },
    ],
    props: [{ type: "anchor", x: 150, y: 206 }],
    focus: ["knee"],
    phases: ["KNEELING · ANCHORED", "LOWER TO 45°", "HAMSTRINGS PULL YOU BACK"],
  },
  glute_bridge: {
    keys: [
      { t: 0, pose: { hip: [212, 206], torso: 180, head: 0, arm: { a: 360, b: 0 }, leg: { to: [255, ANKLE_Y] } } },
      { t: 1, pose: { hip: [204, 170], torso: 148, head: 15, arm: { a: 328, b: 0 }, leg: { to: [255, ANKLE_Y] } } },
    ],
    focus: ["hip", "knee"],
    phases: ["FLAT · HEELS CLOSE", "DRIVE THROUGH HEELS", "HIPS LOCKED · SQUEEZE"],
  },
  glute_bridge_single: {
    keys: [
      { t: 0, pose: { hip: [212, 206], torso: 180, arm: { a: 360, b: 0 }, leg: { to: [255, ANKLE_Y] }, leg2: { a: 80, b: 10 } } },
      { t: 1, pose: { hip: [204, 170], torso: 148, head: 15, arm: { a: 328, b: 0 }, leg: { to: [255, ANKLE_Y] }, leg2: { a: 110, b: 10 } } },
    ],
    focus: ["hip"],
    phases: ["ONE FOOT DOWN · ONE LEG UP", "DRIVE THE HEEL", "HIPS LEVEL · SQUEEZE"],
  },
  wall_sit: {
    keys: [{ t: 0, pose: { hip: [172, 175], torso: -90, arm: { a: 25, b: 40 }, leg: { a: 90, b: 90 }, sway: 1 } }],
    props: [{ type: "wall", x: 150, side: "left" }],
    focus: ["knee"],
    phases: ["THIGHS PARALLEL · BACK FLAT", "HOLD", "HOLD"],
  },

  // ── core ──
  core_plank: {
    keys: (() => {
      const b = bodyLine([118, 210], 190);
      return [{ t: 0, pose: { hip: b.hip, torso: b.torso, head: 8, arm: { a: 82, b: 90 }, leg: { to: [118, 210] }, sway: 1.2 } }];
    })(),
    focus: ["hip", "shoulder"],
    phases: ["ELBOWS UNDER SHOULDERS", "HOLLOW · GLUTES ON", "HOLD · BREATHE"],
  },
  core_hollow_body: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 176, head: 10, arm: { a: 180, b: 0 }, leg: { a: 4, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [200, 205], torso: 152, head: 22, arm: { a: 180, b: 0 }, leg: { a: 12, b: 0 }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["LOWER BACK PRESSED TO DECK", "LIFT SHOULDERS & HEELS", "BANANA · HOLD"],
  },
  core_deadbug: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 180, head: -15, arm: { a: 90, b: 0 }, leg: { a: 90, b: 90 } } },
      { t: 1, pose: { hip: [200, 205], torso: 180, head: -15, arm: { a: 90, b: 0 }, arm2: { a: 178, b: 0 }, leg: { a: 90, b: 90 }, leg2: { a: 12, b: 0 }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["TABLETOP · ARMS UP", "EXTEND OPPOSITE ARM & LEG", "HOVER · BACK FLAT"],
  },
  leg_raise_lying: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: -5, b: 0 }, leg: { a: 2, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: -5, b: 0 }, leg: { a: 85, b: 0 }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["HEELS HOVER", "RAISE · LEGS LOCKED", "VERTICAL · LOWER SLOW"],
  },
  flutter_kicks: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 175, head: -15, arm: { a: -5, b: 0 }, leg: { a: 12, b: 0 }, leg2: { a: 32, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [200, 205], torso: 175, head: -15, arm: { a: -5, b: 0 }, leg: { a: 32, b: 0 }, leg2: { a: 12, b: 0 }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["HEELS 15cm OFF DECK", "SCISSOR", "SCISSOR · BACK FLAT"],
  },
  bicycle: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 165, head: -25, arm: { a: 165, b: 130 }, leg: { a: 110, b: 110 }, leg2: { a: 8, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [200, 205], torso: 165, head: -25, arm: { a: 165, b: 130 }, leg: { a: 8, b: 0 }, leg2: { a: 110, b: 110 }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["SHOULDERS OFF DECK", "ELBOW TO OPPOSITE KNEE", "SWITCH"],
  },
  situp: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: 160, b: 130 }, leg: { to: [250, ANKLE_Y] } } },
      { t: 1, pose: { hip: [200, 205], torso: -65, head: 15, arm: { a: 160, b: 130 }, leg: { to: [250, ANKLE_Y] } } },
    ],
    focus: ["hip"],
    phases: ["FLAT · KNEES BENT", "CURL UP · CHIN TUCKED", "CHEST TO KNEES"],
  },
  crunch: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: 160, b: 130 }, leg: { to: [250, ANKLE_Y] } } },
      { t: 1, pose: { hip: [200, 205], torso: 150, head: -5, arm: { a: 160, b: 130 }, leg: { to: [250, ANKLE_Y] } } },
    ],
    focus: ["hip"],
    phases: ["FLAT", "SHOULDER BLADES OFF DECK", "SQUEEZE · LOWER SLOW"],
  },
  reverse_crunch: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: -5, b: 0 }, leg: { a: 90, b: 90 } } },
      { t: 1, pose: { hip: [204, 190], torso: 200, head: -10, arm: { a: -5, b: 0 }, leg: { a: 140, b: 130 } } },
    ],
    focus: ["hip"],
    phases: ["TABLETOP", "CURL HIPS OFF DECK", "KNEES TO CHEST · NO SWING"],
  },
  russian_twist: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: -120, head: 20, arm: { a: 100, b: 30 }, leg: { a: 110, b: 60 }, foot: 60 } },
      { t: 1, pose: { hip: [200, 205], torso: -120, head: 20, arm: { a: 60, b: 40 }, leg: { a: 110, b: 60 }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["V-SIT · FEET UP", "ROTATE SHOULDERS", "TOUCH DECK · SWITCH"],
  },
  superman: {
    keys: [
      { t: 0, pose: { hip: [190, 205], torso: 0, head: -8, arm: { a: 180, b: 0 }, leg: { a: 0, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [190, 205], torso: -14, head: -12, arm: { a: 180, b: 0 }, leg: { a: -14, b: 0 }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["PRONE · ARMS LONG", "LIFT CHEST & THIGHS", "HOLD 2s · SQUEEZE"],
  },
  core_toes_to_bar: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90, -90, { a: 5, b: 0 }, { foot: 60 }) }, { t: 1, pose: hang(92, -84, { a: 165, b: 0 }, { foot: 60 }) }],
    props: [BAR],
    focus: ["hip"],
    phases: ["DEAD HANG · LEGS LOCKED", "COMPRESS · LATS PULL", "TOES TO THE BAR"],
  },
  core_hanging_knee: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90, -90, { a: 5, b: 10 }, { foot: 60 }) }, { t: 1, pose: hang(90, -88, { a: 115, b: 125 }, { foot: 60 }) }],
    props: [BAR],
    focus: ["hip", "knee"],
    phases: ["DEAD HANG", "DRIVE KNEES UP", "KNEES ABOVE HIPS · PAUSE"],
  },
  core_lsit: {
    keys: [
      { t: 0, pose: { hip: [200, 199], torso: -90, arm: { to: [205, 195] }, leg: { a: 75, b: 60 }, foot: 60 } },
      { t: 1, pose: { hip: [200, 199], torso: -90, arm: { to: [205, 195] }, leg: { a: 92, b: 0 }, foot: 60 } },
    ],
    props: [{ type: "parallettes", y: 195 }],
    focus: ["hip", "shoulder"],
    phases: ["TUCK · SHOULDERS DEPRESSED", "EXTEND LEGS", "L-SIT · KNEES LOCKED"],
  },
  core_dragon_flag: {
    keys: [
      { t: 0, pose: { hip: [140 + 62 * 0.64, 205 - 62 * 0.77], torso: 130, head: 20, arm: { a: 180, b: 20 }, leg: { a: 0, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [202, 204], torso: 179, head: 10, arm: { a: 180, b: 20 }, leg: { a: 0, b: 0 }, foot: 60 } },
    ],
    props: [{ type: "anchor", x: 128, y: 206 }],
    focus: ["hip", "shoulder"],
    phases: ["SHOULDERS DOWN · BODY RIGID", "LOWER · NO HIP BREAK", "HOVER · REVERSE"],
  },
  core_dragon_flag_tuck: {
    keys: [
      { t: 0, pose: { hip: [140 + 62 * 0.64, 205 - 62 * 0.77], torso: 130, head: 20, arm: { a: 180, b: 20 }, leg: { a: 60, b: 100 }, foot: 60 } },
      { t: 1, pose: { hip: [202, 204], torso: 179, head: 10, arm: { a: 180, b: 20 }, leg: { a: 60, b: 100 }, foot: 60 } },
    ],
    props: [{ type: "anchor", x: 128, y: 206 }],
    focus: ["hip"],
    phases: ["TUCKED · SHOULDERS DOWN", "LOWER THE TUCK", "HOVER"],
  },
  core_windshield_wipers: {
    scale: 1,
    keys: [{ t: 0, pose: hang(90, -90, { a: 150, b: 0 }, { foot: 60 }) }, { t: 1, pose: hang(92, -86, { a: 185, b: 0 }, { foot: 60 }) }],
    props: [BAR],
    focus: ["hip"],
    phases: ["LEGS UP TO THE BAR", "SWEEP SIDE TO SIDE", "CONTROL · NO SWING"],
  },
  core_human_flag: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [208, 132], torso: 160, head: -10, arm: { to: [122, 66] }, arm2: { to: [122, 150] }, leg: { a: 0, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [212, 110], torso: 180, head: -10, arm: { to: [122, 60] }, arm2: { to: [122, 152] }, leg: { a: 0, b: 0 }, foot: 60 } },
    ],
    props: [{ type: "pole", x: 122 }],
    focus: ["shoulder", "hip"],
    phases: ["PRESS / PULL GRIP", "LEVER UP", "HORIZONTAL FLAG"],
  },
  core_mountain_climber: {
    keys: [
      { t: 0, pose: { ...PLANK_TOP[0], head: 30, leg: { to: [128, 210] }, leg2: { a: 150, b: 140 }, foot2: 60 } },
      { t: 1, pose: { ...PLANK_TOP[0], head: 30, leg: { a: 150, b: 140 }, leg2: { to: [128, 210] }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["PLANK · KNEE TO CHEST", "SWITCH", "SWITCH · HIPS LOW"],
  },
  burpee_complex: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 170, b: 0 } }) },
      { t: 0.33, pose: { hip: [185, 178], torso: -35, head: 20, arm: { to: [238, GROUND - 2] }, leg: { to: [203, ANKLE_Y] } } },
      { t: 0.66, pose: PLANK_TOP[0] },
      { t: 1, pose: PLANK_TOP[1] },
    ],
    focus: ["hip", "elbow"],
    phases: ["STAND · REACH", "DROP · HANDS DOWN · KICK BACK", "PUSH-UP · SPRING BACK · JUMP"],
  },
  inchworm: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [200, 140], torso: 68, head: 10, arm: { to: [232, GROUND - 2] }, leg: { to: [203, ANKLE_Y] } } },
      { t: 1, pose: PLANK_TOP[0] },
    ],
    focus: ["hip"],
    phases: ["FOLD · HANDS TO DECK", "WALK HANDS OUT", "PLANK · WALK BACK"],
  },

  // ── conditioning ──
  jumping_jack: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 5, b: 5 } }) },
      { t: 1, pose: { hip: [200, 132], torso: -90, arm: { a: 172, b: 0 }, leg: { to: [228, ANKLE_Y] }, leg2: { to: [176, ANKLE_Y] } } },
    ],
    focus: ["hip"],
    phases: ["FEET TOGETHER", "JUMP · ARMS OVERHEAD", "LAND WIDE · REPEAT"],
  },
  rocket_jump: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [172, 182], torso: -55, arm: { a: 20, b: 40 }, leg: { to: [203, ANKLE_Y] } } },
      { t: 1, pose: { hip: [200, 104], torso: -90, arm: { a: 178, b: 0 }, leg: { a: 0, b: 20 }, foot: 70 } },
    ],
    focus: ["hip", "knee"],
    phases: ["QUARTER SQUAT · LOAD", "EXPLODE · FULL EXTENSION", "ROCKET · SOFT LANDING"],
  },
  run: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [200, 128], torso: -80, arm: { a: 60, b: 100 }, arm2: { a: -40, b: 90 }, leg: { a: 60, b: 100 }, leg2: { a: -25, b: 30 }, foot: 60 } },
      { t: 1, pose: { hip: [200, 132], torso: -80, arm: { a: -40, b: 90 }, arm2: { a: 60, b: 100 }, leg: { a: -25, b: 30 }, leg2: { a: 60, b: 100 }, foot: 60 } },
    ],
    focus: ["knee"],
    phases: ["DRIVE THE KNEE", "STRIDE", "SWITCH · ARMS PUMP"],
  },
  vacuum: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [200, 142], torso: -62, head: 10, arm: { to: [228, 176] }, leg: { to: [205, ANKLE_Y] } } },
      { t: 1, pose: { hip: [200, 142], torso: -64, head: 8, arm: { to: [228, 176] }, leg: { to: [205, ANKLE_Y] } } },
    ],
    focus: ["hip"],
    phases: ["HANDS ON KNEES · EXHALE FULLY", "NAVEL TO SPINE", "HOLD · NO BREATH"],
  },
  chest_squeeze: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 62, b: 62 } }) },
      { t: 1, pose: stand(200, { arm: { a: 66, b: 66 } }) },
    ],
    focus: ["elbow"],
    phases: ["PALMS TOGETHER · CHEST HEIGHT", "PRESS · PECS SQUEEZE", "HOLD 10s"],
  },

  // ── stretches / mobility ──
  stretch_upper: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [200, STAND_HIP], torso: -90, arm: { to: [258, 82] }, arm2: { a: 10, b: 10 }, leg: { to: [203, ANKLE_Y] }, leg2: { to: [175, ANKLE_Y] } } },
      { t: 1, pose: { hip: [206, STAND_HIP], torso: -96, head: 5, arm: { to: [258, 82] }, arm2: { a: 10, b: 10 }, leg: { to: [206, ANKLE_Y] }, leg2: { to: [178, ANKLE_Y] } } },
    ],
    props: [{ type: "wall", x: 260, side: "right" }],
    focus: ["shoulder"],
    phases: ["FOREARM ON WALL", "ROTATE AWAY", "CHEST OPEN · HOLD"],
  },
  stretch_overhead_triceps: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 175, b: 140 }, arm2: { a: 10, b: 10 } }) },
      { t: 1, pose: stand(200, { torso: -94, arm: { a: 185, b: 150 }, arm2: { a: 10, b: 10 } }) },
    ],
    focus: ["elbow"],
    phases: ["ELBOW UP · HAND DOWN THE SPINE", "PULL ELBOW BEHIND HEAD", "HOLD"],
  },
  stretch_arm_circles: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 0, b: 0 } }) },
      { t: 0.5, pose: stand(200, { arm: { a: 90, b: 0 } }) },
      { t: 1, pose: stand(200, { arm: { a: 180, b: 0 } }) },
    ],
    focus: ["shoulder"],
    phases: ["ARMS LONG", "SWEEP", "FULL CIRCLE"],
  },
  stretch_wrist: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 90, b: 0 } }) },
      { t: 1, pose: stand(200, { arm: { a: 90, b: 0 } }) },
    ],
    focus: ["elbow"],
    phases: ["ARMS OUT · FISTS", "ROTATE WRISTS", "BOTH DIRECTIONS"],
  },
  stretch_neck: {
    scale: 1,
    keys: [{ t: 0, pose: stand(200, { head: -25 }) }, { t: 1, pose: stand(200, { head: 25 }) }],
    focus: ["shoulder"],
    phases: ["EAR TO SHOULDER", "SLOW · NO FORCE", "OTHER SIDE"],
  },
  stretch_lower: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 10, b: 10 } }) },
      { t: 1, pose: { hip: [200, 145], torso: 60, head: 10, arm: { to: [222, 214] }, leg: { to: [203, ANKLE_Y] } } },
    ],
    focus: ["hip"],
    phases: ["TALL · HINGE AT HIPS", "FOLD · KNEES SOFT", "FINGERS TO TOES · HOLD"],
  },
  stretch_quad: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: 10, b: 10 }, arm2: { a: -30, b: 70 }, leg2: { a: -20, b: 140 } }) },
      { t: 1, pose: stand(200, { torso: -92, arm: { a: 10, b: 10 }, arm2: { a: -40, b: 80 }, leg2: { a: -30, b: 150 } }) },
    ],
    focus: ["knee", "hip"],
    phases: ["HEEL TO GLUTE", "KNEES TOGETHER · HIPS FORWARD", "HOLD"],
  },
  stretch_hamstring_seated: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: -90, arm: { a: 60, b: 20 }, leg: { a: 90, b: 0 }, foot: 0 } },
      { t: 1, pose: { hip: [200, 205], torso: -35, head: 10, arm: { a: 130, b: 10 }, leg: { a: 90 - 55, b: 0 }, foot: 0 } },
    ],
    focus: ["hip"],
    phases: ["SEATED · LEGS LONG", "HINGE FORWARD · FLAT BACK", "REACH · HOLD"],
  },
  stretch_pigeon: {
    keys: [
      { t: 0, pose: { hip: [200, 200], torso: -85, arm: { to: [225, 218] }, leg: { a: 100, b: 150 }, leg2: { a: -20, b: 0 }, foot2: 60 } },
      { t: 1, pose: { hip: [200, 200], torso: -40, head: 10, arm: { to: [240, 218] }, leg: { a: 100, b: 150 }, leg2: { a: -20, b: 0 }, foot2: 60 } },
    ],
    focus: ["hip"],
    phases: ["SHIN ACROSS · REAR LEG LONG", "FOLD OVER THE SHIN", "GLUTE STRETCH · HOLD"],
  },
  stretch_calf_wall: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [205, STAND_HIP], torso: -80, arm: { to: [258, 90] }, leg: { to: [222, ANKLE_Y] }, leg2: { a: -25, b: 0 }, foot2: 30 } },
      { t: 1, pose: { hip: [212, STAND_HIP + 2], torso: -76, arm: { to: [258, 90] }, leg: { to: [226, ANKLE_Y] }, leg2: { a: -28, b: 0 }, foot2: 30 } },
    ],
    props: [{ type: "wall", x: 260, side: "right" }],
    focus: ["knee"],
    phases: ["REAR HEEL DOWN · LEG STRAIGHT", "LEAN INTO THE WALL", "CALF STRETCH · HOLD"],
  },
  stretch_lying_leg: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: 90, b: 40 }, leg: { a: 90, b: 90 }, leg2: { a: 0, b: 0 } } },
      { t: 1, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: 90, b: 40 }, leg: { a: 90, b: 0 }, leg2: { a: 0, b: 0 }, foot: 0 } },
    ],
    focus: ["knee", "hip"],
    phases: ["HIP & KNEE AT 90°", "EXTEND THE LEG", "LOCK · HOLD · LOWER"],
  },
  stretch_lying_twist: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: 90, b: 0 }, leg: { a: 90, b: 90 }, leg2: { a: 0, b: 0 } } },
      { t: 1, pose: { hip: [200, 205], torso: 180, head: -10, arm: { a: 90, b: 0 }, leg: { a: 100, b: 100 }, leg2: { a: 0, b: 0 } } },
    ],
    focus: ["hip"],
    phases: ["ARMS OUT · KNEE UP", "DROP KNEE ACROSS", "SHOULDERS FLAT · HOLD"],
  },
  stretch_core: {
    keys: [
      { t: 0, pose: { hip: [190, 205], torso: 0, head: -10, arm: { to: [248, GROUND - 2] }, leg: { a: 0, b: 0 }, foot: 60 } },
      { t: 1, pose: { hip: [190, 205], torso: -35, head: -20, arm: { to: [248, GROUND - 2] }, leg: { a: 0, b: 0 }, foot: 60 } },
    ],
    focus: ["hip", "elbow"],
    phases: ["PRONE · HANDS UNDER SHOULDERS", "PRESS THE CHEST UP", "COBRA · HIPS DOWN"],
  },
  stretch_child: {
    keys: [
      { t: 0, pose: { hip: [205, 172], torso: 20, head: 20, arm: { a: 200, b: 0 }, leg: { a: 100, b: 60 }, foot: 60 } },
      { t: 1, pose: { hip: [205, 176], torso: 42, head: 20, arm: { a: 218, b: 0 }, leg: { a: 100, b: 60 }, foot: 60 } },
    ],
    focus: ["hip"],
    phases: ["KNEES WIDE · SIT BACK", "REACH LONG", "FOREHEAD DOWN · BREATHE"],
  },
  stretch_seated_twist: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: -90, arm: { a: 100, b: 100 }, arm2: { a: -20, b: 0 }, leg: { a: 110, b: 120 }, leg2: { a: 90, b: 0 }, foot2: 0 } },
      { t: 1, pose: { hip: [200, 205], torso: -96, head: -10, arm: { a: 60, b: 100 }, arm2: { a: -35, b: 0 }, leg: { a: 110, b: 120 }, leg2: { a: 90, b: 0 }, foot2: 0 } },
    ],
    focus: ["hip"],
    phases: ["TALL SPINE · KNEE UP", "ROTATE INTO THE KNEE", "HOLD · BREATHE"],
  },
  stretch_thread_needle: {
    keys: [
      { t: 0, pose: { hip: [200, 178], torso: 0, head: 0, arm: { to: [265, GROUND - 2] }, arm2: { a: 120, b: 60 }, leg: { a: 90, b: 90 }, foot: 60 } },
      { t: 1, pose: { hip: [200, 182], torso: 6, head: 10, arm: { to: [265, GROUND - 2] }, arm2: { a: 30, b: 20 }, leg: { a: 90, b: 90 }, foot: 60 } },
    ],
    focus: ["shoulder"],
    phases: ["QUADRUPED", "THREAD THE ARM UNDER", "SHOULDER TO DECK · HOLD"],
  },
  stretch_seated_arms_back: {
    keys: [
      { t: 0, pose: { hip: [200, 205], torso: -90, arm: { a: -40, b: 0 }, leg: { a: 90, b: 0 }, foot: 0 } },
      { t: 1, pose: { hip: [206, 205], torso: -84, head: 5, arm: { a: -60, b: 0 }, leg: { a: 90, b: 0 }, foot: 0 } },
    ],
    focus: ["shoulder"],
    phases: ["HANDS BEHIND · FINGERS BACK", "WALK HANDS BACK", "CHEST OPEN · HOLD"],
  },
  leg_swing: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { to: [258, 96] }, leg2: { a: -30, b: 10 } }) },
      { t: 1, pose: stand(200, { arm: { to: [258, 96] }, leg2: { a: 70, b: 0 } }) },
    ],
    props: [{ type: "wall", x: 260, side: "right" }],
    focus: ["hip"],
    phases: ["HAND ON WALL", "SWING FRONT TO BACK", "CONTROLLED · TALL"],
  },
  hip_circles: {
    scale: 1,
    keys: [
      { t: 0, pose: stand(200, { arm: { a: -30, b: 90 }, hip: [196, STAND_HIP + 2] }) },
      { t: 0.5, pose: stand(200, { arm: { a: -30, b: 90 }, hip: [208, STAND_HIP], torso: -96 }) },
      { t: 1, pose: stand(200, { arm: { a: -30, b: 90 }, hip: [196, STAND_HIP + 2], torso: -84 }) },
    ],
    focus: ["hip"],
    phases: ["HANDS ON HIPS", "CIRCLE THE PELVIS", "BOTH DIRECTIONS"],
  },
  knee_circles: {
    scale: 1,
    keys: [
      { t: 0, pose: { hip: [200, 150], torso: -70, head: 10, arm: { to: [224, 176] }, leg: { to: [203, ANKLE_Y] } } },
      { t: 0.5, pose: { hip: [206, 156], torso: -72, head: 10, arm: { to: [228, 180] }, leg: { to: [203, ANKLE_Y] } } },
      { t: 1, pose: { hip: [194, 154], torso: -68, head: 10, arm: { to: [220, 178] }, leg: { to: [203, ANKLE_Y] } } },
    ],
    focus: ["knee"],
    phases: ["HANDS ON KNEES", "CIRCLE", "BOTH DIRECTIONS"],
  },
  groiner: {
    keys: [
      { t: 0, pose: PLANK_TOP[0] },
      { t: 1, pose: { ...PLANK_TOP[0], leg2: { to: [270, ANKLE_Y] }, head: 30 } },
    ],
    focus: ["hip"],
    phases: ["PLANK", "FOOT TO OUTSIDE OF HAND", "SINK THE HIP · SWITCH"],
  },
};

// ── Classification ─────────────────────────────────────────────────────────
type FigureType = string | undefined;

/** Map an exercise (catalog id + name + declared figure family) to a move. */
export function classifyMove(id: string, name: string, figureType?: FigureType): string {
  if (id in MOVES) return id;
  const s = `${id} ${name}`.toLowerCase().replace(/[_-]+/g, " ");
  const has = (...words: string[]) => words.some((w) => s.includes(w));

  // stretches & mobility first — many share words with the strength moves
  if (has("doorway", "one arm against wall", "biceps wall")) return "stretch_upper";
  if (has("overhead triceps")) return "stretch_overhead_triceps";
  if (has("arm circle")) return "stretch_arm_circles";
  if (has("wrist")) return "stretch_wrist";
  if (has("neck")) return "stretch_neck";
  if (has("cobra", "lower back curl")) return "stretch_core";
  if (has("child")) return "stretch_child";
  if (has("seated twist")) return "stretch_seated_twist";
  if (has("thread")) return "stretch_thread_needle";
  if (has("couch", "quad stretch", "all fours quad")) return "stretch_quad";
  if (has("pancake", "toe toucher", "hamstring stretch")) return has("toe toucher") ? "stretch_lower" : "stretch_hamstring_seated";
  if (has("pigeon", "lying glute")) return "stretch_pigeon";
  if (has("calf stretch")) return "stretch_calf_wall";
  if (has("90 90", "90/90")) return "stretch_lying_leg";
  if (has("lying crossover")) return "stretch_lying_twist";
  if (has("seated front deltoid", "seated biceps")) return "stretch_seated_arms_back";
  if (has("front leg raise")) return "leg_swing";
  if (has("hip circle")) return "hip_circles";
  if (has("knee circle")) return "knee_circles";
  if (has("groiner")) return "groiner";
  if (has("lat hang", "dead hang", "one handed hang", "scapular")) return "dead_hang";
  if (has("inchworm")) return "inchworm";
  if (has("stomach vacuum", "vacuum")) return "vacuum";
  if (has("isometric chest")) return "chest_squeeze";
  if (has("side bridge", "side plank")) return "core_plank";

  // conditioning
  if (has("star jump", "jumping jack")) return "jumping_jack";
  if (has("rocket jump")) return "rocket_jump";
  if (has("sprint", "skipping", "running", "high knee")) return "run";
  if (has("burpee")) return "burpee_complex";
  if (has("mountain")) return "core_mountain_climber";

  // push
  if (has("incline push")) return "pushup_incline";
  if (has("decline", "feet elevated")) return "pushup_decline";
  if (has("diamond", "close triceps")) return "pushup_diamond";
  if (has("archer push")) return "pushup_archer";
  if (has("clapping", "plyo push")) return "pushup_clapping";
  if (has("one arm", "onearm") && has("push")) return "pushup_onearm";
  if (has("aztec")) return "pushup_clapping";
  if (has("pseudo")) return "pushup_pseudo_planche";
  if (has("planche push")) return "planche_pushup";
  if (has("knee push")) return "pushup_knee";
  if (has("pike")) return "pike_pushup";
  if (has("push")) return "pushup_standard";

  // pull
  if (has("muscle up", "muscleup")) return "muscle_up";
  if (has("front lever")) return has("tuck") ? "front_lever_tuck" : "front_lever";
  if (has("back lever")) return "back_lever";
  if (has("archer pull")) return "pullup_archer";
  if (has("chin up", "chinup", "supinated")) return "pullup_chinup";
  if (has("wide")) return "pullup_wide";
  if (has("l sit pull", "lsit pull")) return "pullup_lsit";
  if (has("chest to bar")) return "pullup_chest_to_bar";
  if (has("one arm", "onearm") && has("pull")) return "pullup_onearm";
  if (has("australian", "inverted row", "row")) return "pullup_australian";
  if (has("gorilla")) return "core_hanging_knee";
  if (has("toes to bar", "hanging leg raise")) return "core_toes_to_bar";
  if (has("hanging knee", "knee raise") && !has("step")) return "core_hanging_knee";
  if (has("windshield")) return "core_windshield_wipers";
  if (has("pull up", "pullup", "pullups")) return "pullup_strict";
  if (has("body up")) return "dip_straight_bar";

  // handstand & dips
  if (has("freestanding")) return "handstand_freestanding";
  if (has("handstand", "hspu")) return has("hold") ? "handstand_hold" : "handstand_wall";
  if (has("straight bar dip")) return "dip_straight_bar";
  if (has("bench dip", "chair dip", "triceps version")) return "dip_bench";
  if (has("dip")) return "dip_parallel";

  // legs
  if (has("pistol") && has("jump")) return "squat_pistol_jump";
  if (has("pistol")) return "squat_pistol";
  if (has("shrimp")) return "squat_shrimp";
  if (has("sissy")) return "squat_sissy";
  if (has("bulgarian", "split squat")) return "squat_bulgarian";
  if (has("cossack", "dragon squat")) return "squat_cossack";
  if (has("jump squat", "squat jump")) return "squat_jump";
  if (has("step up")) return "step_up";
  if (has("lunge")) return "lunge";
  if (has("nordic", "glute ham")) return has("tuck") ? "nordic_curl_tuck" : "nordic_curl";
  if (has("calf", "donkey")) return has("single") ? "calf_raise_single" : "calf_raise";
  if (has("wall sit")) return "wall_sit";
  if (has("squat")) return "squat_air";
  if (has("bridge", "hip thrust")) return has("single") ? "glute_bridge_single" : "glute_bridge";

  // core
  if (has("dead bug", "deadbug")) return "core_deadbug";
  if (has("hollow")) return "core_hollow_body";
  if (has("human flag")) return "core_human_flag";
  if (has("dragon flag")) return has("tuck") ? "core_dragon_flag_tuck" : "core_dragon_flag";
  if (has("l sit", "lsit")) return "core_lsit";
  if (has("plank", "side bridge")) return "core_plank";
  if (has("flutter", "scissor")) return "flutter_kicks";
  if (has("air bike", "bicycle")) return "bicycle";
  if (has("russian")) return "russian_twist";
  if (has("reverse crunch")) return "reverse_crunch";
  if (has("crunch")) return "crunch";
  if (has("sit up", "situp")) return "situp";
  if (has("superman", "hyperextension")) return "superman";
  if (has("leg raise")) return "leg_raise_lying";

  // fall back on the declared family
  switch (figureType) {
    case "pushup": return "pushup_standard";
    case "pullup": return "pullup_strict";
    case "dip": return "dip_parallel";
    case "squat": return "squat_air";
    case "lunge": return "lunge";
    case "plank": return "core_plank";
    case "leg_raise": return "core_toes_to_bar";
    case "handstand": return "handstand_wall";
    case "muscle_up": return "muscle_up";
    case "planche": return "planche_pushup";
    case "bridge": return "glute_bridge";
    case "calf_raise": return "calf_raise";
    case "stretch_upper": return "stretch_upper";
    case "stretch_lower": return "stretch_lower";
    case "stretch_core": return "stretch_core";
  }
  return "pushup_standard";
}
