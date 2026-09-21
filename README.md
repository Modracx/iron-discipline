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

- **Interactive 3D anatomical body scanner** — 360° orbitable Z-Anatomy muscular model (411 muscle volumes, fasciae stripped) with PBR muscle-tissue shading, image-based lighting, contact shadows and bloom-highlighted muscle selection; BVH-accelerated hover picking
- **5 difficulty progression tiers** — Beginner (Recruit), Advanced (Specialist), Pro (Veteran), Military (Combat Ready), and Brutal (Apex Gymnastics)
- **Classified clearance lock** — Military & Brutal tiers are restricted combat protocols requiring authorization
- **Strict bodyweight calisthenics only** — zero gym machines, barbells, or weights; floor, wall, and bar mastery only
- **2D motion blueprints** — one articulated skeletal rig (IK-planted hands and feet) posed by keyframes for ~90 movements; joint angles and motion vectors on the drawing are derived live from the skeleton
- **3D motion mode** — the same keyframed moves drive a Mixamo-rigged mannequin in three.js (bones are aimed along the 2D skeleton each frame), with equipment built from the move's prop list and the target muscle lit on the body; no motion-capture clips needed
- **Dynamic & static stretches** — targeted pre-workout mobility and post-workout static recovery drills for all muscle groups
- **7-day repeating program** — five training sessions, one active-recovery day, one full rest day
- **Per-exercise check-offs and rep logging** — mark sets done, log reps for MAX-effort sets, and track personal records automatically
- **4-week progressive wave** — BASELINE → BUILD → SURGE → DELOAD; rest multipliers and rep deltas applied automatically each week
- **Service record** — weekly history preserved in `localStorage`; shows completed days, full-week streaks, and per-exercise PRs
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
| 3D | [three.js](https://threejs.org/) + [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh); model built with [glTF-Transform](https://gltf-transform.dev/) |
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
│   ├── InteractiveBody3D.tsx    # three.js anatomical scanner (materials, lighting, picking)
│   ├── ExerciseBlueprint2D.tsx  # Motion blueprint panel: SVG renderer + 2D/3D toggle
│   ├── MotionFigure3D.tsx       # three.js viewer driving the rigged mannequin
│   ├── BlueprintThumb.tsx       # static start/peak stills for drill cards
│   ├── CalisthenicsTacticalHub.tsx # Tier / muscle filters, drill catalog, routines
│   ├── ServiceRecord.tsx   # Weekly history, streak stats, and personal records panel
│   ├── DayStatus.tsx       # Compact completion badge shown in the duty roster
│   └── Marquee.tsx         # Scrolling motivational phrases ticker
├── data/
│   ├── program.ts          # All 7 days, phases, exercises, schemes, and wave definitions
│   └── exercises.json      # 800+ exercise records (name, muscles, instructions, images)
└── lib/
    ├── store.ts            # localStorage read/write, week rollover, PR tracking
    ├── rig2d.ts            # 2D skeletal rig, IK, keyframed moves library, movement classifier
    ├── rig3d.ts            # retargets the 2D skeleton onto Mixamo bones
    └── wave-ui.ts          # Wave label helpers for UI display
scripts/
└── build-lean-model.mjs    # public/models/muscular_lean.glb from the full Z-Anatomy GLB
assets-src/
└── muscular_male.glb       # full Z-Anatomy source model (12 MB, not deployed)
```

### 3D model

`public/models/muscular_lean.glb` is generated from `assets-src/muscular_male.glb` (Z-Anatomy muscular system, kept out of `public/` so it is not deployed) by `npm run build:model`: fasciae, bursae, tendon sheaths, origin/insertion marker patches and internal muscles are dropped, the remaining 411 muscle bodies are simplified and Draco-compressed (12 MB → 2.3 MB). Edit the hide-list in the script if you need other structures visible.

`public/models/mannequin.glb` is the three.js `Xbot` Mixamo character (Draco-compressed, animation clips stripped); `MotionFigure3D` poses it procedurally, so any move added to `rig2d.ts` works in 3D immediately.

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
