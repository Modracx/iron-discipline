import { PROGRAM } from "@/data/program";

/**
 * All training data lives in one versioned localStorage record.
 * On load, if the stored week has ended, the week is archived into
 * `history`, the cycle counter advances, and the day cards reset.
 */

const KEY = "iron-discipline:log";

export type ItemState = { done?: boolean; reps?: (number | null)[] };
export type DayCard = Record<string, ItemState>;

export type WeekArchive = {
  week: number;
  weekStart: string;
  fullDays: number;
  days: Record<string, { done: number; total: number }>;
};

export type Store = {
  v: 2;
  /** 1-based week number in the program; drives wave progression */
  cycle: number;
  /** local ISO date of the Monday this week's cards belong to */
  weekStart: string;
  days: Record<string, DayCard>;
  history: WeekArchive[];
  /** best logged set per exercise id */
  prs: Record<string, { reps: number; date: string }>;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function localISO(d = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function mondayOf(d = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return localISO(x);
}

function weeksBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 604_800_000);
}

export function dayTotal(slug: string): number {
  const d = PROGRAM.find((x) => x.slug === slug);
  return d ? d.phases.reduce((n, p) => n + p.items.length, 0) : 0;
}

function fresh(): Store {
  return { v: 2, cycle: 1, weekStart: mondayOf(), days: {}, history: [], prs: {} };
}

/** Convert pre-v2 per-day checkbox arrays (`iron-discipline:<slug>`) into a v2 store. */
function migrateLegacy(): Store {
  const s = fresh();
  for (const d of PROGRAM) {
    const legacyKey = `iron-discipline:${d.slug}`;
    try {
      const raw = localStorage.getItem(legacyKey);
      if (raw) {
        const ids = JSON.parse(raw);
        if (Array.isArray(ids) && ids.length) {
          s.days[d.slug] = Object.fromEntries(
            ids.map((id: string) => [id, { done: true }]),
          );
        }
      }
      localStorage.removeItem(legacyKey);
    } catch {}
  }
  return s;
}

function buildArchive(s: Store): WeekArchive | null {
  const days: WeekArchive["days"] = {};
  let any = false;
  let fullDays = 0;
  for (const d of PROGRAM) {
    const states = Object.values(s.days[d.slug] ?? {});
    const done = states.filter((i) => i.done).length;
    if (done > 0 || states.some((i) => i.reps?.some((r) => r != null))) any = true;
    const total = dayTotal(d.slug);
    days[d.slug] = { done, total };
    if (total > 0 && done === total) fullDays++;
  }
  return any ? { week: s.cycle, weekStart: s.weekStart, fullDays, days } : null;
}

export function loadStore(): Store {
  if (typeof window === "undefined") return fresh();
  let s: Store | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.v === 2) s = parsed as Store;
    }
  } catch {}
  if (!s) {
    s = migrateLegacy();
    saveStore(s);
  }
  const nowMonday = mondayOf();
  if (s.weekStart !== nowMonday) {
    const arc = buildArchive(s);
    if (arc) s.history = [...s.history, arc];
    s.cycle += Math.max(1, weeksBetween(s.weekStart, nowMonday));
    s.weekStart = nowMonday;
    s.days = {};
    saveStore(s);
  }
  return s;
}

export function saveStore(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

/** "4 × MAX" → 4; schemes without a leading set count → 1 */
export function setCount(scheme: string): number {
  const m = scheme.match(/^(\d+)\s*[×x]/i);
  return m ? parseInt(m[1], 10) : 1;
}

export const isMaxScheme = (scheme: string) => /MAX/i.test(scheme);
export const isFixedScheme = (scheme: string) => /\d\s*[×x]\s*\d/i.test(scheme);
