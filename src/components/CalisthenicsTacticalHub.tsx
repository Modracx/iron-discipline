"use client";

import React, { useState, useEffect } from "react";
import InteractiveBody3D from "./InteractiveBody3D";
import ExerciseBlueprint2D from "./ExerciseBlueprint2D";
import ClearanceTerminal, {
  checkIsClassifiedUnlocked,
  STORAGE_KEY_FLAG,
  STORAGE_KEY_CLEARANCE,
} from "./ClearanceTerminal";
import {
  CALISTHENICS_EXERCISES,
  CALISTHENICS_STRETCHES,
  FULL_BODY_ROUTINES,
  MUSCLE_REGISTRY,
  type CalisthenicsExercise,
  type MuscleId,
  type Tier,
  type FullBodyRoutine,
} from "@/data/calisthenics-data";

export default function CalisthenicsTacticalHub() {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleId | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier>("beginner");
  const [activeTab, setActiveTab] = useState<"exercises" | "routines" | "stretches">("exercises");
  const [isClassifiedUnlocked, setIsClassifiedUnlocked] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedExerciseId, setFocusedExerciseId] = useState<string>(CALISTHENICS_EXERCISES[0].id);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);

  // Sync localStorage clearance state
  useEffect(() => {
    const updateClearance = () => {
      setIsClassifiedUnlocked(checkIsClassifiedUnlocked());
    };
    updateClearance();

    window.addEventListener("storage", updateClearance);
    const interval = setInterval(updateClearance, 1000);
    return () => {
      window.removeEventListener("storage", updateClearance);
      clearInterval(interval);
    };
  }, []);

  const handleTierClick = (tier: Tier) => {
    if ((tier === "military" || tier === "brutal") && !isClassifiedUnlocked) {
      setTerminalOpen(true);
      return;
    }
    setSelectedTier(tier);
  };

  const relockTiers = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_FLAG);
      localStorage.removeItem(STORAGE_KEY_CLEARANCE);
    } catch {}
    setIsClassifiedUnlocked(false);
    if (selectedTier === "military" || selectedTier === "brutal") {
      setSelectedTier("beginner");
    }
  };

  // Filter exercises
  const filteredExercises = CALISTHENICS_EXERCISES.filter((ex) => {
    if (selectedMuscle) {
      const matchesMuscle =
        ex.primaryMuscle === selectedMuscle || ex.secondaryMuscles.includes(selectedMuscle);
      if (!matchesMuscle) return false;
    }
    if (ex.tier !== selectedTier) return false;
    if ((ex.tier === "military" || ex.tier === "brutal") && !isClassifiedUnlocked) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = ex.name.toLowerCase().includes(q);
      const matchMuscle = ex.primaryMuscle.toLowerCase().includes(q);
      const matchEquip = ex.equipment.toLowerCase().includes(q);
      if (!matchName && !matchMuscle && !matchEquip) return false;
    }
    return true;
  });

  // Filter routines
  const availableRoutines = FULL_BODY_ROUTINES.filter((r) => {
    if ((r.tier === "military" || r.tier === "brutal") && !isClassifiedUnlocked) {
      return false;
    }
    if (r.tier !== selectedTier) {
      return false;
    }
    return true;
  });

  // Filter stretches
  const filteredStretches = CALISTHENICS_STRETCHES.filter((st) => {
    if (selectedMuscle && st.primaryMuscle !== selectedMuscle) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        st.name.toLowerCase().includes(q) ||
        st.targetArea.toLowerCase().includes(q) ||
        st.primaryMuscle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Active exercise for the 2D blueprint
  const activeExercise =
    CALISTHENICS_EXERCISES.find((ex) => ex.id === focusedExerciseId) ||
    filteredExercises[0] ||
    CALISTHENICS_EXERCISES[0];

  // Paired stretch for currently focused exercise
  const pairedStretch = CALISTHENICS_STRETCHES.find(
    (st) => st.primaryMuscle === activeExercise.primaryMuscle
  );

  return (
    <div className="w-full">
      {/* ── SECURITY STATUS BAR ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-line bg-pit px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isClassifiedUnlocked ? "bg-blood animate-ping" : "bg-drab"
            }`}
          />
          <div>
            <span className="font-cond text-xs font-bold tracking-[0.2em] text-drab">
              CLEARANCE LEVEL:
            </span>
            <span
              className={`ml-2 font-cond text-sm font-bold tracking-wider ${
                isClassifiedUnlocked ? "text-blood" : "text-bone"
              }`}
            >
              {isClassifiedUnlocked
                ? "LEVEL 5 // COMBAT & BRUTAL UNLOCKED"
                : "STANDARD // MILITARY & BRUTAL LOCKED"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-cond text-xs font-bold">
          {!isClassifiedUnlocked ? (
            <button
              type="button"
              onClick={() => setTerminalOpen(true)}
              className="cursor-pointer border-2 border-blood bg-blood/15 px-3 py-1 text-blood hover:bg-blood hover:text-night transition-colors"
            >
              🔒 ENTER CLEARANCE CODE
            </button>
          ) : (
            <button
              type="button"
              onClick={relockTiers}
              className="cursor-pointer border-2 border-line px-3 py-1 text-drab hover:border-blood hover:text-blood transition-colors"
            >
              RELOCK CLASSIFIED TIERS
            </button>
          )}
        </div>
      </div>

      {/* ── TIER SELECTION TABS ───────────────────────────────────── */}
      <div className="mt-4 border-2 border-line bg-night p-2">
        <div className="font-cond text-xs font-bold tracking-[0.25em] text-drab mb-2 px-1">
          PROGRESSION TIERS // CALISTHENICS DIFFICULTY
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <button
            type="button"
            onClick={() => handleTierClick("beginner")}
            className={`cursor-pointer border-2 p-2.5 text-left transition-colors ${
              selectedTier === "beginner"
                ? "border-go bg-go/10 text-go"
                : "border-line bg-pit text-drab hover:border-go"
            }`}
          >
            <span className="block font-stencil text-base text-go">01 · BEGINNER</span>
            <span className="block font-cond text-xs text-drab">RECRUIT FOUNDATION</span>
          </button>

          <button
            type="button"
            onClick={() => handleTierClick("advanced")}
            className={`cursor-pointer border-2 p-2.5 text-left transition-colors ${
              selectedTier === "advanced"
                ? "border-bone bg-bone/10 text-bone"
                : "border-line bg-pit text-drab hover:border-bone"
            }`}
          >
            <span className="block font-stencil text-base text-bone">02 · ADVANCED</span>
            <span className="block font-cond text-xs text-drab">OPERATOR DISCIPLINE</span>
          </button>

          <button
            type="button"
            onClick={() => handleTierClick("pro")}
            className={`cursor-pointer border-2 p-2.5 text-left transition-colors ${
              selectedTier === "pro"
                ? "border-ember bg-ember/10 text-ember"
                : "border-line bg-pit text-drab hover:border-ember"
            }`}
          >
            <span className="block font-stencil text-base text-ember">03 · PRO</span>
            <span className="block font-cond text-xs text-drab">VANGUARD LEVERAGE</span>
          </button>

          <button
            type="button"
            onClick={() => handleTierClick("military")}
            className={`cursor-pointer border-2 p-2.5 text-left transition-colors relative ${
              selectedTier === "military"
                ? "border-blood bg-blood/10 text-blood"
                : isClassifiedUnlocked
                ? "border-line bg-pit text-drab hover:border-blood"
                : "border-blood/40 bg-[#161012] text-drab/60 hover:border-blood"
            }`}
          >
            {!isClassifiedUnlocked && (
              <span className="absolute top-1 right-2 text-[10px] font-cond font-bold text-blood">
                🔒 LOCKED
              </span>
            )}
            <span className="block font-stencil text-base text-blood">04 · MILITARY</span>
            <span className="block font-cond text-xs text-drab">
              {isClassifiedUnlocked ? "COMBAT READY" : "REQUIRES CLEARANCE"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTierClick("brutal")}
            className={`cursor-pointer border-2 p-2.5 text-left transition-colors relative ${
              selectedTier === "brutal"
                ? "border-[#ff2a5f] bg-[#ff2a5f]/10 text-[#ff2a5f]"
                : isClassifiedUnlocked
                ? "border-line bg-pit text-drab hover:border-[#ff2a5f]"
                : "border-[#ff2a5f]/40 bg-[#170e13] text-drab/60 hover:border-[#ff2a5f]"
            }`}
          >
            {!isClassifiedUnlocked && (
              <span className="absolute top-1 right-2 text-[10px] font-cond font-bold text-[#ff2a5f]">
                🔒 LOCKED
              </span>
            )}
            <span className="block font-stencil text-base text-[#ff2a5f]">05 · BRUTAL</span>
            <span className="block font-cond text-xs text-drab">
              {isClassifiedUnlocked ? "APEX GYMNASTICS" : "CLASSIFIED OVERLOAD"}
            </span>
          </button>
        </div>
      </div>

      {/* ── FULL-WIDTH 3D ANATOMICAL SCANNER ───────────────────────── */}
      <div className="mt-6 w-full">
        <InteractiveBody3D
          selectedMuscle={selectedMuscle}
          onSelectMuscle={(m) => setSelectedMuscle(m)}
          className="w-full shadow-2xl"
        />
      </div>

      {/* ── OPERATIONAL FULL-BODY CIRCUITS & PROTOCOLS ──────────────── */}
      <div className="mt-6 border-2 border-line bg-pit p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="font-stencil text-lg text-ember tracking-wide">
              FULL-BODY OPERATIONAL ROUTINES // SYSTEMIC PROTOCOLS
            </span>
            <div className="font-cond text-xs text-drab">
              COMPLETE HEAD-TO-TOE CALISTHENIC CIRCUITS COVERING PUSH, PULL, LEGS, AND CORE
            </div>
          </div>
          <span className="font-cond text-xs font-bold text-bone border border-line bg-night px-2.5 py-1">
            {availableRoutines.length} ACTIVE PROTOCOLS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {FULL_BODY_ROUTINES.map((routine) => {
            const isLocked = (routine.tier === "military" || routine.tier === "brutal") && !isClassifiedUnlocked;
            const isSelected = selectedRoutineId === routine.id;

            return (
              <div
                key={routine.id}
                onClick={() => {
                  if (isLocked) {
                    setTerminalOpen(true);
                  } else {
                    setSelectedRoutineId(isSelected ? null : routine.id);
                  }
                }}
                className={`cursor-pointer border-2 p-3 transition-all ${
                  isLocked
                    ? "border-line/40 bg-night/50 opacity-60 hover:opacity-100 hover:border-blood"
                    : isSelected
                    ? "border-ember bg-night shadow-lg"
                    : "border-line bg-night hover:border-ember"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`font-cond text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border ${
                      routine.tier === "beginner"
                        ? "border-go text-go"
                        : routine.tier === "advanced"
                        ? "border-bone text-bone"
                        : routine.tier === "pro"
                        ? "border-ember text-ember"
                        : "border-blood text-blood"
                    }`}
                  >
                    {routine.tier}
                  </span>
                  <span className="font-cond text-[10px] font-bold text-drab">
                    {routine.totalTime}
                  </span>
                </div>
                <h4 className="font-stencil text-sm text-bone line-clamp-2 leading-snug">
                  {routine.name}
                </h4>
                <div className="mt-1 font-cond text-[11px] text-drab line-clamp-2">
                  {routine.tagline}
                </div>
                <div className="mt-2 pt-1.5 border-t border-line/40 flex items-center justify-between text-[10px] font-cond font-bold">
                  <span className="text-drab">{routine.exerciseIds.length} MOVEMENTS</span>
                  <span className={isLocked ? "text-blood" : "text-ember"}>
                    {isLocked ? "🔒 LOCKED" : isSelected ? "ACTIVE [▼]" : "VIEW [▶]"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Routine Expanded View */}
        {selectedRoutineId && (
          <div className="mt-4 border-t-2 border-ember pt-3 bg-night p-3">
            {(() => {
              const r = FULL_BODY_ROUTINES.find((item) => item.id === selectedRoutineId);
              if (!r) return null;
              return (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="font-stencil text-base text-ember">{r.name}</span>
                      <p className="font-cond text-xs text-drab mt-0.5">{r.description}</p>
                    </div>
                    <div className="font-cond text-xs font-bold text-bone">
                      STRUCTURE: <span className="text-ember">{r.rounds}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                    {r.exerciseIds.map((exId, idx) => {
                      const ex = CALISTHENICS_EXERCISES.find((e) => e.id === exId);
                      if (!ex) return null;
                      return (
                        <div
                          key={exId}
                          onClick={() => setFocusedExerciseId(ex.id)}
                          className="border border-line bg-pit p-2 cursor-pointer hover:border-ember transition-colors"
                        >
                          <div className="flex items-center justify-between text-[10px] font-cond font-bold text-drab">
                            <span>DRILL 0{idx + 1}</span>
                            <span className="text-ember uppercase">{ex.primaryMuscle}</span>
                          </div>
                          <div className="font-stencil text-xs text-bone mt-0.5">{ex.name}</div>
                          <div className="font-cond text-[11px] text-drab mt-1">
                            {ex.prescription} · {ex.tempo}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* ── UNDER MODEL: DRILLS CATALOG & 2D MOTION GRAPHICS ───────── */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Exercises & Stretches Catalog */}
        <div className="lg:col-span-7">
          {/* Catalog Tab Controller */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line pb-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("exercises")}
                className={`cursor-pointer border-b-4 px-3 py-1.5 font-stencil text-lg sm:text-xl transition-colors ${
                  activeTab === "exercises"
                    ? "border-ember text-ember"
                    : "border-transparent text-drab hover:text-bone"
                }`}
              >
                BODYWEIGHT DRILLS ({filteredExercises.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("stretches")}
                className={`cursor-pointer border-b-4 px-3 py-1.5 font-stencil text-lg sm:text-xl transition-colors ${
                  activeTab === "stretches"
                    ? "border-ember text-ember"
                    : "border-transparent text-drab hover:text-bone"
                }`}
              >
                STRETCHES &amp; MOBILITY ({filteredStretches.length})
              </button>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH MOVEMENT..."
                className="w-44 border-2 border-line bg-pit px-3 py-1.5 font-cond text-xs tracking-wider text-bone focus:border-ember focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-2 font-cond text-xs text-drab hover:text-bone cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Exercise Drills List */}
          <div className="mt-4 space-y-3">
            {activeTab === "exercises" ? (
              filteredExercises.length > 0 ? (
                filteredExercises.map((ex) => {
                  const isFocused = focusedExerciseId === ex.id;
                  const targetMuscle = MUSCLE_REGISTRY[ex.primaryMuscle];

                  return (
                    <div
                      key={ex.id}
                      onClick={() => setFocusedExerciseId(ex.id)}
                      className={`cursor-pointer border-2 transition-all p-4 ${
                        isFocused
                          ? "border-ember bg-night shadow-md"
                          : "border-line bg-night/80 hover:border-ember/70"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`border px-2 py-0.5 font-cond text-[11px] font-bold tracking-wider uppercase ${
                                ex.tier === "beginner"
                                  ? "border-go text-go"
                                  : ex.tier === "advanced"
                                  ? "border-bone text-bone"
                                  : ex.tier === "pro"
                                  ? "border-ember text-ember"
                                  : ex.tier === "military"
                                  ? "border-blood text-blood"
                                  : "border-[#ff2a5f] text-[#ff2a5f]"
                              }`}
                            >
                              {ex.tier}
                            </span>
                            <span className="font-cond text-xs font-bold text-drab">
                              EQUIPMENT: {ex.equipment}
                            </span>
                          </div>
                          <h3 className="mt-1 font-stencil text-xl text-bone">
                            {ex.name}
                          </h3>
                          <p className="font-cond text-xs font-semibold tracking-wide text-ember uppercase">
                            PRIMARY: {targetMuscle?.name ?? ex.primaryMuscle}
                            {ex.secondaryMuscles.length > 0 && (
                              <span className="text-drab ml-2">
                                + {ex.secondaryMuscles.join(", ")}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="font-stencil text-base text-bone">
                            {ex.prescription}
                          </div>
                          <div className="font-cond text-xs text-drab">
                            TEMPO: {ex.tempo}
                          </div>
                          <span
                            className={`inline-block mt-2 font-cond text-xs font-bold px-2 py-0.5 border ${
                              isFocused
                                ? "border-ember bg-ember text-night"
                                : "border-line text-drab hover:border-ember"
                            }`}
                          >
                            {isFocused ? "ACTIVE IN 2D LAB [▼]" : "VIEW MOTION BLUEPRINT [▶]"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-line/40 font-cond text-xs text-[#b8c2a8]">
                        <span className="font-bold text-ember">TACTICAL DIRECTIVE:</span>{" "}
                        {ex.tacticalCue}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="border-2 border-dashed border-line p-8 text-center">
                  <div className="font-stencil text-xl text-drab">
                    NO EXERCISES MATCH THIS FILTER CRITERIA
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMuscle(null);
                      setSelectedTier("beginner");
                      setSearchQuery("");
                    }}
                    className="mt-3 cursor-pointer border-2 border-ember bg-ember/15 px-4 py-1.5 font-cond text-xs font-bold text-ember hover:bg-ember hover:text-night transition-colors"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              )
            ) : (
              // Stretches List
              filteredStretches.map((st) => {
                const targetMuscle = MUSCLE_REGISTRY[st.primaryMuscle];
                return (
                  <div key={st.id} className="border-2 border-line bg-night p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="border border-green-500/60 px-2 py-0.5 font-cond text-xs font-bold uppercase text-green-400">
                          {st.type} MOBILITY
                        </span>
                        <h3 className="mt-1 font-stencil text-xl text-bone">
                          {st.name}
                        </h3>
                        <p className="font-cond text-xs font-semibold text-drab uppercase">
                          TARGET: {targetMuscle?.name ?? st.primaryMuscle} ({st.targetArea})
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-stencil text-base text-ember">{st.duration}</span>
                        <div className="font-cond text-xs text-drab">{st.protocol}</div>
                      </div>
                    </div>
                    <div className="mt-3 border-t border-line/50 pt-2 space-y-1 font-cond text-xs text-[#b8c2a8]">
                      {st.instructions.map((ins, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-bold text-ember">0{i + 1}.</span>
                          <span>{ins}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 border-t border-blood/30 pt-1.5 font-cond text-xs text-blood">
                      <span className="font-bold">SAFETY CHECK:</span> {st.keySafetyCheck}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Realistic 2D Motion Graphics Stage + Mobility Recovery */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4">
          {/* 2D Motion Blueprint Stage */}
          <ExerciseBlueprint2D
            exercise={activeExercise}
            highlightMuscle={selectedMuscle}
          />

          {/* Form Directives & Common Mistakes Checklist */}
          <div className="border-2 border-line bg-night p-4">
            <div className="font-stencil text-base text-ember border-b border-line pb-2 mb-3">
              EXECUTION PROTOCOL // {activeExercise.name}
            </div>
            <div className="space-y-2">
              <div className="font-cond text-xs font-bold text-drab tracking-wider">
                STEP-BY-STEP CADENCE:
              </div>
              {activeExercise.instructions.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-cond text-bone">
                  <span className="text-ember font-bold">0{idx + 1}.</span>
                  <span className="leading-tight">{step}</span>
                </div>
              ))}
            </div>

            {activeExercise.mistakes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-line/60">
                <div className="font-cond text-xs font-bold text-blood tracking-wider mb-1">
                  CRITICAL FORM FAILURES:
                </div>
                {activeExercise.mistakes.map((mistake, idx) => (
                  <div key={idx} className="text-xs font-cond text-drab flex items-center gap-1.5">
                    <span className="text-blood">✕</span>
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paired Mobility Drill for targeted muscle */}
          {pairedStretch && (
            <div className="border-2 border-green-500/40 bg-[#0d140e] p-4">
              <div className="flex items-center justify-between border-b border-green-500/30 pb-2 mb-2">
                <span className="font-stencil text-sm text-green-400">
                  TARGET MOBILITY &amp; RECOVERY // {pairedStretch.primaryMuscle.toUpperCase()}
                </span>
                <span className="font-cond text-xs font-bold text-drab">
                  {pairedStretch.duration}
                </span>
              </div>
              <div className="font-cond text-xs font-bold text-bone">
                {pairedStretch.name}
              </div>
              <p className="font-cond text-[11px] text-drab mt-1 leading-relaxed">
                {pairedStretch.instructions[0]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── CLASSIFIED TERMINAL MODAL ──────────────────────────────── */}
      <ClearanceTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onUnlocked={() => {
          setIsClassifiedUnlocked(true);
          setTerminalOpen(false);
        }}
      />
    </div>
  );
}
