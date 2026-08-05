# IRON DISCIPLINE

> **TC 07-1 · Bodyweight Only · 7-Day Cycle**
>
> A weekly military-style calisthenics program. Brutal by design, rewarding by completion. Five hard sessions, one tactical reset, one full stand down — with warm-ups, prescribed rest and stretching built into every training card, and every exercise explained step by step.

---

## Overview

Iron Discipline is a Next.js web application that delivers a fully self-contained, no-equipment strength and conditioning program styled as a military field manual. It tracks your progress locally in the browser and automatically advances through a 4-week progressive overload wave each time a new week begins.

No accounts. No server. No gym membership required — floor, wall, and a pull-up bar (or a branch) is enough.

---

## Features

- **7-day repeating program** — five training sessions, one active-recovery day, one full rest day
- **Per-exercise check-offs and rep logging** — mark sets done, log reps for MAX-effort sets, and track personal records automatically
- **4-week progressive wave** — BASELINE → BUILD → SURGE → DELOAD; rest multipliers and rep deltas applied automatically each week
- **Service record** — weekly history preserved in `localStorage`; shows completed days, full-week streaks, and per-exercise PRs
- **Exercise library** — 800+ exercises pulled from the [free-exercise-db](https://github.com/yuhonas/free-exercise-db) dataset, each with step-by-step instructions and images
- **Scale-up / scale-down options** — every session brief includes progressions and regressions; optional expert movements are clearly marked
- **Zero dependencies at runtime** — all data lives in `localStorage`; no backend, no auth, no tracking

---

## The Program

The week is shaped like an assault: three days up, one down, two up, one off.

| Day | Codename | Focus | Duration |
|-----|----------|-------|----------|
| 01 · MON | **PUSH PROTOCOL** | Chest · Shoulders · Triceps | 50–60 min |
| 02 · TUE | **LOWER BODY ASSAULT** | Quads · Glutes · Hamstrings · Calves | 50–60 min |
| 03 · WED | **CORE CRUCIBLE** | Abs · Obliques · Lower Back | 40–50 min |
| 04 · THU | **TACTICAL RESET** | Active Recovery · Mobility | 30–40 min |
| 05 · FRI | **PULL COMMAND** | Back · Lats · Biceps · Posterior Chain | 50–60 min |
| 06 · SAT | **THE SMOKER** | Full Body · Conditioning · Mental | 45–55 min |
| 07 · SUN | **STAND DOWN** | Full Rest · Repair · Refit | 15 min optional |

### The 4-Week Wave

Every session prescription is automatically adjusted based on which week of the cycle you are in:

| Week | Label | Effect |
|------|-------|--------|
| 1 | **BASELINE** | Establish your numbers — log every MAX set |
| 2 | **BUILD** | +2 reps to every fixed set; match or beat last week's MAXes |
| 3 | **SURGE** | +4 reps to fixed sets; rest cut to 85% |
| 4 | **DELOAD** | Half the sets, full rest (1.5×), perfect form — recovery is the mission |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Fonts | Saira Stencil One · Barlow Condensed · Barlow (via `next/font/google`) |
| State | `localStorage` — no server, no database |
| Exercise data | [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (public domain) |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, header, footer
│   ├── page.tsx            # Home: mission briefing, duty roster, "The Wave" explainer
│   ├── globals.css         # Design tokens (Tailwind @theme), animations, base styles
│   └── day/[slug]/
│       └── page.tsx        # Per-day training card with phases, sets and exercise detail
├── components/
│   ├── SessionBoard.tsx    # Main interactive training card — check-offs, rep logging, PRs
│   ├── ServiceRecord.tsx   # Weekly history, streak stats, and personal records panel
│   ├── DayStatus.tsx       # Compact completion badge shown in the duty roster
│   └── Marquee.tsx         # Scrolling motivational phrases ticker
├── data/
│   ├── program.ts          # All 7 days, phases, exercises, schemes, and wave definitions
│   └── exercises.json      # 800+ exercise records (name, muscles, instructions, images)
└── lib/
    ├── store.ts            # localStorage read/write, week rollover, PR tracking
    └── wave-ui.ts          # Wave label helpers for UI display
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm (comes with Node)

### Install & run

```bash
git clone https://github.com/Modracx/iron-discipline.git
cd iron-discipline
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

---

## Design System

The UI is intentionally styled as a military field manual — dark, tactical, no-nonsense.

| Token | Value | Role |
|-------|-------|------|
| `night` | `#10140f` | Page background (gunmetal + olive) |
| `pit` | `#161c14` | Sunken panels |
| `trench` | `#1f271d` | Raised surfaces / hover states |
| `line` | `#2e372b` | Borders |
| `drab` | `#99a184` | Olive-drab labels / metadata |
| `bone` | `#eae7da` | Body text (field-manual paper) |
| `ember` | `#f97316` | Safety orange — primary accent |
| `go` | `#22c55e` | Mission complete |
| `blood` | `#ef4444` | Max-effort indicators / warnings |

A subtle tactical grid (48 × 48 px) is applied to the background via CSS to reinforce the field-manual aesthetic. Animations respect `prefers-reduced-motion`.

---

## Data & Privacy

All training data — completed sets, logged reps, personal records, and weekly history — is stored exclusively in your browser's `localStorage` under the key `iron-discipline:log`. Nothing is sent to any server.

Clearing your browser's site data will erase your training log. Export/backup functionality is not currently implemented.

---

## Exercise Data Attribution

Exercise names, instructions, and images are sourced from the [free-exercise-db](https://github.com/yuhonas/free-exercise-db) project by [yuhonas](https://github.com/yuhonas), released into the **public domain**.

---

## License

This project is licensed under the [Apache 2.0 License](LICENSE).
