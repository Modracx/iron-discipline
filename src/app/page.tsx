import Link from "next/link";
import { PROGRAM } from "@/data/program";
import DayStatus from "@/components/DayStatus";
import Marquee from "@/components/Marquee";
import ServiceRecord from "@/components/ServiceRecord";

export default function Home() {
  return (
    <main>
      {/* ── DOCUMENT COVER ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:pt-20">
        <p className="font-cond text-sm font-semibold tracking-[0.35em] text-ember">
          TRAINING CIRCULAR TC 07-1 · BODYWEIGHT ONLY · 7-DAY CYCLE
        </p>
        <h1 className="mt-3 font-stencil text-[clamp(3.2rem,13vw,9.5rem)] leading-[0.9] text-bone">
          IRON
          <br />
          DISCIPLINE
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone/90">
          A weekly military-style calisthenics program. Brutal by design,
          rewarding by completion. Five hard sessions, one tactical reset, one
          full stand down — with warm-ups, prescribed rest and stretching built
          into every training card, and every exercise explained step by step.
        </p>

        {/* mission briefing — form block */}
        <div className="mt-10 max-w-2xl border-2 border-line bg-pit">
          <div className="border-b-2 border-line bg-trench px-4 py-2 font-cond text-sm font-bold tracking-[0.25em] text-drab">
            MISSION BRIEFING
          </div>
          <dl className="divide-y divide-line font-cond text-base tracking-wide">
            {[
              ["OBJECTIVE", "Build strength, engine and mental hardness in 7 days a week, repeatable."],
              ["PERSONNEL", "Anyone. Every exercise lists a scale-up and a scale-down."],
              ["EQUIPMENT", "Floor. Wall. Pull-up bar (or a branch, beam, or playground)."],
              ["DURATION", "30–60 minutes per day. Rest is prescribed — take all of it, and no more."],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 px-4 py-2.5">
                <dt className="w-28 shrink-0 font-bold tracking-[0.2em] text-ember">{k}</dt>
                <dd className="text-bone/90">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Marquee />

      {/* ── SERVICE RECORD ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <ServiceRecord />
      </section>

      {/* ── DUTY ROSTER ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-12">
        <div className="flex items-baseline justify-between">
          <h2 className="font-stencil text-3xl text-bone sm:text-4xl">DUTY ROSTER</h2>
          <p className="font-cond text-sm font-semibold tracking-[0.25em] text-drab">
            WEEK OF: EVERY WEEK
          </p>
        </div>

        <div className="mt-6 border-2 border-line">
          {PROGRAM.map((day) => {
            const total = day.phases.reduce((n, p) => n + p.items.length, 0);
            return (
              <Link
                key={day.slug}
                href={`/day/${day.slug}`}
                className={`group grid cursor-pointer grid-cols-[auto_1fr] items-center gap-x-4 border-b-2 border-line px-4 py-4 transition-colors duration-100 last:border-b-0 hover:bg-ember sm:grid-cols-[auto_auto_1fr_auto_auto] sm:gap-x-6 ${
                  day.restDay ? "bg-pit" : ""
                }`}
              >
                <span className="row-span-2 font-cond text-5xl font-bold text-ember transition-colors duration-100 group-hover:text-night sm:row-span-1 sm:text-6xl">
                  {day.num}
                </span>
                <span className="w-14 font-cond text-sm font-semibold tracking-[0.2em] text-drab transition-colors duration-100 group-hover:text-night/70">
                  {day.weekday.slice(0, 3)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-stencil text-xl text-bone transition-colors duration-100 group-hover:text-night sm:text-2xl">
                    {day.codename}
                  </span>
                  <span className="block font-cond text-sm tracking-[0.15em] text-drab transition-colors duration-100 group-hover:text-night/70">
                    {day.focus}
                  </span>
                </span>
                <span className="hidden font-cond text-sm font-semibold tracking-[0.15em] text-drab transition-colors duration-100 group-hover:text-night/70 sm:block">
                  {day.duration}
                </span>
                <span className="col-start-2 sm:col-start-auto">
                  <DayStatus slug={day.slug} total={total} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── THE WAVE — why rest is in the plan ─────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-stencil text-3xl text-bone sm:text-4xl">THE WAVE</h2>
        <p className="mt-2 max-w-2xl text-bone/80">
          The week is shaped like an assault: three days up, one down, two up,
          one off. That rhythm is not mercy — it is what makes the hard days
          repeatable for years.
        </p>
        <div className="mt-6 grid gap-px border-2 border-line bg-line sm:grid-cols-3">
          {[
            {
              k: "STRIKE",
              d: "DAYS 01–03",
              t: "Push, legs, core. Three focused assaults while you are fresh. Volume is high, rest is short, standards are non-negotiable.",
            },
            {
              k: "RESET",
              d: "DAY 04",
              t: "Active recovery. Long holds, easy movement, blood flow. The session that makes Saturday survivable — skipping it is how you break.",
            },
            {
              k: "PEAK & REFIT",
              d: "DAYS 05–07",
              t: "Pull day, then everything at once in The Smoker. Then a full stand down: muscle is built in the rest, not the reps.",
            },
          ].map((c) => (
            <div key={c.k} className="bg-night p-5">
              <p className="font-stencil text-2xl text-ember">{c.k}</p>
              <p className="mt-1 font-cond text-sm font-semibold tracking-[0.25em] text-drab">
                {c.d}
              </p>
              <p className="mt-3 leading-relaxed text-bone/85">{c.t}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
