"use client";

import { useEffect, useRef, useState } from "react";
import { waveFor, type Day, type ExerciseRecord } from "@/data/program";
import {
  isFixedScheme,
  isMaxScheme,
  loadStore,
  localISO,
  saveStore,
  setCount,
  type DayCard,
  type Store,
} from "@/lib/store";
import { WAVE_CLASS } from "@/lib/wave-ui";
import ExerciseBlueprint2D from "@/components/ExerciseBlueprint2D";
import { CALISTHENICS_EXERCISES, type CalisthenicsExercise } from "@/data/calisthenics-data";

type Props = {
  day: Day;
  exercises: Record<string, ExerciseRecord>;
};

type Timer = { label: string; total: number; left: number };

const LEVEL_COLOR: Record<string, string> = {
  beginner: "text-go border-go",
  intermediate: "text-ember border-ember",
  expert: "text-blood border-blood",
};

export default function SessionBoard({ day, exercises }: Props) {
  const [store, setStore] = useState<Store | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [timer, setTimer] = useState<Timer | null>(null);
  const [formatMode, setFormatMode] = useState<Record<string, "blueprint" | "photo">>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getCalisthenicsMatch = (exId: string, exRec: ExerciseRecord): CalisthenicsExercise => {
    const cleanId = exId.toLowerCase().replace(/_/g, "-");
    const existing = CALISTHENICS_EXERCISES.find(
      (c) => c.id.toLowerCase().includes(cleanId) || c.name.toLowerCase() === exRec.name.toLowerCase()
    );
    if (existing) return existing;

    const n = (exRec.name + " " + exId).toLowerCase();
    let figureType: any = "plank";
    if (n.includes("push") && !n.includes("handstand")) figureType = "pushup";
    else if (n.includes("pull") || n.includes("chin") || n.includes("hang") || n.includes("row")) figureType = "pullup";
    else if (n.includes("dip")) figureType = "dip";
    else if (n.includes("squat") || n.includes("lunge") || n.includes("calf")) figureType = "squat";
    else if (n.includes("handstand") || n.includes("pike")) figureType = "handstand";

    return {
      id: exId,
      name: exRec.name.toUpperCase(),
      tier: (exRec.level === "expert" ? "pro" : exRec.level === "intermediate" ? "advanced" : "beginner") as any,
      primaryMuscle: (exRec.primaryMuscles[0] ?? "chest") as any,
      secondaryMuscles: (exRec.secondaryMuscles ?? []) as any,
      equipment: "FLOOR",
      prescription: "STANDARD SETS",
      tempo: "3-0-1-0",
      tacticalCue: "MAINTAIN FORM INTEGRITY · NO GRAVITY REPS",
      instructions: exRec.instructions,
      mistakes: ["Breaking core line", "Incomplete range of motion"],
      blueprint: {
        figureType,
        startAngle: "180° Full Arm Extension",
        endAngle: "Peak Biomechanical Angle",
        motionVector: "Bodyweight Drive",
        focalJoints: exRec.primaryMuscles.slice(0, 3),
        tacticalCues: [
          { label: "Full range of motion", x: 50, y: 35 },
          { label: "Core tension locked", x: 45, y: 55 },
        ],
      },
    };
  };

  useEffect(() => {
    setStore(loadStore());
  }, []);

  const update = (fn: (s: Store) => void) => {
    setStore((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev) as Store;
      fn(next);
      saveStore(next);
      return next;
    });
  };

  const card: DayCard = store?.days[day.slug] ?? {};
  const wave = waveFor(store?.cycle ?? 1);
  const today = localISO();

  const allIds = day.phases.flatMap((p, pi) => p.items.map((_, ii) => `${pi}.${ii}`));
  const doneCount = allIds.filter((id) => card[id]?.done).length;
  const complete = !!store && allIds.length > 0 && doneCount === allIds.length;

  useEffect(() => {
    if (!timer || timer.left <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimer((t) => (t ? { ...t, left: t.left - 1 } : null));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer?.left === 0, timer !== null]);

  useEffect(() => {
    if (timer && timer.left <= 0) {
      const id = setTimeout(() => setTimer(null), 2500);
      return () => clearTimeout(id);
    }
  }, [timer]);

  const toggle = (id: string) =>
    update((s) => {
      const c = (s.days[day.slug] ??= {});
      const it = (c[id] ??= {});
      it.done = !it.done;
    });

  const setRep = (id: string, exId: string, si: number, val: number | null) =>
    update((s) => {
      const c = (s.days[day.slug] ??= {});
      const it = (c[id] ??= {});
      const reps = (it.reps ??= []);
      reps[si] = val;
      if (val != null && val > 0) {
        const cur = s.prs[exId];
        if (!cur || val > cur.reps) s.prs[exId] = { reps: val, date: localISO() };
      }
    });

  const restFor = (r: number) =>
    Math.max(15, Math.round((r * wave.restMult) / 5) * 5);

  return (
    <div>
      {/* week / wave orders */}
      {store && (
        <div className={`mb-4 border-2 bg-pit px-4 py-3 ${WAVE_CLASS[wave.label]}`}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="font-stencil text-2xl">
              WEEK {String(store.cycle).padStart(2, "0")} · {wave.label}
            </p>
            <p className="font-cond text-sm font-semibold tracking-wide text-bone/80">
              {wave.directive}
            </p>
          </div>
        </div>
      )}

      {/* progress strip */}
      <div className="sticky top-0 z-10 border-2 border-line bg-pit">
        <div className="flex items-center justify-between px-4 py-2 font-cond text-sm font-bold tracking-[0.2em]">
          <span className="text-drab">
            {day.restDay ? "RECOVERY TASKS" : "SESSION PROGRESS"}
          </span>
          <span className={complete ? "text-go" : "text-ember"}>
            {doneCount}/{allIds.length}
          </span>
        </div>
        <div className="h-2 border-t-2 border-line bg-night">
          <div
            className={`h-full transition-all duration-300 ${complete ? "bg-go" : "bg-ember"}`}
            style={{ width: `${allIds.length ? (doneCount / allIds.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {complete && (
        <div className="stamp-in mx-auto mt-8 w-fit -rotate-3 border-4 border-go px-6 py-3">
          <p className="font-stencil text-3xl tracking-widest text-go sm:text-4xl">
            MISSION COMPLETE
          </p>
          <p className="text-center font-cond text-sm font-semibold tracking-[0.3em] text-go/80">
            {day.weekday} · {day.codename} · CLEARED
          </p>
        </div>
      )}

      {/* phases */}
      {day.phases.map((phase, pi) => (
        <section key={phase.name} className="mt-8">
          <div className="flex items-baseline gap-3 border-b-4 border-ember pb-1">
            <span className="font-cond text-sm font-bold tracking-[0.2em] text-drab">
              PHASE {pi + 1}
            </span>
            <h2 className="font-stencil text-2xl text-bone sm:text-3xl">{phase.name}</h2>
          </div>
          {phase.directive && (
            <p className="mt-2 border-l-4 border-drab pl-3 font-cond text-base tracking-wide text-drab">
              {phase.directive}
            </p>
          )}

          <div className="mt-4 border-2 border-line">
            {phase.items.map((item, ii) => {
              const id = `${pi}.${ii}`;
              const ex = exercises[item.ex];
              const isDone = !!card[id]?.done;
              const isOpen = open === id;
              const sets = setCount(item.scheme);
              // wave progression loads the work sets, never warm-ups or stretches
              const progressed =
                !day.restDay && !/PREP|RECOVERY|MOBILITY/i.test(phase.name);
              const setsThisWeek =
                wave.deload && progressed ? Math.max(1, Math.ceil(sets / 2)) : sets;
              const logSets = isMaxScheme(item.scheme) && !day.restDay;
              const rec = store?.prs[item.ex];
              const repsArr = card[id]?.reps ?? [];
              return (
                <div key={id} className="border-b-2 border-line last:border-b-0">
                  <div
                    className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 sm:grid-cols-[auto_1fr_auto_auto_auto] sm:gap-4 ${
                      isDone ? "bg-go/10" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      aria-pressed={isDone}
                      aria-label={`Mark ${ex.name} ${isDone ? "not done" : "done"}`}
                      className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center border-2 font-cond text-lg font-bold transition-colors duration-150 ${
                        isDone
                          ? "border-go bg-go text-night"
                          : "border-line text-transparent hover:border-ember"
                      }`}
                    >
                      ✓
                    </button>

                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : id)}
                      aria-expanded={isOpen}
                      className="min-w-0 cursor-pointer text-left"
                    >
                      <span
                        className={`block font-cond text-lg font-semibold tracking-wide transition-colors duration-150 hover:text-ember ${
                          isDone ? "text-bone/50 line-through" : "text-bone"
                        }`}
                      >
                        {ex.name.toUpperCase()}
                        {item.optional && (
                          <span className="ml-2 border border-drab px-1 text-xs tracking-[0.2em] text-drab">
                            OPTIONAL
                          </span>
                        )}
                      </span>
                      {item.note && (
                        <span className="block font-cond text-sm tracking-wide text-drab">
                          {item.note}
                        </span>
                      )}
                    </button>

                    <span
                      className={`hidden border px-1.5 py-0.5 font-cond text-xs font-bold tracking-[0.15em] uppercase sm:block ${LEVEL_COLOR[ex.level] ?? "text-drab border-drab"}`}
                    >
                      {ex.level}
                    </span>

                    <span className="font-cond text-base font-bold tracking-wider text-ember">
                      {item.scheme}
                      {progressed && wave.repsDelta > 0 && isFixedScheme(item.scheme) && (
                        <span className="ml-1.5 border border-ember px-1 text-xs align-middle">
                          +{wave.repsDelta}
                        </span>
                      )}
                      {progressed && wave.deload && sets > 1 && (
                        <span className="ml-1.5 border border-go px-1 text-xs align-middle text-go">
                          ½ SETS
                        </span>
                      )}
                    </span>

                    {item.rest ? (
                      <button
                        type="button"
                        onClick={() =>
                          setTimer({
                            label: ex.name,
                            total: restFor(item.rest!),
                            left: restFor(item.rest!),
                          })
                        }
                        className="col-start-3 cursor-pointer border-2 border-line px-2 py-1 font-cond text-sm font-bold tracking-[0.15em] text-drab transition-colors duration-100 hover:border-ember hover:bg-ember hover:text-night sm:col-start-auto"
                      >
                        REST {restFor(item.rest)}s
                      </button>
                    ) : (
                      <span className="hidden sm:block" />
                    )}
                  </div>

                  {/* rep log for MAX sets */}
                  {logSets && store && (
                    <div
                      className={`flex flex-wrap items-center gap-2 border-t-2 border-dashed border-line px-3 py-2.5 ${
                        isDone ? "bg-go/10" : ""
                      }`}
                    >
                      <span className="font-cond text-xs font-bold tracking-[0.2em] text-drab">
                        LOG · REPS OR SECONDS
                      </span>
                      {Array.from({ length: setsThisWeek }, (_, si) => (
                        <input
                          key={si}
                          type="number"
                          min={0}
                          inputMode="numeric"
                          placeholder={`S${si + 1}`}
                          aria-label={`${ex.name} set ${si + 1} result`}
                          value={repsArr[si] ?? ""}
                          onChange={(e) =>
                            setRep(
                              id,
                              item.ex,
                              si,
                              e.target.value === ""
                                ? null
                                : Math.max(0, Math.floor(Number(e.target.value))),
                            )
                          }
                          className="h-9 w-14 border-2 border-line bg-night text-center font-cond text-base font-bold text-bone transition-colors duration-100 focus:border-ember"
                        />
                      ))}
                      {rec && (
                        <span
                          className={`border px-1.5 py-0.5 font-cond text-xs font-bold tracking-[0.15em] ${
                            rec.date === today
                              ? "border-go text-go"
                              : "border-drab text-drab"
                          }`}
                        >
                          {rec.date === today
                            ? `★ NEW RECORD · ${rec.reps}`
                            : `BEST · ${rec.reps}`}
                        </span>
                      )}
                    </div>
                  )}

                  {isOpen && (
                    <div className="border-t-2 border-dashed border-line bg-pit px-4 py-5">
                      {/* Format toggle banner */}
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2 font-cond text-xs font-bold">
                        <span className="tracking-[0.2em] text-drab">
                          DRILL VISUALIZATION MODE:
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFormatMode((prev) => ({ ...prev, [id]: "blueprint" }))
                            }
                            className={`cursor-pointer border px-2.5 py-1 tracking-wider transition-colors ${
                              (formatMode[id] ?? "blueprint") === "blueprint"
                                ? "border-ember bg-ember text-night"
                                : "border-line text-drab hover:border-ember hover:text-bone"
                            }`}
                          >
                            📐 2D BLUEPRINT SCHEMATIC
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormatMode((prev) => ({ ...prev, [id]: "photo" }))
                            }
                            className={`cursor-pointer border px-2.5 py-1 tracking-wider transition-colors ${
                              formatMode[id] === "photo"
                                ? "border-ember bg-ember text-night"
                                : "border-line text-drab hover:border-ember hover:text-bone"
                            }`}
                          >
                            📷 PHOTO ARCHIVE
                          </button>
                        </div>
                      </div>

                      {(formatMode[id] ?? "blueprint") === "blueprint" ? (
                        <div className="mb-4">
                          <ExerciseBlueprint2D
                            exercise={getCalisthenicsMatch(item.ex, ex)}
                          />
                        </div>
                      ) : (
                        <div className="mb-4 flex gap-2 overflow-x-auto">
                          {ex.images.map((src, i) => (
                            <img
                              key={src}
                              src={src}
                              alt={`${ex.name} — ${i === 0 ? "start" : "end"} position`}
                              loading="lazy"
                              className="max-h-64 border-2 border-line bg-white"
                            />
                          ))}
                        </div>
                      )}

                      <div className="grid gap-6">
                        <div>
                          <div className="flex flex-wrap gap-2 font-cond text-xs font-bold tracking-[0.15em] uppercase">
                            <span className={`border px-2 py-1 ${LEVEL_COLOR[ex.level] ?? "border-drab text-drab"}`}>
                              {ex.level}
                            </span>
                            {ex.mechanic && (
                              <span className="border border-drab px-2 py-1 text-drab">
                                {ex.mechanic}
                              </span>
                            )}
                            {ex.force && (
                              <span className="border border-drab px-2 py-1 text-drab">
                                FORCE: {ex.force}
                              </span>
                            )}
                          </div>
                          <dl className="mt-3 font-cond text-sm tracking-wide">
                            <div className="flex gap-2">
                              <dt className="font-bold text-ember">TARGET:</dt>
                              <dd className="uppercase text-bone/90">
                                {ex.primaryMuscles.join(" · ")}
                              </dd>
                            </div>
                            {ex.secondaryMuscles.length > 0 && (
                              <div className="mt-1 flex gap-2">
                                <dt className="font-bold text-drab">SUPPORT:</dt>
                                <dd className="uppercase text-drab">
                                  {ex.secondaryMuscles.join(" · ")}
                                </dd>
                              </div>
                            )}
                          </dl>
                          <h3 className="mt-4 font-cond text-sm font-bold tracking-[0.25em] text-drab">
                            EXECUTION
                          </h3>
                          <ol className="mt-2 space-y-2">
                            {ex.instructions.map((step, i) => (
                              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-bone/90">
                                <span className="shrink-0 font-cond font-bold text-ember">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* card controls */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            update((s) => {
              delete s.days[day.slug];
            })
          }
          className="cursor-pointer border-2 border-line px-4 py-2 font-cond text-sm font-bold tracking-[0.2em] text-drab transition-colors duration-100 hover:border-blood hover:text-blood"
        >
          RESET CARD
        </button>
        {!complete && store && (
          <p className="font-cond text-sm font-semibold tracking-[0.2em] text-drab">
            CHECK EVERY BOX. EARN THE STAMP.
          </p>
        )}
      </div>

      {/* rest timer overlay */}
      {timer && (
        <div
          role="timer"
          aria-live="polite"
          className={`fixed inset-x-0 bottom-0 z-50 border-t-4 ${
            timer.left <= 0 ? "border-night bg-go" : "border-night bg-ember"
          }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 text-night">
            <div className="min-w-0">
              <p className="truncate font-cond text-xs font-bold tracking-[0.25em]">
                {timer.left <= 0 ? "REST OVER — MOVE" : `RESTING · NEXT: ${timer.label.toUpperCase()}`}
              </p>
              <p className="font-stencil text-4xl leading-none">
                {timer.left <= 0 ? "GO" : `${timer.left}s`}
              </p>
            </div>
            <div className="hidden h-2 flex-1 border-2 border-night bg-night/20 sm:block">
              <div
                className="h-full bg-night transition-all duration-1000 ease-linear"
                style={{ width: `${Math.max(0, (timer.left / timer.total) * 100)}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => setTimer(null)}
              className="shrink-0 cursor-pointer border-2 border-night px-3 py-1.5 font-cond text-sm font-bold tracking-[0.2em] transition-colors duration-100 hover:bg-night hover:text-bone"
            >
              {timer.left <= 0 ? "DISMISS" : "ABORT"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
