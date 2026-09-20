"use client";

import React, { useState, useEffect } from "react";
import type { CalisthenicsExercise, MuscleId } from "@/data/calisthenics-data";

interface Props {
  exercise: CalisthenicsExercise;
  highlightMuscle?: MuscleId | null;
  compact?: boolean;
}

// Classify exercise to its exact biomechanical human movement
function getDetailedMovementType(exercise: CalisthenicsExercise): string {
  const id = exercise.id.toLowerCase();
  const name = exercise.name.toLowerCase();

  // Pushup variants
  if (id.includes("incline") || name.includes("incline")) return "pushup_incline";
  if (id.includes("decline") || name.includes("decline")) return "pushup_decline";
  if (id.includes("diamond") || name.includes("diamond")) return "pushup_diamond";
  if (id.includes("archer-pushup") || (id.includes("archer") && id.includes("pushup"))) return "pushup_archer";
  if (id.includes("clapping") || name.includes("clapping")) return "pushup_clapping";
  if (id.includes("onearm-elevated") || id.includes("onearm-pushup") || name.includes("one-arm")) return "pushup_onearm";
  if (id.includes("aztec") || name.includes("aztec")) return "pushup_aztec";
  if (id.includes("pseudo-planche") || name.includes("pseudo planche")) return "pushup_pseudo_planche";
  if (id.includes("planche-pushup") || name.includes("planche pushup")) return "planche_pushup";
  if (id.includes("knee-pushup") || name.includes("knee")) return "pushup_knee";
  if (id.includes("pushup") || name.includes("push-up") || name.includes("pushup")) return "pushup_standard";

  // Pullup variants
  if (id.includes("muscleup") || id.includes("muscle-up") || name.includes("muscle-up")) return "muscle_up";
  if (id.includes("archer-pullup") || (id.includes("archer") && id.includes("pullup"))) return "pullup_archer";
  if (id.includes("chinup") || name.includes("chin-up") || name.includes("supinated")) return "pullup_chinup";
  if (id.includes("wide-pullup") || name.includes("wide grip")) return "pullup_wide";
  if (id.includes("lsit-pullup") || name.includes("l-sit strict pull-up")) return "pullup_lsit";
  if (id.includes("chest-to-bar") || name.includes("chest-to-bar")) return "pullup_chest_to_bar";
  if (id.includes("onearm-pullup") || name.includes("one-arm strict pull-up")) return "pullup_onearm";
  if (id.includes("australian") || name.includes("australian") || name.includes("row")) return "pullup_australian";
  if (id.includes("front-lever") || name.includes("front lever")) return "front_lever";
  if (id.includes("back-lever") || name.includes("back lever")) return "back_lever";
  if (id.includes("dead-hang") || name.includes("dead hang")) return "dead_hang";
  if (id.includes("pullup") || name.includes("pull-up") || name.includes("pullup")) return "pullup_strict";

  // Handstand & Pike
  if (id.includes("freestanding-hspu") || name.includes("freestanding handstand")) return "handstand_freestanding";
  if (id.includes("handstand") || id.includes("hspu") || name.includes("handstand")) return "handstand_wall";
  if (id.includes("pike-pushup") || name.includes("pike")) return "pike_pushup";

  // Dips
  if (id.includes("straight-bar-dip") || name.includes("straight bar")) return "dip_straight_bar";
  if (id.includes("bench-dip") || name.includes("bench / chair")) return "dip_bench";
  if (id.includes("dip") || name.includes("dip")) return "dip_parallel";

  // Squats & Legs
  if (id.includes("pistol-jump") || name.includes("pistol squat jump")) return "squat_pistol_jump";
  if (id.includes("pistol") || name.includes("pistol")) return "squat_pistol";
  if (id.includes("shrimp") || name.includes("shrimp")) return "squat_shrimp";
  if (id.includes("sissy") || name.includes("sissy")) return "squat_sissy";
  if (id.includes("bulgarian") || name.includes("bulgarian")) return "squat_bulgarian";
  if (id.includes("cossack") || name.includes("cossack")) return "squat_cossack";
  if (id.includes("jump-squat") || name.includes("jump squat")) return "squat_jump";
  if (id.includes("step-up") || name.includes("step-up")) return "step_up";
  if (id.includes("nordic") || name.includes("nordic")) return "nordic_curl";
  if (id.includes("calf") || name.includes("calf")) return "calf_raise";
  if (id.includes("squat") || name.includes("squat")) return "squat_air";

  // Core & Abs
  if (id.includes("deadbug") || name.includes("deadbug")) return "core_deadbug";
  if (id.includes("hollow") || name.includes("hollow")) return "core_hollow_body";
  if (id.includes("human-flag") || name.includes("human flag")) return "core_human_flag";
  if (id.includes("dragon-flag") || name.includes("dragon flag")) return "core_dragon_flag";
  if (id.includes("windshield") || name.includes("windshield")) return "core_windshield_wipers";
  if (id.includes("toes-to-bar") || id.includes("hanging-leg-raise") || name.includes("toes-to-bar")) return "core_toes_to_bar";
  if (id.includes("hanging-knee-raise") || name.includes("knee raise")) return "core_hanging_knee";
  if (id.includes("lsit") || id.includes("l-sit") || name.includes("l-sit")) return "core_lsit";
  if (id.includes("mountain") || name.includes("mountain")) return "core_mountain_climber";
  if (id.includes("plank") || name.includes("plank")) return "core_plank";
  if (id.includes("bridge") || name.includes("bridge")) return "glute_bridge";
  if (id.includes("burpee") || name.includes("burpee")) return "burpee_complex";

  return exercise.blueprint.figureType || "pushup";
}

export default function ExerciseBlueprint2D({
  exercise,
  highlightMuscle,
  compact = false,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [motionProgress, setMotionProgress] = useState(0);
  const [phaseMode, setPhaseMode] = useState<"animate" | "start" | "end">("animate");
  const bp = exercise.blueprint;
  const movementType = getDetailedMovementType(exercise);

  useEffect(() => {
    if (phaseMode !== "animate" || !isPlaying) return;

    let animId: number;
    let startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) % 3600;
      const norm = elapsed / 3600;

      let prog = 0;
      if (norm < 0.45) {
        const tVal = norm / 0.45;
        prog = 0.5 - 0.5 * Math.cos(tVal * Math.PI);
      } else if (norm < 0.55) {
        prog = 1.0;
      } else {
        const tVal = (norm - 0.55) / 0.45;
        prog = 0.5 + 0.5 * Math.cos(tVal * Math.PI);
      }

      setMotionProgress(prog);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [phaseMode, isPlaying]);

  const t = phaseMode === "start" ? 0 : phaseMode === "end" ? 1 : motionProgress;

  const getRepStatus = () => {
    if (phaseMode === "start") return "ALPHA // START ALIGNMENT";
    if (phaseMode === "end") return "OMEGA // MAXIMUM CONTRACTION";
    if (t > 0.92) return "PEAK ISOMETRIC LOCK // MAXIMUM LOAD";
    if (t > 0.45) return "ECCENTRIC DESCENT // CONTROLLED TEMPO";
    return "CONCENTRIC DRIVE // EXPLOSIVE ASCENT";
  };

  // ──────────────────────────────────────────────────────────────────────────
  // PUSHUP RENDERERS
  // ──────────────────────────────────────────────────────────────────────────

  // Standard Strict Floor Pushup
  const renderStandardPushup = () => {
    const torsoY = 138 + t * 50;
    const elbowX = 292 - t * 40;
    const elbowY = 176 - t * 14;
    const tensionGlow = 0.25 + t * 0.72;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />
        <ellipse cx="295" cy="221" rx="10" ry="4" fill="#f97316" />
        <path d="M 48 214 Q 54 208 62 216 L 68 222 L 42 222 Z" fill="#22c55e" />

        {/* Athletic Legs */}
        <path
          d={`M 54 216 C 72 ${204 + t * 15}, 95 ${192 + t * 18}, 118 ${182 + t * 20} C 134 ${174 + t * 22}, 148 ${158 + t * 35 + 16}, 162 ${158 + t * 35 + 8} L 155 ${158 + t * 35 - 4} C 138 ${158 + t * 35 + 2}, 120 ${166 + t * 18}, 102 ${178 + t * 16} C 84 ${190 + t * 14}, 68 ${200 + t * 12}, 50 210 Z`}
          fill="#222b20"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        {/* Muscular Torso & Glutes */}
        <path
          d={`M 162 ${158 + t * 35 + 8} C 185 ${158 + t * 35 + 2}, 215 ${torsoY + 18}, 245 ${torsoY + 14} C 265 ${torsoY + 10}, 282 ${torsoY + 16}, 292 ${torsoY + 8} L 294 ${torsoY - 6} C 280 ${torsoY - 14}, 255 ${torsoY - 10}, 230 ${158 + t * 35 - 18} C 205 ${158 + t * 35 - 24}, 178 ${158 + t * 35 - 14}, 155 ${158 + t * 35 - 4} Z`}
          fill="#273425"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        {/* Pectoral Contours & Tension Glow */}
        <path
          d={`M 270 ${torsoY + 4} Q 288 ${torsoY - 4} 296 ${torsoY + 8} Q 282 ${torsoY + 20} 265 ${torsoY + 14} Z`}
          fill={`rgba(249, 115, 22, ${tensionGlow})`}
          stroke="#f97316"
          strokeWidth="2"
        />

        {/* Arm: Shoulder -> Elbow -> Hand */}
        <path
          d={`M 292 ${torsoY - 4} L ${elbowX} ${elbowY} L 295 221`}
          fill="none"
          stroke="#d4cfb8"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx={elbowX} cy={elbowY} r="5" fill="#131812" stroke="#f97316" strokeWidth="2.2" />

        {/* Head with jawline */}
        <circle cx="310" cy={torsoY - 6} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="135" y="100" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          STRICT FLOOR PUSH-UP · CHEST TO DECK · HOLLOW CORE
        </text>
      </g>
    );
  };

  // Incline Pushup
  const renderInclinePushup = () => {
    const chestDepth = t * 38;
    const torsoY = 100 + chestDepth;
    const elbowX = 270 - t * 35;
    const elbowY = 135 - t * 8;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <rect x="270" y="145" width="100" height="77" fill="#18221a" stroke="#d4cfb8" strokeWidth="1.8" />
        <text x="280" y="162" fill="#d4cfb8" fontSize="10" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          ELEVATED LEDGE
        </text>

        <path d="M 50 214 Q 56 208 64 216 L 70 222 L 44 222 Z" fill="#22c55e" />

        <path
          d={`M 56 216 C 100 190, 160 160, 210 ${torsoY + 18} L 280 ${torsoY} L 275 ${torsoY - 14} C 205 ${torsoY - 4}, 150 140, 52 208 Z`}
          fill="#253223"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <ellipse cx="282" cy="144" rx="8" ry="4" fill="#f97316" />
        <path d={`M 275 ${torsoY - 4} L ${elbowX} ${elbowY} L 282 144`} fill="none" stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <circle cx={elbowX} cy={elbowY} r="4.5" fill="#131812" stroke="#f97316" strokeWidth="2" />
        <circle cx="305" cy={torsoY - 6} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <ellipse cx="260" cy={torsoY + 8} rx="14" ry="10" fill={`rgba(249, 115, 22, ${0.3 + t * 0.65})`} stroke="#f97316" strokeWidth="1.8" />
        <text x="50" y="55" fill="#89957c" fontSize="11" fontFamily="var(--font-barlow-cond)">
          45° INCLINE ANGLE // REDUCED GRAVITATIONAL SHEAR
        </text>
      </g>
    );
  };

  // Decline Pushup
  const renderDeclinePushup = () => {
    const headDrop = t * 45;
    const torsoY = 165 + headDrop;
    const elbowX = 265 - t * 38;
    const elbowY = 185 - t * 14;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <rect x="25" y="140" width="70" height="82" fill="#18221a" stroke="#d4cfb8" strokeWidth="1.8" />
        <text x="32" y="156" fill="#d4cfb8" fontSize="10" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          BENCH ELEVATION
        </text>

        <ellipse cx="75" cy="138" rx="8" ry="4" fill="#22c55e" />
        <path
          d={`M 75 138 C 125 155, 185 175, 245 ${torsoY + 12} L 275 ${torsoY - 2} C 215 160, 155 140, 72 132 Z`}
          fill="#253223"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <ellipse cx="275" cy="221" rx="10" ry="4" fill="#f97316" />
        <path d={`M 270 ${torsoY - 2} L ${elbowX} ${elbowY} L 275 221`} fill="none" stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <circle cx={elbowX} cy={elbowY} r="4.5" fill="#131812" stroke="#f97316" strokeWidth="2" />
        <circle cx="295" cy={torsoY + 4} r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <ellipse cx="255" cy={torsoY + 6} rx="14" ry="9" fill={`rgba(249, 115, 22, ${0.3 + t * 0.7})`} stroke="#f97316" strokeWidth="2" />
        <text x="120" y="55" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          CLAVICULAR UPPER CHEST PEAK COMPRESSION
        </text>
      </g>
    );
  };

  // Diamond Pushup
  const renderDiamondPushup = () => {
    const drop = t * 48;
    const torsoY = 135 + drop;
    const elbowX = 278 - t * 32;
    const elbowY = 165 + t * 8;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <polygon points="280,215 288,222 280,229 272,222" fill="#f97316" stroke="#eae7dc" strokeWidth="1.5" />
        <circle cx="55" cy="216" r="6" fill="#22c55e" />

        <path
          d={`M 55 216 C 110 195, 170 175, 230 ${torsoY + 12} L 280 ${torsoY} L 275 ${torsoY - 14} C 210 ${torsoY - 24}, 150 170, 52 208 Z`}
          fill="#253223"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <path d={`M 275 ${torsoY - 8} L ${elbowX} ${elbowY} L 280 221`} fill="none" stroke={`rgba(249, 115, 22, ${0.35 + t * 0.65})`} strokeWidth="6" strokeLinecap="round" />
        <circle cx={elbowX} cy={elbowY} r="5" fill="#131812" stroke="#f97316" strokeWidth="2" />
        <circle cx="305" cy={torsoY - 4} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="120" y="105" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          DIAMOND APERTURE · TRICEPS MAXIMUM ISOLATION
        </text>
      </g>
    );
  };

  // Archer Pushup
  const renderArcherPushup = () => {
    const drop = t * 45;
    const bodyShiftX = 230 + t * 40;
    const torsoY = 145 + drop;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <ellipse cx="110" cy="221" rx="8" ry="4" fill="#889980" />
        <ellipse cx="295" cy="221" rx="10" ry="4" fill="#f97316" />
        <circle cx="45" cy="216" r="6" fill="#22c55e" />

        <path
          d={`M 45 216 C 110 200, 180 185, ${bodyShiftX} ${torsoY + 10} L ${bodyShiftX + 25} ${torsoY - 8} C 180 160, 110 175, 42 210 Z`}
          fill="#253223"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <line x1="110" y1="221" x2={bodyShiftX - 15} y2={torsoY} stroke="#889980" strokeWidth="4.5" strokeLinecap="round" />
        <path d={`M ${bodyShiftX + 20} ${torsoY - 8} L ${295 - t * 30} ${175 - t * 10} L 295 221`} fill="none" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
        <circle cx={bodyShiftX + 35} cy={torsoY - 4} r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="145" y="95" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          100% UNILATERAL CHEST LOAD · ASSIST ARM LOCKED
        </text>
      </g>
    );
  };

  // Clapping / Aztec Pushup
  const renderClappingPushup = () => {
    const airHeight = t * 65;
    const bodyY = 195 - airHeight;
    const handY = t > 0.6 ? bodyY + 15 : 221;
    const handX = t > 0.6 ? 260 : 285;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <ellipse cx="60" cy={t > 0.7 ? 212 : 218} rx="7" ry="4" fill="#22c55e" />

        <path
          d={`M 60 ${t > 0.7 ? 212 : 218} C 120 ${bodyY + 20}, 190 ${bodyY + 15}, 250 ${bodyY + 10} L 275 ${bodyY - 6} C 190 ${bodyY - 15}, 120 ${bodyY}, 56 ${t > 0.7 ? 206 : 212} Z`}
          fill="#253223"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <circle cx={handX} cy={handY} r="7" fill="#f97316" />
        {t > 0.6 && (
          <g>
            <circle cx="260" cy={handY} r="14" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3 3" />
            <text x="245" y={handY - 18} fill="#f97316" fontSize="12" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
              ★ CLAP! ★
            </text>
          </g>
        )}

        <circle cx="290" cy={bodyY - 2} r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />
        <text x="120" y="60" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          BALLISTIC EXPLOSIVE DRIVE · AIRBORNE CLEARANCE
        </text>
      </g>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // PULLUP RENDERERS
  // ──────────────────────────────────────────────────────────────────────────

  // Strict Pullup
  const renderStrictPullup = () => {
    const athleteY = 138 - t * 76;
    const latFlare = 20 + t * 26;
    const latGlow = 0.22 + t * 0.75;

    return (
      <g>
        <rect x="40" y="42" width="320" height="9" rx="3" fill="#2d372a" stroke="#f97316" strokeWidth="2.4" />
        <ellipse cx="162" cy="46" rx="7" ry="5" fill="#f97316" />
        <ellipse cx="238" cy="46" rx="7" ry="5" fill="#f97316" />

        <path
          d={`M 162 46 C ${155 - t * 25} ${55 + (athleteY - 46) * 0.4}, ${150 - t * 35} ${athleteY - 10}, ${170 - t * 10} ${athleteY + 12} L ${184 - t * 6} ${athleteY + 10} C ${168 - t * 15} ${athleteY - 15}, ${168 - t * 10} ${55 + (athleteY - 46) * 0.35}, 166 46 Z`}
          fill="#2e3c2c"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />
        <path
          d={`M 238 46 C ${245 + t * 25} ${55 + (athleteY - 46) * 0.4}, ${250 + t * 35} ${athleteY - 10}, ${230 + t * 10} ${athleteY + 12} L ${216 + t * 6} ${athleteY + 10} C ${232 + t * 15} ${athleteY - 15}, ${232 + t * 10} ${55 + (athleteY - 46) * 0.35}, 234 46 Z`}
          fill="#2e3c2c"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        {/* Lats */}
        <path
          d={`M 175 ${athleteY + 10} C ${195 - latFlare} ${athleteY + 28}, ${195 - latFlare} ${athleteY + 54}, 184 ${athleteY + 76} L 216 ${athleteY + 76} C ${205 + latFlare} ${athleteY + 54}, ${205 + latFlare} ${athleteY + 28}, 225 ${athleteY + 10} Z`}
          fill={`rgba(249, 115, 22, ${latGlow})`}
          stroke="#f97316"
          strokeWidth="2.2"
        />

        <circle cx="200" cy={athleteY - 12} r="14" fill="#212a1e" stroke={t > 0.85 ? "#22c55e" : "#d4cfb8"} strokeWidth="2" />
        <line x1="200" y1={athleteY + 76} x2="200" y2="242" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />

        {t > 0.85 ? (
          <text x="245" y="32" fill="#22c55e" fontSize="12" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
            ▲ CHIN OVER BAR CLEARANCE
          </text>
        ) : (
          <text x="70" y="115" fill="#8b967e" fontSize="11" fontFamily="var(--font-barlow-cond)">
            ACTIVE DEAD HANG · FULL ELBOW LOCKOUT
          </text>
        )}
      </g>
    );
  };

  // Supinated Chinup (Biceps Emphasized)
  const renderChinup = () => {
    const athleteY = 140 - t * 78;

    return (
      <g>
        <rect x="50" y="42" width="300" height="9" rx="3" fill="#2d372a" stroke="#f97316" strokeWidth="2.4" />
        {/* Underhand Grip */}
        <circle cx="175" cy="46" r="6.5" fill="#f97316" />
        <circle cx="225" cy="46" r="6.5" fill="#f97316" />

        {/* Biceps Flexing Arms */}
        <line x1="175" y1="46" x2="185" y2={athleteY + 15} stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <line x1="225" y1="46" x2="215" y2={athleteY + 15} stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />

        {/* Bulging Biceps Peak Highlight */}
        <circle cx="180" cy={athleteY} r={8 + t * 4} fill={`rgba(249, 115, 22, ${0.4 + t * 0.6})`} stroke="#f97316" strokeWidth="2" />
        <circle cx="220" cy={athleteY} r={8 + t * 4} fill={`rgba(249, 115, 22, ${0.4 + t * 0.6})`} stroke="#f97316" strokeWidth="2" />

        <rect x="186" y={athleteY + 15} width="28" height="65" rx="4" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="200" cy={athleteY - 14} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />
        <line x1="200" y1={athleteY + 80} x2="200" y2="242" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />

        <text x="120" y="25" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          SUPINATED CHIN-UP · BICEPS BRACHII MAXIMUM PEAK
        </text>
      </g>
    );
  };

  // Australian Incline Row
  const renderAustralianPullup = () => {
    const pullDepth = t * 45;
    const bodyY = 160 - pullDepth;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        {/* Waist Height Bar */}
        <line x1="160" y1="100" x2="260" y2="100" stroke="#f97316" strokeWidth="4" />
        <circle cx="210" cy="100" r="6" fill="#f97316" />

        {/* Heels Planted on Floor */}
        <circle cx="70" cy="220" r="5" fill="#22c55e" />

        {/* 45° Body Hanging Under Bar */}
        <line x1="70" y1="220" x2="220" y2={bodyY} stroke="#253223" strokeWidth="8" strokeLinecap="round" />
        <circle cx="230" cy={bodyY - 12} r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        {/* Arms Pulling to Bar */}
        <line x1="210" y1="100" x2="215" y2={bodyY + 10} stroke="#f97316" strokeWidth="5" strokeLinecap="round" />

        <text x="135" y="80" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          AUSTRALIAN INCLINE ROW · SCAPULAR PINCH
        </text>
      </g>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // SQUAT & LEG RENDERERS
  // ──────────────────────────────────────────────────────────────────────────

  // Air Squat
  const renderAirSquat = () => {
    const hipY = 136 + t * 46;
    const torsoLeanX = 200 + t * 24;
    const kneeX = 202 + t * 44;
    const quadGlow = 0.22 + t * 0.74;

    return (
      <g>
        <line x1="30" y1="230" x2="370" y2="230" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />
        <rect x="178" y="225" width="40" height="6.5" rx="2.5" fill="#22c55e" stroke="#2e3a2c" />

        <path
          d={`M ${kneeX} ${178 - t * 4} C ${195 + t * 14} 195, ${198 + t * 10} 212, 198 225 L 185 225 C 180 210, ${kneeX - 16} 195, ${kneeX - 14} ${178 - t * 4} Z`}
          fill="#222c1e"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <path
          d={`M ${200 - t * 22} ${hipY} C ${190 + t * 18} ${hipY - 18}, ${kneeX - 6} ${168 - t * 4}, ${kneeX} ${176 - t * 4} L ${kneeX - 10} ${185 - t * 4} C ${182 + t * 8} ${hipY + 16}, ${192 - t * 14} ${hipY + 14}, ${195 - t * 22} ${hipY + 10} Z`}
          fill={`rgba(249, 115, 22, ${quadGlow})`}
          stroke="#f97316"
          strokeWidth="2.4"
        />

        <path
          d={`M ${200 - t * 22} ${hipY} C ${205 - t * 15} ${hipY - 30}, ${torsoLeanX - 10} ${hipY - 50}, ${torsoLeanX} ${hipY - 66} L ${torsoLeanX + 22} ${hipY - 66} C ${torsoLeanX + 16} ${hipY - 45}, ${218 - t * 15} ${hipY - 25}, ${215 - t * 22} ${hipY} Z`}
          fill="#273424"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <line x1={torsoLeanX + 18} y1={hipY - 56} x2={torsoLeanX + 50 + t * 25} y2={hipY - 52} stroke="#d4cfb8" strokeWidth="4" strokeLinecap="round" />
        <circle cx={torsoLeanX + 10} cy={hipY - 78} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="110" y="45" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          TACTICAL AIR SQUAT · HIP CREASE BREAKS PARALLEL
        </text>
      </g>
    );
  };

  // Single-Leg Pistol Squat
  const renderPistolSquat = () => {
    const hipY = 135 + t * 50;
    const workingKneeX = 185 + t * 35;
    const forwardLegY = 155 + t * 25;

    return (
      <g>
        <line x1="20" y1="230" x2="380" y2="230" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <rect x="165" y="225" width="38" height="6.5" rx="2" fill="#22c55e" />

        <path
          d={`M ${workingKneeX} ${180 - t * 4} C 180 200, 178 215, 178 225 L 168 225 C 166 210, ${workingKneeX - 16} 195, ${workingKneeX - 14} ${180 - t * 4} Z`}
          fill="#222c1e"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />
        <path
          d={`M ${175 - t * 20} ${hipY} C 170 ${hipY - 15}, ${workingKneeX - 5} ${170 - t * 4}, ${workingKneeX} ${178 - t * 4} L ${workingKneeX - 10} ${186 - t * 4} C ${workingKneeX - 15} ${hipY + 15}, 165 ${hipY + 12}, ${170 - t * 20} ${hipY + 8} Z`}
          fill={`rgba(249, 115, 22, ${0.3 + t * 0.7})`}
          stroke="#f97316"
          strokeWidth="2.2"
        />

        {/* Forward Floating Leg */}
        <path
          d={`M ${175 - t * 20} ${hipY} L 285 ${forwardLegY} L 282 ${forwardLegY + 10} L ${170 - t * 20} ${hipY + 10} Z`}
          fill="#283526"
          stroke="#22c55e"
          strokeWidth="2"
        />
        <circle cx="288" cy={forwardLegY + 5} r="5" fill="#22c55e" />

        <path
          d={`M ${175 - t * 20} ${hipY} L 180 ${hipY - 65} L 198 ${hipY - 65} L ${190 - t * 20} ${hipY} Z`}
          fill="#273424"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />
        <line x1="195" y1={hipY - 55} x2="260" y2={hipY - 52} stroke="#d4cfb8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="188" cy={hipY - 78} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="60" y="55" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          SINGLE-LEG PISTOL SQUAT // FULL DEPTH TO CALF TOUCH
        </text>
      </g>
    );
  };

  // Bulgarian Split Squat
  const renderBulgarianSquat = () => {
    const drop = t * 45;
    const frontKneeY = 175;
    const rearKneeY = 145 + drop;

    return (
      <g>
        <line x1="20" y1="230" x2="380" y2="230" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <rect x="35" y="155" width="65" height="75" fill="#18221a" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="95" cy="153" r="5.5" fill="#889980" />
        <line x1="95" y1="153" x2="140" y2={rearKneeY} stroke="#889980" strokeWidth="4.5" />

        <rect x="230" y="225" width="35" height="6" rx="2" fill="#22c55e" />
        <path
          d={`M 245 225 L 245 ${frontKneeY} L ${180} ${140 + drop} L ${170} ${140 + drop} L 235 ${frontKneeY + 5} L 235 225 Z`}
          fill={`rgba(249, 115, 22, ${0.3 + t * 0.7})`}
          stroke="#f97316"
          strokeWidth="2"
        />

        <rect x="168" y={65 + drop} width="22" height="75" rx="4" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="179" cy={48 + drop} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="140" y="30" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          BULGARIAN SPLIT SQUAT · ISOLATED QUADRICEPS &amp; GLUTE LOAD
        </text>
      </g>
    );
  };

  // Lateral Cossack Squat
  const renderCossackSquat = () => {
    const shiftX = 220 + t * 35;
    const hipY = 145 + t * 45;

    return (
      <g>
        <line x1="20" y1="230" x2="380" y2="230" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />
        {/* Working Squat Foot Flat */}
        <rect x={shiftX - 15} y="225" width="35" height="6" rx="2" fill="#22c55e" />
        {/* Working Knee bent deep */}
        <line x1={shiftX} y1="225" x2={shiftX + 25} y2="185" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
        <line x1={shiftX + 25} y1="185" x2={shiftX - 10} y2={hipY} stroke="#f97316" strokeWidth="6" strokeLinecap="round" />

        {/* Straight Leg Extending Out Left with Heel Dug in and Toes Up */}
        <line x1={shiftX - 10} y1={hipY} x2="90" y2="225" stroke="#889980" strokeWidth="5" strokeLinecap="round" />
        <circle cx="85" cy="223" r="5" fill="#22c55e" />
        <text x="60" y="210" fill="#22c55e" fontSize="9" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          TOES POINTED UP
        </text>

        {/* Torso Upright */}
        <rect x={shiftX - 18} y={hipY - 60} width="20" height="60" rx="3" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx={shiftX - 8} cy={hipY - 72} r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="110" y="50" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          LATERAL COSSACK SQUAT · FRONTAL PLANE HIP MOBILITY
        </text>
      </g>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // DIP RENDERERS
  // ──────────────────────────────────────────────────────────────────────────

  // Parallel Bar Dip
  const renderParallelDip = () => {
    const dipY = 92 + t * 45;
    const elbowBendX = 224 + t * 24;
    const elbowBendY = 118 - t * 8;

    return (
      <g>
        <line x1="130" y1="120" x2="270" y2="120" stroke="#f97316" strokeWidth="4" />
        <circle cx="205" cy="120" r="6.5" fill="#f97316" />

        <path
          d={`M 186 ${dipY - 32} C 190 ${dipY - 10}, 194 ${dipY + 20}, 196 ${dipY + 42} L 220 ${dipY + 38} C 218 ${dipY + 15}, 214 ${dipY - 15}, 208 ${dipY - 34} Z`}
          fill="#273523"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <path d={`M 206 ${dipY - 24} L ${elbowBendX} ${elbowBendY} L 205 120`} fill="none" stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={elbowBendX} cy={elbowBendY} r="5" fill="#151b14" stroke="#f97316" strokeWidth="2" />
        <circle cx="204" cy={dipY - 42} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        {t > 0.75 && (
          <text x="235" y="95" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
            90° TRICEP BEND · CHEST OVER HANDS
          </text>
        )}
      </g>
    );
  };

  // Bench Dip
  const renderBenchDip = () => {
    const drop = t * 42;
    const torsoY = 120 + drop;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        {/* Bench behind hips */}
        <rect x="80" y="145" width="70" height="77" fill="#18221a" stroke="#d4cfb8" strokeWidth="2" />
        <circle cx="152" cy="143" r="6" fill="#f97316" />

        {/* Torso Sliding Down Edge of Bench */}
        <rect x="156" y={torsoY} width="22" height="65" rx="3" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="167" cy={torsoY - 14} r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        {/* Arm Bending Back onto Bench */}
        <line x1="168" y1={torsoY + 5} x2="140" y2={125 + drop * 0.3} stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
        <line x1="140" y1={125 + drop * 0.3} x2="152" y2="143" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />

        {/* Legs Extended Forward */}
        <line x1="178" y1={torsoY + 60} x2="260" y2="220" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />

        <text x="170" y="80" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          BENCH DIP · ISOLATED TRICEPS EXTENSION
        </text>
      </g>
    );
  };

  // ──────────────────────────────────────────────────────────────────────────
  // CORE & SPECIALTY RENDERERS
  // ──────────────────────────────────────────────────────────────────────────

  // Toes to Bar
  const renderToesToBar = () => {
    const legAngle = t * 115;
    const rad = (legAngle * Math.PI) / 180;
    const hipX = 200;
    const hipY = 145;
    const legLength = 85;
    const toeX = hipX + Math.sin(rad) * legLength;
    const toeY = hipY + Math.cos(rad) * legLength;

    return (
      <g>
        <rect x="60" y="42" width="280" height="8" rx="3" fill="#2d372a" stroke="#f97316" strokeWidth="2.2" />
        <circle cx="190" cy="46" r="6" fill="#f97316" />
        <circle cx="210" cy="46" r="6" fill="#f97316" />

        <line x1="190" y1="46" x2="192" y2="95" stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <line x1="210" y1="46" x2="208" y2="95" stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <rect x="190" y="95" width="20" height="50" rx="3" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="200" cy="80" r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <line x1={hipX} y1={hipY} x2={toeX} y2={toeY} stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
        <circle cx={toeX} cy={toeY} r="5" fill="#22c55e" />

        <ellipse cx="200" cy="130" rx="12" ry="14" fill={`rgba(249, 115, 22, ${0.3 + t * 0.7})`} stroke="#f97316" strokeWidth="2" />

        {t > 0.85 ? (
          <text x="220" y="40" fill="#22c55e" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
            ★ TOES TOUCH STEEL BAR ★
          </text>
        ) : (
          <text x="80" y="110" fill="#889980" fontSize="10" fontFamily="var(--font-barlow-cond)">
            STRICT HANG // ZERO KIP
          </text>
        )}
      </g>
    );
  };

  // Handstand Pushup
  const renderHandstandPushup = () => {
    const headDrop = t * 45;
    const handY = 215;
    const headY = 160 + headDrop;
    const torsoY = 110 + headDrop;
    const feetY = 40 + headDrop;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />
        <line x1="140" y1="20" x2="140" y2="222" stroke="#889980" strokeWidth="3" />

        <ellipse cx="180" cy={handY} rx="8" ry="4" fill="#f97316" />
        <ellipse cx="220" cy={handY} rx="8" ry="4" fill="#f97316" />

        <line x1="180" y1={handY} x2={165 - t * 15} y2={handY - 25} stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <line x1={165 - t * 15} y1={handY - 25} x2="190" y2={torsoY + 30} stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        
        <line x1="220" y1={handY} x2={235 + t * 15} y2={handY - 25} stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <line x1={235 + t * 15} y1={handY - 25} x2="210" y2={torsoY + 30} stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />

        <rect x="188" y={torsoY} width="24" height="40" rx="3" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="200" cy={headY} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <line x1="200" y1={torsoY} x2="200" y2={feetY} stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />
        <circle cx="200" cy={feetY} r="5" fill="#22c55e" />

        <text x="240" y="80" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          INVERTED OVERHEAD PRESS · DELTOID DOMINANCE
        </text>
      </g>
    );
  };

  // Muscle Up
  const renderMuscleUp = () => {
    const athleteY = 160 - t * 110;

    return (
      <g>
        <rect x="50" y="90" width="300" height="9" rx="3" fill="#2d372a" stroke="#f97316" strokeWidth="2.4" />
        <circle cx="185" cy="94" r="6" fill="#f97316" />
        <circle cx="215" cy="94" r="6" fill="#f97316" />

        <rect x="188" y={athleteY} width="24" height="48" rx="4" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="200" cy={athleteY - 14} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />
        <line x1="200" y1={athleteY + 48} x2="200" y2={athleteY + 110} stroke="#22c55e" strokeWidth="5" strokeLinecap="round" />

        {t > 0.75 ? (
          <text x="235" y="55" fill="#22c55e" fontSize="12" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
            ▲ STRAIGHT BAR DIP LOCKOUT
          </text>
        ) : (
          <text x="70" y="170" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)">
            EXPLOSIVE HIGH PULL · WHIP CHEST OVER STEEL
          </text>
        )}
      </g>
    );
  };

  // Calf Raise
  const renderCalfRaise = () => {
    const heelY = 190 - t * 30;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <rect x="140" y="175" width="120" height="47" fill="#18221a" stroke="#d4cfb8" strokeWidth="2" />
        <circle cx="155" cy="172" r="6" fill="#f97316" />

        <line x1="155" y1="172" x2="125" y2={heelY} stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <path
          d={`M 125 ${heelY} C 120 ${heelY - 40}, 115 95, 125 70 L 138 70 C 145 95, 155 ${heelY - 40}, 145 ${heelY - 15} Z`}
          fill={`rgba(249, 115, 22, ${0.3 + t * 0.7})`}
          stroke="#f97316"
          strokeWidth="2.2"
        />

        <line x1="130" y1="70" x2="130" y2="20" stroke="#253223" strokeWidth="6" strokeLinecap="round" />

        <text x="180" y="100" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          {t > 0.8 ? "▲ MAXIMUM PLANTARFLEXION · SOLEUS ENGAGED" : "▼ DEEP DEFICIT ACHILLES STRETCH"}
        </text>
      </g>
    );
  };

  // Human Flag
  const renderHumanFlag = () => {
    const flagWave = Math.sin(t * Math.PI * 2) * 6;

    return (
      <g>
        <line x1="80" y1="20" x2="80" y2="230" stroke="#f97316" strokeWidth="5" />
        <line x1="80" y1="150" x2="135" y2="120" stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />
        <line x1="80" y1="75" x2="135" y2="105" stroke="#d4cfb8" strokeWidth="5" strokeLinecap="round" />

        <rect x="135" y={100 + flagWave} width="60" height="24" rx="4" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="125" cy={112 + flagWave} r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <line x1="195" y1={112 + flagWave} x2="310" y2={112 + flagWave} stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
        <circle cx="315" cy={112 + flagWave} r="5" fill="#22c55e" />

        <text x="140" y="70" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          FULL HUMAN FLAG // PURE LATERAL LEVERAGE
        </text>
      </g>
    );
  };

  // Nordic Hamstring Curl
  const renderNordicCurl = () => {
    const fallAngle = t * 65;
    const rad = (fallAngle * Math.PI) / 180;
    const kneeX = 140;
    const kneeY = 215;
    const torsoLen = 95;
    const headX = kneeX + Math.sin(rad) * torsoLen;
    const headY = kneeY - Math.cos(rad) * torsoLen;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <rect x="75" y="208" width="55" height="14" fill="#18221a" stroke="#d4cfb8" strokeWidth="1.8" />
        <line x1="100" y1="215" x2={kneeX} y2={kneeY} stroke="#889980" strokeWidth="5" strokeLinecap="round" />
        <circle cx={kneeX} cy={kneeY} r="6" fill="#22c55e" />

        <line x1={kneeX} y1={kneeY} x2={headX} y2={headY} stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
        <circle cx={headX} cy={headY} r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="170" y="80" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          NORDIC HAMSTRING CURL · EXTREME ECCENTRIC KNEE FLEXION
        </text>
      </g>
    );
  };

  // Prone Plank
  const renderPronePlank = () => {
    const corePulse = Math.sin(t * Math.PI * 4) * 0.18 + 0.65;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />
        <rect x="260" y="217" width="45" height="5" rx="2" fill="#f97316" />
        <circle cx="58" cy="219" r="4.5" fill="#22c55e" />

        <path
          d="M 58 219 C 85 208, 125 198, 165 190 C 205 182, 245 178, 285 174 L 288 184 C 255 190, 215 198, 175 204 C 135 210, 95 216, 58 219 Z"
          fill="#253223"
          stroke="#d4cfb8"
          strokeWidth="1.8"
        />

        <path
          d="M 195 186 C 215 183, 240 181, 260 180 L 260 190 C 240 192, 215 195, 195 197 Z"
          fill={`rgba(249, 115, 22, ${corePulse})`}
          stroke="#f97316"
          strokeWidth="2"
        />
        <circle cx="305" cy="176" r="13" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <text x="135" y="150" fill="#22c55e" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          180° NEUTRAL SPINE · GLUTE &amp; ABDOMINAL TENSION
        </text>
      </g>
    );
  };

  // Floor Glute Bridge
  const renderGluteBridge = () => {
    const bridgeY = 200 - t * 40;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        {/* Feet Flat */}
        <rect x="235" y="217" width="35" height="5" rx="2" fill="#22c55e" />
        <circle cx="100" cy="215" r="12" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        {/* Pelvis Lifting High */}
        <line x1="110" y1="215" x2="175" y2={bridgeY} stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
        <line x1="175" y1={bridgeY} x2="245" y2="217" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />

        {/* Glute Contraction Glow */}
        <circle cx="175" cy={bridgeY} r={14 + t * 4} fill={`rgba(249, 115, 22, ${0.4 + t * 0.6})`} stroke="#f97316" strokeWidth="2" />

        <text x="130" y="80" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          GLUTE BRIDGE // DRIVE THROUGH HEELS · FULL HIP LOCKOUT
        </text>
      </g>
    );
  };

  // Deadbug
  const renderDeadbug = () => {
    const limbReach = t * 35;

    return (
      <g>
        <line x1="20" y1="222" x2="380" y2="222" stroke="#f97316" strokeWidth="2" strokeDasharray="6 3" />
        <rect x="120" y="200" width="80" height="15" rx="3" fill="#253223" stroke="#d4cfb8" strokeWidth="1.8" />
        <circle cx="105" cy="207" r="11" fill="#212a1e" stroke="#d4cfb8" strokeWidth="1.8" />

        <line x1="130" y1="200" x2={90 - limbReach} y2={185} stroke="#d4cfb8" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="190" y1="205" x2={240 + limbReach} y2={195} stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" />

        <line x1="130" y1="200" x2="130" y2="145" stroke="#d4cfb8" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="190" y1="205" x2="190" y2="155" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" />

        <circle cx="160" cy="200" r="14" fill={`rgba(249, 115, 22, ${0.4 + t * 0.6})`} stroke="#f97316" strokeWidth="2" />

        <text x="100" y="80" fill="#f97316" fontSize="11" fontFamily="var(--font-barlow-cond)" fontWeight="bold">
          DEADBUG // ZERO LUMBAR GAP · CONTRALATERAL REACH
        </text>
      </g>
    );
  };

  // Dispatcher: accurately maps each exercise to its genuine motion figure
  const renderFigure = () => {
    switch (movementType) {
      // Pushups
      case "pushup_incline":
        return renderInclinePushup();
      case "pushup_decline":
        return renderDeclinePushup();
      case "pushup_diamond":
        return renderDiamondPushup();
      case "pushup_archer":
      case "pushup_onearm":
        return renderArcherPushup();
      case "pushup_clapping":
      case "pushup_aztec":
        return renderClappingPushup();
      case "pushup_standard":
      case "pushup_knee":
      case "pushup_pseudo_planche":
      case "planche_pushup":
        return renderStandardPushup();

      // Pullups
      case "pullup_strict":
      case "dead_hang":
      case "pullup_lsit":
      case "pullup_chest_to_bar":
      case "pullup_onearm":
      case "pullup_wide":
        return renderStrictPullup();
      case "pullup_chinup":
        return renderChinup();
      case "pullup_archer":
        return renderStrictPullup();
      case "pullup_australian":
        return renderAustralianPullup();
      case "muscle_up":
        return renderMuscleUp();

      // Squats
      case "squat_air":
      case "squat_jump":
        return renderAirSquat();
      case "squat_pistol":
      case "squat_pistol_jump":
      case "squat_shrimp":
      case "squat_sissy":
        return renderPistolSquat();
      case "squat_bulgarian":
      case "step_up":
        return renderBulgarianSquat();
      case "squat_cossack":
        return renderCossackSquat();
      case "calf_raise":
        return renderCalfRaise();
      case "nordic_curl":
        return renderNordicCurl();

      // Dips
      case "dip_parallel":
      case "dip_straight_bar":
        return renderParallelDip();
      case "dip_bench":
        return renderBenchDip();

      // Handstands
      case "handstand_wall":
      case "handstand_freestanding":
      case "pike_pushup":
        return renderHandstandPushup();

      // Core
      case "core_toes_to_bar":
      case "core_hanging_knee":
      case "core_windshield_wipers":
        return renderToesToBar();
      case "core_human_flag":
        return renderHumanFlag();
      case "core_deadbug":
      case "core_hollow_body":
        return renderDeadbug();
      case "glute_bridge":
        return renderGluteBridge();
      case "core_plank":
      case "core_mountain_climber":
      default:
        return renderPronePlank();
    }
  };

  return (
    <div className="border-2 border-line bg-pit p-4">
      {/* ── HEADER / CONTROLS ──────────────────────────────────────── */}
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

        {/* Play / Pause & Phase Controls */}
        <div className="flex items-center gap-1.5 font-cond text-xs font-bold">
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
        <svg viewBox="0 0 400 250" className="w-full h-full">
          {renderFigure()}
        </svg>

        {/* Dynamic Status Callout Badge */}
        <div className="absolute top-2 right-2 border border-line bg-night/90 px-2.5 py-1 font-cond text-[11px] font-bold text-ember backdrop-blur-sm">
          {getRepStatus()}
        </div>
      </div>

      {/* ── REPETITION TEMPO BAR ───────────────────────────────────── */}
      <div className="mt-3 flex items-center gap-3">
        <span className="font-cond text-[11px] font-bold text-drab tracking-widest">
          CADENCE:
        </span>
        <div className="flex-1 h-2 bg-night border border-line overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-ember via-amber-400 to-green-500 transition-all duration-75"
            style={{ width: `${Math.round(t * 100)}%` }}
          />
        </div>
        <span className="font-cond text-xs font-bold text-ember min-w-[42px] text-right">
          {Math.round(t * 100)}%
        </span>
      </div>

      {/* ── BIOMECHANICAL CUES & SAFETY FORM CHECKLIST ─────────────── */}
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
