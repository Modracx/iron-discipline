"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { CalisthenicsExercise, MuscleId } from "@/data/calisthenics-data";
import {
  GROUND,
  MOVES,
  SEG,
  classifyMove,
  deg,
  dir,
  muscleAnchor,
  poseAt,
  resolve,
  type JointName,
  type Move,
  type PropSpec,
  type Skeleton,
  type Vec,
} from "@/lib/rig2d";

const MotionFigure3D = dynamic(() => import("@/components/MotionFigure3D"), { ssr: false });

interface Props {
  exercise: CalisthenicsExercise;
  highlightMuscle?: MuscleId | null;
  compact?: boolean;
}

// Blueprint palette
export const INK = "#d4cfb8"; // outline
const INK_FAR = "#7d8470"; // far-side limbs
const FILL = "#273425";
const FILL_FAR = "#1a221a";
export const EMBER = "#f97316";
const GO = "#22c55e";
export const LINE = "#2e372b";

const pt = (v: Vec) => `${v[0].toFixed(1)},${v[1].toFixed(1)}`;

// ── Figure ────────────────────────────────────────────────────────────────
function Limb({ points, width, far }: { points: Vec[]; width: number; far?: boolean }) {
  const p = points.map(pt).join(" ");
  return (
    <>
      <polyline points={p} fill="none" stroke={far ? INK_FAR : INK} strokeWidth={width + 3} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={p} fill="none" stroke={far ? FILL_FAR : FILL} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

export function Figure({ s }: { s: Skeleton }) {
  const [arm, arm2] = s.arms;
  const [leg, leg2] = s.legs;
  const front = s.torso + 90;
  const sh1 = dir(s.shoulder, front, 10);
  const sh2 = dir(s.shoulder, front, -10);
  const hp1 = dir(s.hip, front, -9);
  const hp2 = dir(s.hip, front, 9);
  const torso = [sh1, sh2, hp1, hp2].map(pt).join(" ");
  const neckBase = dir(s.shoulder, s.headAbs, 4);
  const neckTop = dir(s.shoulder, s.headAbs, SEG.neck + 2);
  const nose = dir(s.headC, s.headAbs + 90, SEG.head + 1);
  const chin = dir(s.headC, s.headAbs + 130, SEG.head);
  return (
    <g>
      {/* far side */}
      <Limb far points={[arm2.shoulder, arm2.elbow, arm2.wrist, arm2.hand]} width={8} />
      <Limb far points={[leg2.hip, leg2.knee, leg2.ankle]} width={10} />
      <Limb far points={[leg2.ankle, leg2.toe]} width={5} />
      {/* torso */}
      <polygon points={torso} fill={FILL} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <polygon points={torso} fill={FILL} stroke="none" />
      <line x1={sh1[0]} y1={sh1[1]} x2={hp2[0]} y2={hp2[1]} stroke={INK} strokeWidth={0.6} opacity={0.35} />
      {/* near leg */}
      <Limb points={[leg.hip, leg.knee, leg.ankle]} width={11} />
      <Limb points={[leg.ankle, leg.toe]} width={6} />
      {/* neck + head */}
      <line x1={neckBase[0]} y1={neckBase[1]} x2={neckTop[0]} y2={neckTop[1]} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <line x1={neckBase[0]} y1={neckBase[1]} x2={neckTop[0]} y2={neckTop[1]} stroke={FILL} strokeWidth={6} strokeLinecap="round" />
      <circle cx={s.headC[0]} cy={s.headC[1]} r={SEG.head} fill={FILL} stroke={INK} strokeWidth={2} />
      <polyline points={[nose, chin].map(pt).join(" ")} fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      {/* near arm */}
      <Limb points={[arm.shoulder, arm.elbow, arm.wrist, arm.hand]} width={9} />
      <circle cx={s.shoulder[0]} cy={s.shoulder[1]} r={3.2} fill={FILL} stroke={INK} strokeWidth={1.2} />
      <circle cx={s.hip[0]} cy={s.hip[1]} r={3.2} fill={FILL} stroke={INK} strokeWidth={1.2} />
    </g>
  );
}

// ── Props / environment ───────────────────────────────────────────────────
export function Prop({ p }: { p: PropSpec }) {
  const hatch = (x: number, y: number, w: number, h: number, key: string) => (
    <g key={key} clipPath={`url(#clip-${key})`}>
      <clipPath id={`clip-${key}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      {Array.from({ length: Math.ceil((w + h) / 9) }, (_, i) => (
        <line key={i} x1={x - h + i * 9} y1={y + h} x2={x + i * 9} y2={y} stroke={INK} strokeWidth={0.6} opacity={0.35} />
      ))}
    </g>
  );
  switch (p.type) {
    case "bar":
      return (
        <g>
          <line x1={126} y1={0} x2={126} y2={p.y} stroke={INK} strokeWidth={4} />
          <line x1={274} y1={0} x2={274} y2={p.y} stroke={INK} strokeWidth={4} />
          <line x1={120} y1={p.y} x2={280} y2={p.y} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={150} y1={p.y} x2={250} y2={p.y} stroke={EMBER} strokeWidth={1.2} strokeDasharray="2 3" />
        </g>
      );
    case "lowbar":
      return (
        <g>
          <line x1={170} y1={GROUND} x2={170} y2={p.y} stroke={INK} strokeWidth={4} />
          <line x1={230} y1={GROUND} x2={230} y2={p.y} stroke={INK} strokeWidth={4} />
          <line x1={160} y1={p.y} x2={240} y2={p.y} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    case "pbars":
      return (
        <g>
          {[176, 224].map((x) => (
            <g key={x}>
              <line x1={x} y1={GROUND} x2={x} y2={p.y} stroke={INK} strokeWidth={4} />
              <line x1={x - 22} y1={p.y} x2={x + 22} y2={p.y} stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={x === 176 ? 0.55 : 1} />
            </g>
          ))}
        </g>
      );
    case "parallettes":
      return (
        <g>
          <line x1={205} y1={GROUND} x2={205} y2={p.y} stroke={INK} strokeWidth={3} />
          <line x1={190} y1={p.y} x2={220} y2={p.y} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <line x1={196} y1={GROUND} x2={214} y2={GROUND} stroke={INK} strokeWidth={3} />
        </g>
      );
    case "box":
    case "bench":
      return (
        <g>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="#131a13" stroke={INK} strokeWidth={1.5} />
          {hatch(p.x, p.y, p.w, p.h, `${p.type}-${p.x}`)}
        </g>
      );
    case "wall": {
      const w = 14;
      const x = p.side === "right" ? p.x : p.x - w;
      return (
        <g>
          <line x1={p.x} y1={0} x2={p.x} y2={GROUND} stroke={INK} strokeWidth={2} />
          {hatch(x, 0, w, GROUND, `wall-${p.x}`)}
        </g>
      );
    }
    case "pole":
      return <line x1={p.x} y1={0} x2={p.x} y2={GROUND} stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    case "anchor":
      return <rect x={p.x - 8} y={p.y} width={16} height={GROUND - p.y} fill="#131a13" stroke={INK} strokeWidth={1.5} />;
  }
}

// ── Annotations ───────────────────────────────────────────────────────────
function jointRays(s: Skeleton, j: JointName): [Vec, Vec, Vec] {
  const arm = s.arms[0];
  const leg = s.legs[0];
  switch (j) {
    case "elbow": return [arm.elbow, arm.shoulder, arm.wrist];
    case "knee": return [leg.knee, leg.hip, leg.ankle];
    case "hip": return [s.hip, s.shoulder, leg.knee];
    case "shoulder": return [s.shoulder, s.hip, arm.elbow];
  }
}

function AngleArc({ s, joint }: { s: Skeleton; joint: JointName }) {
  const [J, A, B] = jointRays(s, joint);
  const a1 = deg(Math.atan2(A[1] - J[1], A[0] - J[0]));
  const a2 = deg(Math.atan2(B[1] - J[1], B[0] - J[0]));
  let delta = a2 - a1;
  delta = ((((delta + 180) % 360) + 360) % 360) - 180;
  const r = 15;
  const p1 = dir(J, a1, r);
  const p2 = dir(J, a2, r);
  const mid = dir(J, a1 + delta / 2, r + 12);
  const interior = Math.round(Math.abs(delta));
  return (
    <g>
      <path d={`M ${pt(p1)} A ${r} ${r} 0 0 ${delta > 0 ? 1 : 0} ${pt(p2)}`} fill="none" stroke={EMBER} strokeWidth={1.2} />
      <circle cx={J[0]} cy={J[1]} r={3.6} fill="#131812" stroke={EMBER} strokeWidth={1.6} />
      <text x={mid[0]} y={mid[1] + 3} fill={EMBER} fontSize={8.5} fontFamily="var(--font-barlow-cond)" fontWeight="bold" textAnchor="middle">
        {interior}°
      </text>
    </g>
  );
}

function motionVector(move: Move, t: number): { at: Vec; dir: Vec } | null {
  const dt = 0.03;
  const a = resolve(poseAt(move, Math.max(0, t - dt)), t);
  const b = resolve(poseAt(move, Math.min(1, t + dt)), t);
  // the body (hip / shoulder) is the primary signal; a limb only when the body is still
  const groups: [Vec, Vec][][] = [
    [[a.hip, b.hip], [a.shoulder, b.shoulder]],
    [[a.legs[0].ankle, b.legs[0].ankle], [a.legs[1].ankle, b.legs[1].ankle], [a.arms[0].wrist, b.arms[0].wrist]],
  ];
  for (const cands of groups) {
    let best: { at: Vec; dir: Vec; len: number } | null = null;
    for (const [p, q] of cands) {
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const len = Math.hypot(dx, dy);
      if (len > (best?.len ?? 0.8)) best = { at: p, dir: [Math.round((dx / len) * 1000) / 1000, Math.round((dy / len) * 1000) / 1000], len };
    }
    if (best) return best;
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────
export default function ExerciseBlueprint2D({ exercise, highlightMuscle, compact = false }: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [motionProgress, setMotionProgress] = useState(0);
  const [phaseMode, setPhaseMode] = useState<"animate" | "start" | "end">("animate");
  const [view, setView] = useState<"2d" | "3d">("2d");
  const bp = exercise.blueprint;

  const moveKey = useMemo(() => classifyMove(exercise.id, exercise.name, bp.figureType), [exercise.id, exercise.name, bp.figureType]);
  const move = MOVES[moveKey] ?? MOVES.pushup_standard;
  const isStatic = move.keys.length === 1;

  useEffect(() => {
    if (phaseMode !== "animate" || !isPlaying) return;
    let animId: number;
    const startTime = performance.now();
    const period = isStatic ? 2600 : 3600;
    const loop = (now: number) => {
      const norm = ((now - startTime) % period) / period;
      // rep: concentric ↔ eccentric with a brief pause at the peak
      let prog: number;
      if (norm < 0.45) prog = norm / 0.45;
      else if (norm < 0.55) prog = 1;
      else prog = 1 - (norm - 0.55) / 0.45;
      setMotionProgress(prog);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phaseMode, isPlaying, isStatic]);

  const t = phaseMode === "start" ? 0 : phaseMode === "end" ? 1 : motionProgress;
  const pose = poseAt(move, t);
  const skel = resolve(pose, t);
  const vec = phaseMode === "animate" ? motionVector(move, t) : null;
  const muscle = (highlightMuscle ?? exercise.primaryMuscle) as MuscleId;
  const glowAt = muscleAnchor(skel, muscle);
  const tension = 0.3 + t * 0.55;

  const phaseLabel = (() => {
    const ph = move.phases ?? ["START POSITION", "TRANSITION", "PEAK CONTRACTION"];
    if (phaseMode === "start") return ph[0];
    if (phaseMode === "end") return ph[2];
    if (isStatic) return ph[1];
    return t < 0.12 ? ph[0] : t > 0.88 ? ph[2] : ph[1];
  })();

  const scale = move.scale ?? 1.35;
  const sceneTransform = scale !== 1 ? `translate(200 ${GROUND}) scale(${scale}) translate(-200 -${GROUND})` : undefined;

  return (
    <div className={`border border-line bg-pit ${compact ? "p-3" : "p-4"}`}>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2.5 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-stencil text-sm tracking-wide text-ember">
              2D MOTION BLUEPRINT // {exercise.name.toUpperCase()}
            </span>
            <span className="font-cond text-[10px] font-bold text-drab border border-line px-1.5 py-0.5 bg-night uppercase">
              {bp.motionVector}
            </span>
          </div>
          <div className="font-cond text-xs text-drab mt-0.5">
            TEMPO: {exercise.tempo} · FOCAL: {bp.focalJoints.join(" / ")}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-cond text-xs font-bold">
          <div className="mr-2 flex border border-line">
            {(["2d", "3d"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`cursor-pointer px-2 py-0.5 tracking-wider transition-colors ${
                  view === v ? "bg-bone text-night" : "bg-night text-drab hover:text-bone"
                }`}
              >
                {v === "2d" ? "2D BLUEPRINT" : "3D MOTION"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setPhaseMode("animate");
              setIsPlaying(!isPlaying);
            }}
            className={`cursor-pointer border px-2 py-0.5 transition-colors ${
              isPlaying && phaseMode === "animate"
                ? "border-ember bg-ember text-night"
                : "border-line bg-night text-drab hover:border-ember hover:text-bone"
            }`}
          >
            {isPlaying && phaseMode === "animate" ? "PAUSE [❚❚]" : "PLAY [▶]"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setPhaseMode("start");
            }}
            className={`cursor-pointer border px-2 py-0.5 transition-colors ${
              phaseMode === "start"
                ? "border-bone bg-bone text-night"
                : "border-line bg-night text-drab hover:border-bone hover:text-bone"
            }`}
          >
            ALPHA (START)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setPhaseMode("end");
            }}
            className={`cursor-pointer border px-2 py-0.5 transition-colors ${
              phaseMode === "end"
                ? "border-ember bg-ember text-night"
                : "border-line bg-night text-drab hover:border-ember hover:text-bone"
            }`}
          >
            OMEGA (PEAK)
          </button>
        </div>
      </div>

      {/* ── VECTOR MOTION CANVAS ───────────────────────────────────── */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[340px] bg-gradient-to-b from-[#111712] via-night to-[#0d120e] border border-line overflow-hidden">
        {view === "3d" ? (
          <MotionFigure3D move={move} t={t} muscle={muscle} />
        ) : (
        <svg viewBox="0 0 400 250" className="w-full h-full">
          <defs>
            <pattern id="bp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={LINE} strokeWidth="0.5" opacity="0.6" />
            </pattern>
            <radialGradient id="bp-glow">
              <stop offset="0%" stopColor={EMBER} stopOpacity="0.85" />
              <stop offset="60%" stopColor={EMBER} stopOpacity="0.25" />
              <stop offset="100%" stopColor={EMBER} stopOpacity="0" />
            </radialGradient>
            <marker id="bp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={GO} />
            </marker>
          </defs>
          <rect width="400" height="250" fill="url(#bp-grid)" />

          <g transform={sceneTransform}>
            {move.props?.map((p, i) => <Prop key={i} p={p} />)}
            {/* ground */}
            <line x1="14" y1={GROUND} x2="386" y2={GROUND} stroke={EMBER} strokeWidth="2" strokeDasharray="6 3" />
            <line x1="14" y1={GROUND + 3} x2="386" y2={GROUND + 3} stroke={LINE} strokeWidth="1" />

            {/* tension glow on the target muscle */}
            <circle cx={glowAt[0]} cy={glowAt[1]} r={16} fill="url(#bp-glow)" opacity={tension} />

            <Figure s={skel} />

            <circle cx={glowAt[0]} cy={glowAt[1]} r={5} fill={EMBER} opacity={0.35 + t * 0.4} />
            {move.focus?.map((j) => <AngleArc key={j} s={skel} joint={j} />)}

            {vec && (
              <line
                x1={vec.at[0]}
                y1={vec.at[1]}
                x2={vec.at[0] + vec.dir[0] * 30}
                y2={vec.at[1] + vec.dir[1] * 30}
                stroke={GO}
                strokeWidth={2}
                markerEnd="url(#bp-arrow)"
              />
            )}
          </g>

          {/* cue callouts */}
          {bp.tacticalCues.slice(0, 3).map((c, i) => (
            <text key={i} x={12} y={16 + i * 11} fill={INK} fontSize={7.5} fontFamily="var(--font-barlow-cond)" fontWeight="bold" opacity={0.75}>
              ▸ {c.label.toUpperCase()}{c.angle ? ` · ${c.angle}` : ""}
            </text>
          ))}
          <text x={388} y={244} fill={INK} fontSize={7} fontFamily="var(--font-barlow-cond)" textAnchor="end" opacity={0.5}>
            {muscle.toUpperCase().replace("_", " ")} · {moveKey.toUpperCase().replace(/_/g, " ")}
          </text>
        </svg>
        )}

        <div className="absolute top-2 right-2 border border-line bg-night/90 px-2.5 py-1 font-cond text-[11px] font-bold text-ember backdrop-blur-sm">
          {phaseLabel}
        </div>
      </div>

      {/* ── REPETITION TEMPO BAR ───────────────────────────────────── */}
      <div className="mt-3 flex items-center gap-3">
        <span className="font-cond text-[11px] font-bold text-drab tracking-widest">CADENCE:</span>
        <div className="flex-1 h-2 bg-night border border-line overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-ember via-amber-400 to-green-500 transition-all duration-75"
            style={{ width: `${Math.round(t * 100)}%` }}
          />
        </div>
        <span className="font-cond text-xs font-bold text-ember min-w-[42px] text-right">{Math.round(t * 100)}%</span>
      </div>

      {/* ── BIOMECHANICAL CUES ─────────────────────────────────────── */}
      {!compact && (
        <div className="mt-3 border-t border-line/60 pt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-cond">
          <div>
            <span className="text-drab font-bold tracking-wider">TACTICAL FORM DIRECTIVE:</span>
            <div className="text-bone mt-0.5 leading-tight">{exercise.tacticalCue}</div>
          </div>
          <div>
            <span className="text-drab font-bold tracking-wider">PRESCRIPTION & VOLUME:</span>
            <div className="text-ember font-bold mt-0.5">{exercise.prescription}</div>
          </div>
        </div>
      )}
    </div>
  );
}
