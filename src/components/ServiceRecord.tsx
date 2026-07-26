"use client";

import { useEffect, useState } from "react";
import { waveFor } from "@/data/program";
import { loadStore, type Store } from "@/lib/store";
import { WAVE_CLASS } from "@/lib/wave-ui";

const exName = (id: string) => id.replace(/_/g, " ").replace(/-/g, " ").toUpperCase();

/** Home-page campaign status: current week + wave, archived-week stats, record board. */
export default function ServiceRecord() {
  const [s, setS] = useState<Store | null>(null);

  useEffect(() => {
    setS(loadStore());
  }, []);

  const wave = s ? waveFor(s.cycle) : null;
  const fullWeeks = s ? s.history.filter((h) => h.fullDays === 7).length : 0;
  let streak = 0;
  if (s) {
    for (let i = s.history.length - 1; i >= 0; i--) {
      if (s.history[i].fullDays === 7) streak++;
      else break;
    }
  }
  const prs = s
    ? Object.entries(s.prs).sort((a, b) => b[1].reps - a[1].reps).slice(0, 6)
    : [];

  return (
    <div className="border-2 border-line bg-pit">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-line bg-trench px-4 py-2">
        <span className="font-cond text-sm font-bold tracking-[0.25em] text-drab">
          SERVICE RECORD
        </span>
        {s && wave && (
          <span
            className={`border-2 px-2 py-0.5 font-cond text-sm font-bold tracking-[0.15em] ${WAVE_CLASS[wave.label]}`}
          >
            WEEK {String(s.cycle).padStart(2, "0")} · {wave.label}
          </span>
        )}
      </div>

      {s && wave ? (
        <div className="px-4 py-3">
          <p className="font-cond text-base tracking-wide text-bone/90">
            {wave.directive}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 font-cond text-sm font-semibold tracking-[0.2em] text-drab">
            <span>
              WEEKS LOGGED <span className="text-bone">{s.history.length}</span>
            </span>
            <span>
              FULL WEEKS <span className="text-go">{fullWeeks}</span>
            </span>
            <span>
              STREAK <span className={streak > 0 ? "text-go" : "text-bone"}>{streak}</span>
            </span>
          </div>
          {prs.length > 0 && (
            <div className="mt-3 border-t-2 border-dashed border-line pt-3">
              <p className="font-cond text-xs font-bold tracking-[0.25em] text-drab">
                RECORD BOARD — BEST LOGGED SET
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {prs.map(([id, pr]) => (
                  <span
                    key={id}
                    className="border border-line px-2 py-1 font-cond text-sm font-semibold tracking-wide text-bone/90"
                  >
                    {exName(id)} <span className="font-bold text-ember">{pr.reps}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-3 font-cond text-sm font-semibold tracking-[0.2em] text-drab">
          READING LOG…
        </div>
      )}
    </div>
  );
}
