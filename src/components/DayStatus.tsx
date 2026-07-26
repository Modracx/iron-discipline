"use client";

import { useEffect, useState } from "react";
import { loadStore } from "@/lib/store";

/** Reads the training log after mount; shows the day's completion state on the roster. */
export default function DayStatus({ slug, total }: { slug: string; total: number }) {
  const [done, setDone] = useState<number | null>(null);

  useEffect(() => {
    const s = loadStore();
    setDone(Object.values(s.days[slug] ?? {}).filter((i) => i.done).length);
  }, [slug]);

  if (done === null) {
    return (
      <span className="font-cond text-sm font-semibold tracking-[0.15em] text-drab">
        — — —
      </span>
    );
  }
  if (done >= total) {
    return (
      <span className="border-2 border-go px-2 py-0.5 font-cond text-sm font-bold tracking-[0.15em] text-go">
        COMPLETE
      </span>
    );
  }
  if (done > 0) {
    return (
      <span className="border-2 border-ember px-2 py-0.5 font-cond text-sm font-bold tracking-[0.15em] text-ember">
        {done}/{total}
      </span>
    );
  }
  return (
    <span className="font-cond text-sm font-semibold tracking-[0.15em] text-drab">
      AWAITING
    </span>
  );
}
