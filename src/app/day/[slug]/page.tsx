import Link from "next/link";
import { notFound } from "next/navigation";
import { PROGRAM, type ExerciseRecord } from "@/data/program";
import EXERCISES from "@/data/exercises.json";
import SessionBoard from "@/components/SessionBoard";

export function generateStaticParams() {
  return PROGRAM.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const day = PROGRAM.find((d) => d.slug === slug);
  if (!day) return {};
  return {
    title: `DAY ${day.num} — ${day.codename} | IRON DISCIPLINE`,
    description: day.briefing,
  };
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = PROGRAM.findIndex((d) => d.slug === slug);
  if (idx === -1) notFound();
  const day = PROGRAM[idx];
  const prev = PROGRAM[(idx + PROGRAM.length - 1) % PROGRAM.length];
  const next = PROGRAM[(idx + 1) % PROGRAM.length];

  const all = EXERCISES as Record<string, ExerciseRecord>;
  const subset: Record<string, ExerciseRecord> = {};
  for (const phase of day.phases) {
    for (const item of phase.items) {
      const rec = all[item.ex];
      if (!rec) throw new Error(`Unknown exercise id in program: ${item.ex}`);
      subset[item.ex] = rec;
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      {/* header */}
      <div className="pt-8">
        <Link
          href="/"
          className="font-cond text-sm font-bold tracking-[0.25em] text-drab transition-colors duration-100 hover:text-ember"
        >
          ◄ DUTY ROSTER
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b-4 border-ember pb-4">
          <div>
            <p className="font-cond text-sm font-bold tracking-[0.3em] text-ember">
              DAY {day.num} · {day.weekday}
              {day.restDay && " · RECOVERY"}
            </p>
            <h1 className="mt-1 font-stencil text-[clamp(2.4rem,8vw,5rem)] leading-none text-bone">
              {day.codename}
            </h1>
          </div>
          <div className="font-cond text-sm font-semibold tracking-[0.2em] text-drab">
            <p>FOCUS: {day.focus}</p>
            <p className="mt-1">TIME: {day.duration}</p>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-bone/90">{day.briefing}</p>

        {day.notes && (
          <ul className="mt-4 max-w-3xl space-y-1.5">
            {day.notes.map((n) => (
              <li key={n} className="flex gap-2 font-cond text-base tracking-wide text-drab">
                <span className="font-bold text-ember">▲</span>
                {n}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <SessionBoard day={day} exercises={subset} />
      </div>

      {/* prev / next */}
      <nav className="mt-12 grid grid-cols-2 gap-px border-2 border-line bg-line">
        <Link
          href={`/day/${prev.slug}`}
          className="group bg-night p-4 transition-colors duration-100 hover:bg-ember"
        >
          <p className="font-cond text-xs font-bold tracking-[0.25em] text-drab group-hover:text-night/70">
            ◄ PREVIOUS
          </p>
          <p className="mt-1 font-stencil text-lg text-bone group-hover:text-night">
            {prev.num} · {prev.codename}
          </p>
        </Link>
        <Link
          href={`/day/${next.slug}`}
          className="group bg-night p-4 text-right transition-colors duration-100 hover:bg-ember"
        >
          <p className="font-cond text-xs font-bold tracking-[0.25em] text-drab group-hover:text-night/70">
            NEXT ►
          </p>
          <p className="mt-1 font-stencil text-lg text-bone group-hover:text-night">
            {next.num} · {next.codename}
          </p>
        </Link>
      </nav>
    </main>
  );
}
