export type PhaseItem = {
  /** id into exercises.json */
  ex: string;
  /** prescription, e.g. "4 × 25" or "3 × 30s" */
  scheme: string;
  /** rest after each set, in seconds */
  rest?: number;
  note?: string;
  optional?: boolean;
};

export type Phase = {
  name: string;
  directive?: string;
  items: PhaseItem[];
};

export type Day = {
  slug: string;
  num: string;
  weekday: string;
  codename: string;
  focus: string;
  duration: string;
  briefing: string;
  restDay?: boolean;
  notes?: string[];
  phases: Phase[];
};

export type ExerciseRecord = {
  name: string;
  level: string;
  mechanic: string | null;
  force: string | null;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  images: string[];
};

export type Wave = {
  label: string;
  directive: string;
  /** multiplier applied to prescribed rest seconds */
  restMult: number;
  /** reps added to every fixed set (e.g. "3 × 12" → 3 × 14) */
  repsDelta: number;
  deload?: boolean;
};

/** 4-week wave: three weeks of climbing load, then a deload. Indexed by (cycle - 1) % 4. */
export const WAVES: Wave[] = [
  {
    label: "BASELINE",
    directive: "Week 1 of the wave. Establish your numbers — log every MAX set.",
    restMult: 1,
    repsDelta: 0,
  },
  {
    label: "BUILD",
    directive: "Week 2. Add +2 reps to every fixed set. Match or beat last week's MAX numbers.",
    restMult: 1,
    repsDelta: 2,
  },
  {
    label: "SURGE",
    directive: "Week 3. Add +4 reps to fixed sets. Rest is cut to 85%. Hold the standard.",
    restMult: 0.85,
    repsDelta: 4,
  },
  {
    label: "DELOAD",
    directive: "Week 4. Half the sets, full rest, perfect form. Recovery is the mission.",
    restMult: 1.5,
    repsDelta: 0,
    deload: true,
  },
];

export const waveFor = (cycle: number): Wave =>
  WAVES[(((cycle - 1) % 4) + 4) % 4];

export const PROGRAM: Day[] = [
  {
    slug: "push-protocol",
    num: "01",
    weekday: "MONDAY",
    codename: "PUSH PROTOCOL",
    focus: "CHEST · SHOULDERS · TRICEPS",
    duration: "50–60 MIN",
    briefing:
      "The week opens on your strongest pattern so there is nowhere to hide. Every pressing angle gets hit: horizontal, decline, close-grip, explosive. MAX means maximum clean reps — the set ends when your form breaks, not when your ego does. Rest exactly as prescribed; the clock is part of the workout.",
    notes: [
      "Scale up: elevate feet or slow every rep to a 3-second descent.",
      "Scale down: drop to knees or press from an incline — finish the set count no matter what.",
    ],
    phases: [
      {
        name: "PREP DRILL",
        directive: "Raise heart rate and open the shoulders. Move briskly, do not rush.",
        items: [
          { ex: "Star_Jump", scheme: "2 × 20", rest: 30 },
          { ex: "Wrist_Circles", scheme: "2 × 10 EACH WAY" },
          { ex: "Inchworm", scheme: "2 × 8", rest: 30 },
          { ex: "Incline_Push-Up", scheme: "2 × 8", rest: 30, note: "Ramp sets — easy angle, perfect reps. Rehearse the pattern before the assault." },
          { ex: "Isometric_Chest_Squeezes", scheme: "2 × 10s HOLD", rest: 30 },
        ],
      },
      {
        name: "MAIN EFFORT",
        items: [
          { ex: "Plyo_Push-up", scheme: "3 × 8", rest: 90, note: "First, while you are fresh — every rep at full power off the floor. Land soft." },
          { ex: "Pushups", scheme: "4 × MAX", rest: 90 },
          { ex: "Push-Ups_With_Feet_Elevated", scheme: "3 × 12", rest: 75, note: "3-second descent on every rep. Tempo is the load — no gravity-assisted reps." },
          { ex: "Push-Ups_-_Close_Triceps_Position", scheme: "3 × 12", rest: 75 },
          { ex: "Dips_-_Triceps_Version", scheme: "3 × 15", rest: 60, note: "Use two sturdy chairs or parallel bars." },
          { ex: "Push_Up_to_Side_Plank", scheme: "2 × 10 / SIDE", rest: 60 },
          { ex: "Handstand_Push-Ups", scheme: "2 × 5", rest: 120, optional: true, note: "OPTIONAL — expert only. Use a wall." },
        ],
      },
      {
        name: "RECOVERY DRILL",
        directive: "Hold each stretch. Breathe slow through the nose. Do not skip this.",
        items: [
          { ex: "Overhead_Triceps", scheme: "30s / SIDE" },
          { ex: "One_Arm_Against_Wall", scheme: "30s / SIDE" },
          { ex: "Seated_Front_Deltoid", scheme: "2 × 30s" },
        ],
      },
    ],
  },
  {
    slug: "lower-body-assault",
    num: "02",
    weekday: "TUESDAY",
    codename: "LOWER BODY ASSAULT",
    focus: "QUADS · GLUTES · HAMSTRINGS · CALVES",
    duration: "50–60 MIN",
    briefing:
      "Legs carry the ruck, legs finish the march. High-rep squats build the engine, single-leg work removes the imbalances that get you injured, and jump squats teach your legs to fire when they are already empty. Walk it off between sets — never sit down.",
    notes: [
      "Depth standard: hip crease below the knee on every squat. Half reps are zero reps.",
      "Scale down jump squats to bodyweight squats at tempo if your knees complain.",
    ],
    phases: [
      {
        name: "PREP DRILL",
        directive: "Grease the hips, knees and ankles before loading them.",
        items: [
          { ex: "Fast_Skipping", scheme: "3 × 30s", rest: 30 },
          { ex: "Standing_Hip_Circles", scheme: "2 × 10 EACH WAY" },
          { ex: "Knee_Circles", scheme: "2 × 10 EACH WAY" },
          { ex: "Butt_Lift_Bridge", scheme: "2 × 12", rest: 30, note: "Wake the glutes up before you load them." },
          { ex: "Crossover_Reverse_Lunge", scheme: "2 × 8 / SIDE", rest: 30 },
        ],
      },
      {
        name: "MAIN EFFORT",
        items: [
          { ex: "Freehand_Jump_Squat", scheme: "3 × 12", rest: 90, note: "First, while your legs are fresh. Explode up, absorb the landing, reset, repeat." },
          { ex: "Bodyweight_Squat", scheme: "4 × 25", rest: 75 },
          { ex: "Bodyweight_Walking_Lunge", scheme: "3 × 20 STEPS", rest: 75 },
          { ex: "Step-up_with_Knee_Raise", scheme: "3 × 12 / SIDE", rest: 60, note: "Use a bench, box or stairs." },
          { ex: "Single_Leg_Glute_Bridge", scheme: "3 × 12 / SIDE", rest: 60 },
          { ex: "Natural_Glute_Ham_Raise", scheme: "2 × 8", rest: 90, note: "Anchor your feet. Push off the floor as little as possible." },
          { ex: "Donkey_Calf_Raises", scheme: "3 × 20", rest: 45, note: "Hinge over a table or rail. Full stretch at the bottom, 3 seconds down." },
        ],
      },
      {
        name: "RECOVERY DRILL",
        items: [
          { ex: "90_90_Hamstring", scheme: "30s / SIDE" },
          { ex: "All_Fours_Quad_Stretch", scheme: "30s / SIDE" },
          { ex: "Calf_Stretch_Hands_Against_Wall", scheme: "30s / SIDE" },
          { ex: "Lying_Glute", scheme: "30s / SIDE" },
        ],
      },
    ],
  },
  {
    slug: "core-crucible",
    num: "03",
    weekday: "WEDNESDAY",
    codename: "CORE CRUCIBLE",
    focus: "ABDOMINALS · OBLIQUES · LOWER BACK",
    duration: "40–50 MIN",
    briefing:
      "Every rep you did this week ran through your trunk — today you pay it forward. Flexion, rotation, anti-rotation and isometric holds in one sitting. When the plank starts shaking, that is the exercise beginning, not ending. Quality over speed on every movement.",
    notes: [
      "Keep the lower back pressed to the floor on all leg-lowering work.",
      "If your hip flexors take over, shorten the range — the target is the trunk.",
    ],
    phases: [
      {
        name: "PREP DRILL",
        items: [
          { ex: "Star_Jump", scheme: "2 × 15", rest: 30 },
          { ex: "Scissor_Kick", scheme: "2 × 15", rest: 30 },
          { ex: "Dead_Bug", scheme: "2 × 10", rest: 30, note: "Slow and deliberate — this switches the core on." },
        ],
      },
      {
        name: "MAIN EFFORT",
        items: [
          { ex: "Sit-Up", scheme: "4 × 25", rest: 60 },
          { ex: "Flutter_Kicks", scheme: "4 × 30s", rest: 45 },
          { ex: "Plank", scheme: "4 × 60s", rest: 60 },
          { ex: "Russian_Twist", scheme: "3 × 20", rest: 60 },
          { ex: "Air_Bike", scheme: "3 × 30s", rest: 45 },
          { ex: "Side_Bridge", scheme: "3 × 45s / SIDE", rest: 60 },
          { ex: "Reverse_Crunch", scheme: "3 × 15", rest: 45, note: "Curl the hips off the floor — no swinging, no momentum." },
          { ex: "Hanging_Leg_Raise", scheme: "3 × 8", rest: 90, optional: true, note: "OPTIONAL — expert, on the bar. Toes to the bar if you have it." },
        ],
      },
      {
        name: "RECOVERY DRILL",
        items: [
          { ex: "Lower_Back_Curl", scheme: "3 × 10s HOLD" },
          { ex: "Lying_Crossover", scheme: "30s / SIDE" },
          { ex: "Toe_Touchers", scheme: "2 × 30s" },
          { ex: "Stomach_Vacuum", scheme: "3 × 15s", note: "Breathe out fully, then draw the navel to the spine." },
        ],
      },
    ],
  },
  {
    slug: "tactical-reset",
    num: "04",
    weekday: "THURSDAY",
    codename: "TACTICAL RESET",
    focus: "ACTIVE RECOVERY · MOBILITY · BLOOD FLOW",
    duration: "30–40 MIN",
    restDay: true,
    briefing:
      "Recovery is a mission, not a day off. Three brutal days are behind you and the two hardest are ahead — today you move blood through wrecked muscle without adding damage. Every hold is long and boring on purpose. Skipping today is how you break on Saturday.",
    notes: [
      "Finish with a 20–30 minute easy walk or light ruck. Conversational pace.",
      "Hydrate. Eat. Sleep 8 hours tonight — that is an order, not a suggestion.",
    ],
    phases: [
      {
        name: "MOBILITY CIRCUIT",
        directive: "Work top to bottom. Nothing here should hurt — back off anything that does.",
        items: [
          { ex: "Inchworm", scheme: "2 × 10", rest: 30 },
          { ex: "Standing_Hip_Circles", scheme: "2 × 10 EACH WAY" },
          { ex: "Groiners", scheme: "2 × 10", rest: 30 },
          { ex: "90_90_Hamstring", scheme: "2 × 45s / SIDE" },
          { ex: "All_Fours_Quad_Stretch", scheme: "2 × 45s / SIDE" },
          { ex: "Lying_Crossover", scheme: "45s / SIDE" },
          { ex: "Lower_Back_Curl", scheme: "3 × 15s HOLD" },
          { ex: "Calf_Stretch_Hands_Against_Wall", scheme: "45s / SIDE" },
          { ex: "Overhead_Triceps", scheme: "45s / SIDE" },
          { ex: "Seated_Front_Deltoid", scheme: "2 × 45s" },
          { ex: "Stomach_Vacuum", scheme: "3 × 20s" },
        ],
      },
    ],
  },
  {
    slug: "pull-command",
    num: "05",
    weekday: "FRIDAY",
    codename: "PULL COMMAND",
    focus: "BACK · LATS · BICEPS · POSTERIOR CHAIN",
    duration: "50–60 MIN",
    briefing:
      "The bar does not negotiate. Five max sets of pull-ups set the tone, then grip variations and posterior-chain work balance every push rep from Monday. Dead hang at the bottom, chin over the bar at the top — anything else is a repetition you did not do. No bar? Find a branch, a beam, a playground.",
    notes: [
      "Scale down: jump to the top and lower for 5 slow seconds (negatives) once you can no longer pull.",
      "Grip giving out before your back? Good. That is the point. Hang on.",
    ],
    phases: [
      {
        name: "PREP DRILL",
        items: [
          { ex: "Star_Jump", scheme: "2 × 20", rest: 30 },
          { ex: "Front_Leg_Raises", scheme: "2 × 10 / SIDE" },
          { ex: "Wrist_Circles", scheme: "2 × 10 EACH WAY" },
          { ex: "Scapular_Pull-Up", scheme: "2 × 8", rest: 30, note: "Dead hang. Pull the shoulder blades down without bending the arms." },
          { ex: "Superman", scheme: "2 × 10", rest: 30, note: "Activation only — smooth reps, brief hold at the top." },
        ],
      },
      {
        name: "MAIN EFFORT",
        items: [
          { ex: "Pullups", scheme: "5 × MAX", rest: 120 },
          { ex: "Inverted_Row", scheme: "3 × 12", rest: 75, note: "Under a table or low bar, body rigid as a plank. Chest to the bar every rep." },
          { ex: "Chin-Up", scheme: "4 × 8", rest: 90, note: "Can't pull anymore? Jump to the top and take 5 slow seconds down. The set count stands." },
          { ex: "Body-Up", scheme: "3 × 10", rest: 75 },
          { ex: "Hyperextensions_With_No_Hyperextension_Bench", scheme: "3 × 15", rest: 60 },
          { ex: "Gorilla_Chin_Crunch", scheme: "3 × 10", rest: 60 },
          { ex: "One_Handed_Hang", scheme: "1 × MAX HOLD", rest: 60, note: "Grip finisher. Two hands permitted — hang until your grip dies. Log the seconds." },
        ],
      },
      {
        name: "RECOVERY DRILL",
        items: [
          { ex: "Seated_Biceps", scheme: "30s / SIDE" },
          { ex: "One_Arm_Against_Wall", scheme: "30s / SIDE" },
          { ex: "Overhead_Triceps", scheme: "30s / SIDE" },
        ],
      },
    ],
  },
  {
    slug: "the-smoker",
    num: "06",
    weekday: "SATURDAY",
    codename: "THE SMOKER",
    focus: "FULL BODY · CONDITIONING · MENTAL",
    duration: "45–55 MIN",
    briefing:
      "Everything from the week, welded into one circuit. Seven stations, back to back, no rest inside the round — 90 seconds between rounds, five rounds total. Round three is where your head starts lying to you. The finisher exists to prove the tank was never actually empty. Earn your Sunday.",
    notes: [
      "Round pace: steady and unbroken beats fast and collapsing. Slow is smooth, smooth is fast.",
      "Log your total time. Next week you race it.",
    ],
    phases: [
      {
        name: "PREP DRILL",
        items: [
          { ex: "Fast_Skipping", scheme: "2 × 30s", rest: 30 },
          { ex: "Inchworm", scheme: "2 × 8", rest: 30 },
          { ex: "Standing_Hip_Circles", scheme: "2 × 10 EACH WAY" },
        ],
      },
      {
        name: "THE CIRCUIT — 5 ROUNDS",
        directive:
          "All seven stations back to back = one round. 90 seconds rest between rounds. Five rounds. Check each station once you have survived all five rounds of it.",
        items: [
          { ex: "Star_Jump", scheme: "20 REPS" },
          { ex: "Pushups", scheme: "15 REPS" },
          { ex: "Pullups", scheme: "5 REPS", note: "No bar in reach? 8 inverted rows under a table instead." },
          { ex: "Bodyweight_Squat", scheme: "20 REPS" },
          { ex: "Mountain_Climbers", scheme: "30 TOTAL" },
          { ex: "Sit-Up", scheme: "15 REPS" },
          { ex: "Rocket_Jump", scheme: "10 REPS" },
        ],
      },
      {
        name: "FINISHER",
        directive: "Straight after round five. No extra rest. This is the rewarding part — later.",
        items: [
          { ex: "Wind_Sprints", scheme: "3 × 20s", rest: 40 },
          { ex: "Plank", scheme: "1 × MAX HOLD", note: "Hold until failure. Log the time." },
        ],
      },
      {
        name: "RECOVERY DRILL",
        items: [
          { ex: "90_90_Hamstring", scheme: "45s / SIDE" },
          { ex: "Calf_Stretch_Hands_Against_Wall", scheme: "45s / SIDE" },
          { ex: "Toe_Touchers", scheme: "2 × 30s" },
          { ex: "Lower_Back_Curl", scheme: "3 × 10s HOLD" },
        ],
      },
    ],
  },
  {
    slug: "stand-down",
    num: "07",
    weekday: "SUNDAY",
    codename: "STAND DOWN",
    focus: "FULL REST · REPAIR · REFIT",
    duration: "15 MIN OPTIONAL",
    restDay: true,
    briefing:
      "Full stand down. Muscle is not built during the workout — it is built now, while you rest. No training, no 'just a quick session'. Optional light mobility below if you feel stiff, otherwise: eat well, walk a little, sleep long. Report back to Day 01 tomorrow, stronger than last Monday.",
    notes: [
      "Review the week: which MAX sets went up? Log it.",
      "Prep for Monday: food ready, kit ready, alarm set. Discipline starts the night before.",
    ],
    phases: [
      {
        name: "OPTIONAL MOBILITY",
        directive: "Only if stiff. Gentle range, easy breathing, zero intensity.",
        items: [
          { ex: "Knee_Circles", scheme: "2 × 10 EACH WAY", optional: true },
          { ex: "Wrist_Circles", scheme: "2 × 10 EACH WAY", optional: true },
          { ex: "Standing_Hip_Circles", scheme: "2 × 10 EACH WAY", optional: true },
          { ex: "Toe_Touchers", scheme: "2 × 30s", optional: true },
          { ex: "Stomach_Vacuum", scheme: "3 × 15s", optional: true },
        ],
      },
    ],
  },
];
