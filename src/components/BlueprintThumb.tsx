"use client";

import React from "react";
import type { MuscleId } from "@/data/calisthenics-data";
import { EMBER, Figure, INK, LINE, Prop } from "@/components/ExerciseBlueprint2D";
import { GROUND, MOVES, classifyMove, muscleAnchor, poseAt, resolve, type Move, type Vec } from "@/lib/rig2d";

interface Props {
  id: string;
  name: string;
  figureType?: string;
  muscle?: MuscleId;
  /** which frames to show; defaults to start + peak */
  frames?: number[];
  className?: string;
}

/** Tight crop around everything the figure and its equipment occupy, across all frames. */
function cropBox(move: Move, frames: number[]): [number, number, number, number] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const add = (v: Vec) => {
    minX = Math.min(minX, v[0]); maxX = Math.max(maxX, v[0]);
    minY = Math.min(minY, v[1]); maxY = Math.max(maxY, v[1]);
  };
  for (const t of frames) {
    const s = resolve(poseAt(move, t), t);
    [s.hip, s.shoulder, s.headC, ...s.arms.flatMap((a) => [a.elbow, a.hand]), ...s.legs.flatMap((l) => [l.knee, l.toe])].forEach(add);
  }
  for (const p of move.props ?? []) {
    if (p.type === "bar") add([120, p.y - 8]);
    if (p.type === "box" || p.type === "bench") { add([p.x, p.y]); add([p.x + p.w, GROUND]); }
    if (p.type === "wall") add([p.x, GROUND]);
  }
  add([minX, GROUND + 4]);
  const pad = 18;
  const w = maxX - minX + pad * 2;
  const h = maxY - minY + pad * 2;
  // keep a 4:3 frame so thumbnails line up in a list
  const ratio = 4 / 3;
  let cw = w, ch = h;
  if (cw / ch > ratio) ch = cw / ratio; else cw = ch * ratio;
  const cx = (minX + maxX) / 2;
  return [cx - cw / 2, maxY + pad - ch, cw, ch];
}

/** Static start/peak stills of a movement, for drill cards. */
export default function BlueprintThumb({ id, name, figureType, muscle, frames = [0, 1], className = "" }: Props) {
  const move = MOVES[classifyMove(id, name, figureType)] ?? MOVES.pushup_standard;
  const shown = move.keys.length === 1 ? [0] : frames;
  const [x, y, w, h] = cropBox(move, shown);
  return (
    <div className={`flex gap-1 ${className}`}>
      {shown.map((t, i) => {
        const skel = resolve(poseAt(move, t), t);
        const glow = muscle ? muscleAnchor(skel, muscle) : null;
        return (
          <svg
            key={t}
            viewBox={`${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`}
            className="aspect-[4/3] w-full border border-line bg-[#0f150f]"
            aria-label={`${name} — ${i === 0 && shown.length > 1 ? "start" : "peak"} position`}
          >
            {move.props?.map((p, j) => <Prop key={j} p={p} />)}
            <line x1={x} y1={GROUND} x2={x + w} y2={GROUND} stroke={EMBER} strokeWidth={1.5} strokeDasharray="4 2" />
            {glow && <circle cx={glow[0]} cy={glow[1]} r={7} fill={EMBER} opacity={0.35 + t * 0.4} />}
            <Figure s={skel} />
            <text x={x + 4} y={y + h - 4} fill={INK} fontSize={Math.max(7, h * 0.07)} fontFamily="var(--font-barlow-cond)" fontWeight="bold" opacity={0.7}>
              {shown.length > 1 ? (i === 0 ? "ALPHA" : "OMEGA") : "HOLD"}
            </text>
            <rect x={x} y={y} width={w} height={h} fill="none" stroke={LINE} strokeWidth={1} />
          </svg>
        );
      })}
    </div>
  );
}
