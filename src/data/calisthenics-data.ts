// AUTOMATICALLY GENERATED CALISTHENICS DATABASE
export type MuscleId = 
  | "chest"
  | "deltoids"
  | "triceps"
  | "biceps"
  | "forearms"
  | "abs"
  | "obliques"
  | "lats"
  | "traps"
  | "lower_back"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves"
  | "neck";

export type Tier = "beginner" | "advanced" | "pro" | "military" | "brutal";

export type MuscleInfo = {
  id: MuscleId;
  name: string;
  latinName: string;
  region: "upper_push" | "upper_pull" | "core" | "lower" | "posture";
  description: string;
  calisthenicsFunction: string;
  center3D: [number, number, number];
  isPosterior?: boolean;
};

export type BlueprintCue = {
  label: string;
  x: number;
  y: number;
  angle?: string;
};

export type ExerciseBlueprint = {
  figureType:
    | "pushup"
    | "dip"
    | "pullup"
    | "squat"
    | "lunge"
    | "plank"
    | "leg_raise"
    | "handstand"
    | "muscle_up"
    | "planche"
    | "bridge"
    | "calf_raise"
    | "stretch_upper"
    | "stretch_lower"
    | "stretch_core";
  startAngle: string;
  endAngle: string;
  motionVector: string;
  focalJoints: string[];
  tacticalCues: BlueprintCue[];
};

export type CalisthenicsExercise = {
  id: string;
  name: string;
  tier: Tier;
  primaryMuscle: MuscleId;
  secondaryMuscles: MuscleId[];
  equipment: "FLOOR" | "PULL-UP BAR" | "WALL" | "PARALLEL BARS / CHAIRS" | "ELEVATED SURFACE";
  prescription: string;
  tempo: string;
  tacticalCue: string;
  instructions: string[];
  mistakes: string[];
  blueprint: ExerciseBlueprint;
};

export type StretchItem = {
  id: string;
  name: string;
  type: "dynamic" | "static";
  primaryMuscle: MuscleId;
  targetArea: string;
  duration: string;
  protocol: string;
  instructions: string[];
  keySafetyCheck: string;
  blueprintType: "stretch_upper" | "stretch_lower" | "stretch_core";
};

export type FullBodyRoutine = {
  id: string;
  name: string;
  tier: Tier;
  tagline: string;
  totalTime: string;
  rounds: string;
  exerciseIds: string[];
  description: string;
};

export const MUSCLE_REGISTRY: Record<MuscleId, MuscleInfo> = {
  "chest": {
    "id": "chest",
    "name": "CHEST",
    "latinName": "Pectoralis Major & Minor",
    "region": "upper_push",
    "description": "Primary driver of horizontal pushing, bar/ring dips, and upper body compression.",
    "calisthenicsFunction": "Generates explosive floor drive, deep dip lockouts, and hollow-body stabilization.",
    "center3D": [
      0,
      1.45,
      0.28
    ]
  },
  "deltoids": {
    "id": "deltoids",
    "name": "SHOULDERS",
    "latinName": "Deltoideus (Anterior, Lateral, Posterior)",
    "region": "upper_push",
    "description": "Shoulder cap muscle complex controlling vertical pushing, planches, and inversions.",
    "calisthenicsFunction": "Essential for handstand pushups, pike presses, planche leans, and maltese maneuvers.",
    "center3D": [
      0.38,
      1.55,
      0.08
    ]
  },
  "triceps": {
    "id": "triceps",
    "name": "TRICEPS",
    "latinName": "Triceps Brachii",
    "region": "upper_push",
    "description": "Three-headed posterior arm muscle dominating all elbow extension and lockout force.",
    "calisthenicsFunction": "Delivers pushup lockouts, parallel bar dips, tiger bends, and handstand presses.",
    "center3D": [
      0.44,
      1.35,
      -0.1
    ],
    "isPosterior": true
  },
  "biceps": {
    "id": "biceps",
    "name": "BICEPS",
    "latinName": "Biceps Brachii & Brachialis",
    "region": "upper_pull",
    "description": "Anterior upper arm pulling engine that flexes the elbow and supinates the forearm.",
    "calisthenicsFunction": "Powers supinated chin-ups, front lever tuck transitions, and straight-arm ring work.",
    "center3D": [
      0.42,
      1.32,
      0.12
    ]
  },
  "forearms": {
    "id": "forearms",
    "name": "FOREARMS & GRIP",
    "latinName": "Brachioradialis, Flexor & Extensor Carpi",
    "region": "upper_pull",
    "description": "Grip anchor securing fingers and wrists to bars, rings, and floor surfaces.",
    "calisthenicsFunction": "Crucial for bar hangs, false grip muscle-ups, fingertip pushups, and wrist resilience.",
    "center3D": [
      0.52,
      1.05,
      0.06
    ]
  },
  "abs": {
    "id": "abs",
    "name": "ABDOMINALS",
    "latinName": "Rectus Abdominis & Transversus Abdominis",
    "region": "core",
    "description": "Anterior core armor protecting internal organs and resisting spinal hyperextension.",
    "calisthenicsFunction": "Maintains the hollow-body foundation for pushups, leg raises, dragon flags, and levers.",
    "center3D": [
      0,
      1.05,
      0.2
    ]
  },
  "obliques": {
    "id": "obliques",
    "name": "OBLIQUES",
    "latinName": "Obliquus Externus & Internus Abdominis",
    "region": "core",
    "description": "Rotational and lateral core stabilizers running along the ribcage down to pelvis.",
    "calisthenicsFunction": "Resists rotational torque, stabilizes human flag, and drives windshield wipers.",
    "center3D": [
      0.28,
      1.02,
      0.16
    ]
  },
  "lats": {
    "id": "lats",
    "name": "LATS (BACK WINGS)",
    "latinName": "Latissimus Dorsi",
    "region": "upper_pull",
    "description": "Broad fan muscle spanning mid/lower back to upper humerus for vertical/horizontal pulling.",
    "calisthenicsFunction": "Drives strict pull-ups, front levers, bar muscle-ups, and depressed scapula lockouts.",
    "center3D": [
      0,
      1.35,
      -0.28
    ],
    "isPosterior": true
  },
  "traps": {
    "id": "traps",
    "name": "UPPER BACK & TRAPS",
    "latinName": "Trapezius & Rhomboidei",
    "region": "upper_pull",
    "description": "Diamond-shaped posterior armor anchoring the neck, clavicles, and scapular motion.",
    "calisthenicsFunction": "Controls scapular retraction, elevation in handstands, and neck stabilization.",
    "center3D": [
      0,
      1.68,
      -0.2
    ],
    "isPosterior": true
  },
  "lower_back": {
    "id": "lower_back",
    "name": "LOWER BACK",
    "latinName": "Erector Spinae & Thoracolumbar",
    "region": "core",
    "description": "Spinal column pillars keeping the vertebral stack rigid under extreme leverage.",
    "calisthenicsFunction": "Maintains rigid back levers, bridging mechanics, superman holds, and posterior chain endurance.",
    "center3D": [
      0,
      0.95,
      -0.22
    ],
    "isPosterior": true
  },
  "glutes": {
    "id": "glutes",
    "name": "GLUTES",
    "latinName": "Gluteus Maximus & Medius",
    "region": "lower",
    "description": "Largest power engine in the human body driving hip extension and pelvis stabilization.",
    "calisthenicsFunction": "Generates explosive jump squat propulsion, single-leg stabilization in pistols, and hollow lock.",
    "center3D": [
      0,
      0.72,
      -0.24
    ],
    "isPosterior": true
  },
  "quads": {
    "id": "quads",
    "name": "QUADRICEPS",
    "latinName": "Rectus Femoris, Vastus Lateralis/Medialis",
    "region": "lower",
    "description": "Four anterior thigh power heads driving knee extension and decelerating impacts.",
    "calisthenicsFunction": "Drives deep bodyweight squats, pistol squats, sissy squats, and sprint mechanics.",
    "center3D": [
      0.18,
      0.25,
      0.18
    ]
  },
  "hamstrings": {
    "id": "hamstrings",
    "name": "HAMSTRINGS",
    "latinName": "Biceps Femoris & Semitendinosus",
    "region": "lower",
    "description": "Posterior thigh chain governing knee flexion, hip hinging, and explosive leg pull.",
    "calisthenicsFunction": "Decelerates sprinting, powers Nordic hamstring curls, single-leg deadlifts, and hip bridges.",
    "center3D": [
      0.18,
      0.2,
      -0.18
    ],
    "isPosterior": true
  },
  "calves": {
    "id": "calves",
    "name": "CALVES",
    "latinName": "Gastrocnemius & Soleus",
    "region": "lower",
    "description": "Achilles tendon motor driving ankle plantarflexion, shock absorption, and bounce.",
    "calisthenicsFunction": "Ground reaction force, explosive jumping, toe drive, and shin splint defense.",
    "center3D": [
      0.16,
      -0.45,
      -0.14
    ],
    "isPosterior": true
  },
  "neck": {
    "id": "neck",
    "name": "NECK & CERVICAL",
    "latinName": "Sternocleidomastoideus & Splenius",
    "region": "posture",
    "description": "Cervical spine support resisting concussive forces and stabilizing head orientation.",
    "calisthenicsFunction": "Protects cervical spine during inverted handstands, rolls, and military tactical load carriage.",
    "center3D": [
      0,
      1.88,
      0.04
    ]
  }
};

export const CALISTHENICS_EXERCISES: CalisthenicsExercise[] = [
  {
    "id": "chest-incline-pushup",
    "name": "INCLINE ELEVATED PUSH-UP",
    "tier": "beginner",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "triceps",
      "deltoids",
      "abs"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "3 \u00d7 12\u201315 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "MAINTAIN STRAIGHT LINE FROM HEELS TO CROWN \u00b7 ELBOWS AT 45\u00b0",
    "instructions": [
      "Place hands shoulder-width apart on a sturdy elevated ledge, bench, or wall.",
      "Step feet back until torso and legs form a rigid hollow-body alignment.",
      "Inhale and lower sternum with control until it lightly touches the edge.",
      "Exhale and press through palms to lock out arms without flaring elbows."
    ],
    "mistakes": [
      "Sagging hips down",
      "Flaring elbows to 90 degrees",
      "Cutting range of motion short"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Straight arm plank",
      "endAngle": "Chest touches ledge",
      "motionVector": "Incline Horizontal Press",
      "focalJoints": [
        "Pectorals",
        "Triceps Long Head",
        "Scapular Protraction"
      ],
      "tacticalCues": [
        {
          "label": "Ledge hand plant",
          "x": 75,
          "y": 45
        },
        {
          "label": "Rigid spine line",
          "x": 45,
          "y": 55
        }
      ]
    }
  },
  {
    "id": "chest-knee-pushup",
    "name": "KNEE PIVOT PUSH-UP",
    "tier": "beginner",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "triceps",
      "deltoids"
    ],
    "equipment": "FLOOR",
    "prescription": "3 \u00d7 10\u201312 REPS",
    "tempo": "2-0-1-0",
    "tacticalCue": "PIVOT FROM KNEES \u00b7 KEEP GLUTES SQUEEZED AND CORE TIGHT",
    "instructions": [
      "Start in a quadruped position on a mat, hands under shoulders.",
      "Walk knees back until torso and thighs form a straight line.",
      "Lower chest to floor while tucking elbows at 45 degrees.",
      "Press through chest and palms back to top extension."
    ],
    "mistakes": [
      "Piking hips back over knees",
      "Craning neck toward floor"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Kneeling plank",
      "endAngle": "Chest to floor",
      "motionVector": "Reduced-Leverage Press",
      "focalJoints": [
        "Pectoralis Major",
        "Anterior Deltoid"
      ],
      "tacticalCues": [
        {
          "label": "Knee contact point",
          "x": 20,
          "y": 70
        },
        {
          "label": "Chest grazing floor",
          "x": 65,
          "y": 60
        }
      ]
    }
  },
  {
    "id": "lats-dead-hang",
    "name": "ACTIVE SCAPULAR DEAD HANG",
    "tier": "beginner",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "forearms",
      "traps"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 30\u201345s HOLD",
    "tempo": "ISOMETRIC",
    "tacticalCue": "DEPRESS SCAPULA DOWN AWAY FROM EARS \u00b7 WRAP THUMBS AROUND BAR",
    "instructions": [
      "Grip overhead pull-up bar with overhand grip shoulder-width apart.",
      "Suspend entire bodyweight with feet clear of the deck.",
      "Pull shoulders down away from your ears to engage the lats into an active hang.",
      "Breathe through diaphragm while maintaining a rigid core."
    ],
    "mistakes": [
      "Relaxing shoulders into ears completely",
      "Swinging legs"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Overhead hang",
      "endAngle": "Active scapula pull",
      "motionVector": "Isometric Vertical Traction",
      "focalJoints": [
        "Latissimus Dorsi",
        "Finger Flexors",
        "Lower Trapezius"
      ],
      "tacticalCues": [
        {
          "label": "Bar overhand hook",
          "x": 50,
          "y": 15
        },
        {
          "label": "Scapular depression",
          "x": 50,
          "y": 30
        }
      ]
    }
  },
  {
    "id": "lats-australian-pullup",
    "name": "AUSTRALIAN INCLINE BODY ROW",
    "tier": "beginner",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "biceps",
      "traps",
      "abs"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "3 \u00d7 10\u201312 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "CHEST TO BAR \u00b7 SQUEEZE SHOULDER BLADES TOGETHER AT APEX",
    "instructions": [
      "Position yourself beneath a waist-height bar or sturdy horizontal rail.",
      "Grip bar with overhand grip wider than shoulders, heels planted on ground.",
      "Keep body in a rigid straight line from heels to head.",
      "Pull chest to touch the bar by driving elbows backward."
    ],
    "mistakes": [
      "Sagging hips",
      "Using momentum or hip thrusts"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "45\u00b0 Hang",
      "endAngle": "Chest to bar",
      "motionVector": "Horizontal Pull",
      "focalJoints": [
        "Latissimus Dorsi",
        "Rhomboids",
        "Biceps Brachii"
      ],
      "tacticalCues": [
        {
          "label": "Bar contact point",
          "x": 55,
          "y": 45
        },
        {
          "label": "Straight heel drive",
          "x": 20,
          "y": 75
        }
      ]
    }
  },
  {
    "id": "quads-air-squat",
    "name": "TACTICAL AIR SQUAT",
    "tier": "beginner",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "hamstrings",
      "calves"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 15\u201320 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "FEET SHOULDER WIDTH \u00b7 HIP CREASE BELOW KNEES \u00b7 CHEST UPRIGHT",
    "instructions": [
      "Stand with feet shoulder-width apart, toes turned slightly out.",
      "Hinge hips back and bend knees, tracking knees outward over toes.",
      "Descend smoothly until hip crease breaks below parallel to the knee joint.",
      "Drive through mid-foot and heel to return to tall standing position."
    ],
    "mistakes": [
      "Knees caving inward (valgus)",
      "Heels lifting off ground",
      "Rounding lower back"
    ],
    "blueprint": {
      "figureType": "squat",
      "startAngle": "Tall Standing",
      "endAngle": "Hip Below Knee Joint",
      "motionVector": "Bilateral Knee Extension",
      "focalJoints": [
        "Quadriceps Femoris",
        "Gluteus Maximus",
        "Patellar Tendon"
      ],
      "tacticalCues": [
        {
          "label": "Parallel depth line",
          "x": 50,
          "y": 68
        },
        {
          "label": "Flat foot contact",
          "x": 50,
          "y": 90
        }
      ]
    }
  },
  {
    "id": "quads-step-up",
    "name": "ELEVATED BOX / CURB STEP-UP",
    "tier": "beginner",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "calves"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "3 \u00d7 12 REPS / LEG",
    "tempo": "2-0-1-0",
    "tacticalCue": "DRIVE ENTIRELY THROUGH FRONT FOOT \u00b7 ZERO PUSH OFF REAR FOOT",
    "instructions": [
      "Stand facing a knee-height bench or sturdy elevated curb.",
      "Place one entire foot firmly on top of the surface.",
      "Drive down through the heel and midfoot to ascend to full standing.",
      "Lower yourself under control back down with a 2-second negative."
    ],
    "mistakes": [
      "Kicking off the bottom foot",
      "Knee caving inward"
    ],
    "blueprint": {
      "figureType": "lunge",
      "startAngle": "Floor stance",
      "endAngle": "Top single leg extension",
      "motionVector": "Unilateral Knee Drive",
      "focalJoints": [
        "Quadriceps",
        "Gluteus Medius"
      ],
      "tacticalCues": [
        {
          "label": "Flat platform plant",
          "x": 60,
          "y": 55
        },
        {
          "label": "Vertical torso",
          "x": 50,
          "y": 30
        }
      ]
    }
  },
  {
    "id": "hamstrings-glute-bridge",
    "name": "FLOOR GLUTE BRIDGE",
    "tier": "beginner",
    "primaryMuscle": "glutes",
    "secondaryMuscles": [
      "hamstrings",
      "lower_back"
    ],
    "equipment": "FLOOR",
    "prescription": "3 \u00d7 15 REPS",
    "tempo": "2-2-1-0",
    "tacticalCue": "DRIVE HEELS INTO FLOOR \u00b7 SQUEEZE GLUTES HARD AT TOP EXTENSION",
    "instructions": [
      "Lie supine on floor with knees bent and feet flat on deck hip-width apart.",
      "Drive through heels and lift pelvis toward ceiling until hips form straight line with knees and shoulders.",
      "Hold peak contraction for 2 seconds with maximum glute squeeze.",
      "Slowly lower hips back to deck without letting tension vanish."
    ],
    "mistakes": [
      "Hyperextending lumbar spine",
      "Pushing through toes instead of heels"
    ],
    "blueprint": {
      "figureType": "bridge",
      "startAngle": "Supine bent knees",
      "endAngle": "Straight hip line",
      "motionVector": "Posterior Chain Extension",
      "focalJoints": [
        "Gluteus Maximus",
        "Biceps Femoris"
      ],
      "tacticalCues": [
        {
          "label": "Heel drive point",
          "x": 65,
          "y": 80
        },
        {
          "label": "Full hip lockout",
          "x": 50,
          "y": 50
        }
      ]
    }
  },
  {
    "id": "abs-plank-hold",
    "name": "TACTICAL PRONE PLANK",
    "tier": "beginner",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "obliques",
      "deltoids",
      "glutes"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 45\u201360s HOLD",
    "tempo": "ISOMETRIC",
    "tacticalCue": "POSTERIOR PELVIC TILT \u00b7 SQUEEZE QUADS AND GLUTES \u00b7 DRAW BELLY TO SPINE",
    "instructions": [
      "Place forearms on deck shoulder-width apart, elbows directly under shoulders.",
      "Step feet back hip-width apart, resting on the balls of your feet.",
      "Tuck pelvis under (posterior tilt) and contract abdominals as if bracing for a strike.",
      "Hold rigid iron alignment without letting hips sag or pike."
    ],
    "mistakes": [
      "Sagging lower back",
      "Piking hips up in an A-frame",
      "Holding breath"
    ],
    "blueprint": {
      "figureType": "plank",
      "startAngle": "Horizontal Prone Alignment",
      "endAngle": "Isometric Core Compression",
      "motionVector": "Anti-Extension Stabilization",
      "focalJoints": [
        "Rectus Abdominis",
        "Transversus Abdominis",
        "Serratus Anterior"
      ],
      "tacticalCues": [
        {
          "label": "Elbow vertical line",
          "x": 75,
          "y": 70
        },
        {
          "label": "Neutral spine line",
          "x": 45,
          "y": 60
        }
      ]
    }
  },
  {
    "id": "abs-deadbug",
    "name": "CONTRALATERAL DEADBUG",
    "tier": "beginner",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "obliques",
      "lower_back"
    ],
    "equipment": "FLOOR",
    "prescription": "3 \u00d7 12 REPS / SIDE",
    "tempo": "2-1-2-0",
    "tacticalCue": "LOWER BACK PRESSED FLAT INTO DECK \u00b7 ZERO GAP UNDER LUMBAR",
    "instructions": [
      "Lie on back with arms extended toward ceiling and knees bent at 90 degrees directly above hips.",
      "Press lumbar spine firmly into floor, eliminating all space under back.",
      "Slowly lower right arm back and left leg forward simultaneously until just hovering above deck.",
      "Return to starting center and repeat with opposite limbs."
    ],
    "mistakes": [
      "Lower back arching off floor",
      "Moving limbs too fast"
    ],
    "blueprint": {
      "figureType": "leg_raise",
      "startAngle": "90\u00b0 limbs upright",
      "endAngle": "Contralateral hover",
      "motionVector": "Anti-Extension Coordination",
      "focalJoints": [
        "Deep Core",
        "Hip Flexors"
      ],
      "tacticalCues": [
        {
          "label": "Flat lumbar seal",
          "x": 50,
          "y": 55
        },
        {
          "label": "Hovering limb control",
          "x": 30,
          "y": 45
        }
      ]
    }
  },
  {
    "id": "triceps-bench-dip",
    "name": "BENCH / CHAIR SUPPORT DIP",
    "tier": "beginner",
    "primaryMuscle": "triceps",
    "secondaryMuscles": [
      "chest",
      "deltoids"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "3 \u00d7 10\u201312 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "KEEP BACK CLOSE TO BENCH \u00b7 ELBOWS TRACK STRAIGHT BACK",
    "instructions": [
      "Sit on edge of a sturdy bench or chair, hands gripping edge beside hips.",
      "Slide hips forward off the edge, feet flat with knees at 90 degrees.",
      "Bend elbows straight back until upper arms are parallel to floor (90\u00b0 bend).",
      "Press through palms to lockout triceps at top."
    ],
    "mistakes": [
      "Moving hips far away from bench (strains shoulders)",
      "Shrugging shoulders into ears"
    ],
    "blueprint": {
      "figureType": "dip",
      "startAngle": "Support lockout",
      "endAngle": "90\u00b0 elbow flexion",
      "motionVector": "Vertical Arm Extension",
      "focalJoints": [
        "Triceps Brachii",
        "Anterior Deltoid"
      ],
      "tacticalCues": [
        {
          "label": "Ledge hand support",
          "x": 60,
          "y": 45
        },
        {
          "label": "Close hip clearance",
          "x": 55,
          "y": 60
        }
      ]
    }
  },
  {
    "id": "delts-pike-pushup-floor",
    "name": "KNEE PIKE SHOULDER PRESS",
    "tier": "beginner",
    "primaryMuscle": "deltoids",
    "secondaryMuscles": [
      "triceps",
      "traps"
    ],
    "equipment": "FLOOR",
    "prescription": "3 \u00d7 8\u201310 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "LOOK BACK AT TOES \u00b7 LOWER CROWN OF HEAD FORWARD TO FORM TRIPOD",
    "instructions": [
      "Start in a downward dog pike position with hips high in the air.",
      "Keep hands shoulder-width apart, looking back between feet.",
      "Inhale and lower top of head forward ahead of hands to create a tripod base.",
      "Press back up through shoulders until head returns between arms."
    ],
    "mistakes": [
      "Dropping head straight between hands instead of forward",
      "Flaring elbows 90 degrees outward"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "High pike triangle",
      "endAngle": "Crown touches deck",
      "motionVector": "Inverted Deltoid Press",
      "focalJoints": [
        "Anterior Deltoid",
        "Upper Trapezius",
        "Triceps"
      ],
      "tacticalCues": [
        {
          "label": "Tripod head point",
          "x": 70,
          "y": 75
        },
        {
          "label": "High hip peak",
          "x": 45,
          "y": 35
        }
      ]
    }
  },
  {
    "id": "calves-double-leg-raise",
    "name": "GROUND CALF STAIR EXTENSION",
    "tier": "beginner",
    "primaryMuscle": "calves",
    "secondaryMuscles": [
      "forearms"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "4 \u00d7 20\u201325 REPS",
    "tempo": "2-2-1-0",
    "tacticalCue": "PAUSE AT BOTTOM STRETCH \u00b7 EXPLODE ONTO BIG TOES AT APEX",
    "instructions": [
      "Stand with balls of feet on edge of a step, heels hanging off edge.",
      "Lower heels down into a deep, full calf stretch for 2 seconds.",
      "Explosively press through the balls of both feet into peak plantarflexion.",
      "Hold peak contraction for 2 seconds before descending."
    ],
    "mistakes": [
      "Bouncing rapidly through reps",
      "Rolling ankles outward"
    ],
    "blueprint": {
      "figureType": "calf_raise",
      "startAngle": "Heel deficit drop",
      "endAngle": "Max toe plantarflexion",
      "motionVector": "Ankle Plantarflexion",
      "focalJoints": [
        "Gastrocnemius",
        "Soleus",
        "Achilles Tendon"
      ],
      "tacticalCues": [
        {
          "label": "Ball of foot pivot",
          "x": 50,
          "y": 75
        },
        {
          "label": "Full peak contraction",
          "x": 50,
          "y": 45
        }
      ]
    }
  },
  {
    "id": "core-mountain-climbers",
    "name": "TACTICAL PACING MOUNTAIN CLIMBERS",
    "tier": "beginner",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "deltoids",
      "quads",
      "obliques"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 30s PACED",
    "tempo": "CONTINUOUS",
    "tacticalCue": "STABLE CORE \u00b7 DRIVE KNEES TOWARD CHEST WITHOUT BOUNCING HIPS",
    "instructions": [
      "Assume a strict high plank position, hands directly under shoulders.",
      "Drive one knee toward chest, keeping hips low and level.",
      "Step back and drive alternate knee forward in a rhythmic, continuous stride.",
      "Maintain active shoulder push and tight abdominal brace."
    ],
    "mistakes": [
      "Bouncing hips up and down",
      "Touching front foot down under chest"
    ],
    "blueprint": {
      "figureType": "plank",
      "startAngle": "High plank",
      "endAngle": "Alternating knee drive",
      "motionVector": "Dynamic Hip Flexor Cadence",
      "focalJoints": [
        "Core",
        "Anterior Shoulders",
        "Hip Flexors"
      ],
      "tacticalCues": [
        {
          "label": "Level hips plane",
          "x": 50,
          "y": 50
        },
        {
          "label": "Driving knee clearance",
          "x": 60,
          "y": 65
        }
      ]
    }
  },
  {
    "id": "chest-standard-pushup",
    "name": "STRICT MILITARY FLOOR PUSH-UP",
    "tier": "advanced",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "triceps",
      "deltoids",
      "abs"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 15\u201320 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "CHEST TO DECK \u00b7 HOLLOW BODY ALIGNMENT \u00b7 ELBOWS AT 45\u00b0",
    "instructions": [
      "Assume high plank with hands slightly wider than shoulders, fingers spread.",
      "Lock glutes and quads, pulling belly button into spine.",
      "Lower under control until chest grazes the floor.",
      "Drive straight up into full extension with scapular protraction."
    ],
    "mistakes": [
      "Flaring elbows 90 degrees",
      "Hips sagging to touch deck first"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "180\u00b0 Straight Plank",
      "endAngle": "Chest Grazes Deck",
      "motionVector": "Standard Horizontal Press",
      "focalJoints": [
        "Pectoralis Major",
        "Triceps",
        "Anterior Deltoid"
      ],
      "tacticalCues": [
        {
          "label": "Deck contact",
          "x": 75,
          "y": 80
        },
        {
          "label": "Hollow body line",
          "x": 45,
          "y": 55
        }
      ]
    }
  },
  {
    "id": "chest-diamond-pushup",
    "name": "DIAMOND TRICEPS PUSH-UP",
    "tier": "advanced",
    "primaryMuscle": "triceps",
    "secondaryMuscles": [
      "chest",
      "deltoids"
    ],
    "equipment": "FLOOR",
    "prescription": "3 \u00d7 12\u201315 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "INDEX FINGERS & THUMBS TOUCHING \u00b7 LOWER STERNUM TO DIAMOND",
    "instructions": [
      "Form a diamond/triangle with index fingers and thumbs under center of chest.",
      "Step feet back into rigid plank with feet together.",
      "Lower chest until sternum touches the back of your thumbs.",
      "Press forcefully through the triceps back to full arm lockout."
    ],
    "mistakes": [
      "Elbows flaring excessively",
      "Breaking core line"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Narrow Hand Plank",
      "endAngle": "Sternum to Diamond",
      "motionVector": "Close-Grip Triceps Press",
      "focalJoints": [
        "Triceps Lateral & Medial Head",
        "Inner Pectorals"
      ],
      "tacticalCues": [
        {
          "label": "Diamond hand aperture",
          "x": 72,
          "y": 82
        },
        {
          "label": "Locked core line",
          "x": 45,
          "y": 55
        }
      ]
    }
  },
  {
    "id": "chest-decline-pushup",
    "name": "FEET-ELEVATED DECLINE PUSH-UP",
    "tier": "advanced",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "deltoids",
      "triceps",
      "abs"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "3 \u00d7 12\u201315 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "FEET ON BENCH \u00b7 SHIFT LOAD ONTO CLAVICULAR UPPER CHEST",
    "instructions": [
      "Place toes on a sturdy elevated box or bench, hands flat on floor.",
      "Brace core and lower upper chest toward the deck.",
      "Pause for 1 second at bottom, then press back to lockout."
    ],
    "mistakes": [
      "Lumbar spine sagging into hyper-extension"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Decline body angle",
      "endAngle": "Upper chest to floor",
      "motionVector": "Decline Press",
      "focalJoints": [
        "Clavicular Pectoral",
        "Anterior Deltoid"
      ],
      "tacticalCues": [
        {
          "label": "Elevated toe anchor",
          "x": 20,
          "y": 35
        },
        {
          "label": "Floor press point",
          "x": 75,
          "y": 80
        }
      ]
    }
  },
  {
    "id": "lats-strict-pullup",
    "name": "STRICT TACTICAL PULL-UP",
    "tier": "advanced",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "biceps",
      "traps",
      "forearms",
      "abs"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 8\u201310 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "DEAD HANG TO CHIN OVER BAR \u00b7 ZERO KICK \u00b7 ZERO KIPPING",
    "instructions": [
      "Hang from pull-up bar with overhand grip slightly wider than shoulder width.",
      "Start from an active dead hang with elbows locked.",
      "Drive elbows down and back, pulling until chin cleanly clears top of bar.",
      "Lower under control back to full dead hang extension."
    ],
    "mistakes": [
      "Kicking legs or kipping",
      "Dropping without eccentric control"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Full Dead Hang",
      "endAngle": "Chin Clears Top of Bar",
      "motionVector": "Strict Vertical Pull",
      "focalJoints": [
        "Latissimus Dorsi",
        "Biceps Brachii",
        "Lower/Mid Trapezius"
      ],
      "tacticalCues": [
        {
          "label": "Bar grip point",
          "x": 50,
          "y": 15
        },
        {
          "label": "Chin clearance line",
          "x": 50,
          "y": 28
        }
      ]
    }
  },
  {
    "id": "lats-chinup",
    "name": "SUPINATED CHIN-UP",
    "tier": "advanced",
    "primaryMuscle": "biceps",
    "secondaryMuscles": [
      "lats",
      "traps",
      "forearms"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "3 \u00d7 8\u201310 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "UNDERHAND GRIP \u00b7 MAXIMAL BICEPS AND LOWER LAT ENGAGEMENT",
    "instructions": [
      "Grip bar with palms facing you (supinated) at shoulder width.",
      "Pull up smoothly until chin clears the bar, squeezing biceps at top.",
      "Lower back down to full elbow extension under control."
    ],
    "mistakes": [
      "Half reps not reaching full extension",
      "Excessive swing"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Supinated hang",
      "endAngle": "Chin over bar",
      "motionVector": "Supinated Vertical Pull",
      "focalJoints": [
        "Biceps Brachii",
        "Brachialis",
        "Lats"
      ],
      "tacticalCues": [
        {
          "label": "Underhand grip",
          "x": 50,
          "y": 15
        },
        {
          "label": "Bicep peak contraction",
          "x": 45,
          "y": 30
        }
      ]
    }
  },
  {
    "id": "triceps-parallel-dip",
    "name": "STRICT PARALLEL BAR DIP",
    "tier": "advanced",
    "primaryMuscle": "triceps",
    "secondaryMuscles": [
      "chest",
      "deltoids"
    ],
    "equipment": "PARALLEL BARS / CHAIRS",
    "prescription": "4 \u00d7 8\u201312 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "LOWER UNTIL SHOULDERS BREAK 90\u00b0 ELBOW BEND \u00b7 SLIGHT FORWARD LEAN",
    "instructions": [
      "Jump to support position on parallel bars with arms locked and shoulders depressed.",
      "Inhale, lean torso slightly forward (15-20\u00b0), and bend elbows.",
      "Lower until elbows reach at least a 90-degree angle.",
      "Drive forcefully through palms back to locked support."
    ],
    "mistakes": [
      "Shrugging shoulders up to ears",
      "Cutting depth short of 90 degrees"
    ],
    "blueprint": {
      "figureType": "dip",
      "startAngle": "Full Arm Support Lockout",
      "endAngle": "90\u00b0 Elbow Flexion",
      "motionVector": "Vertical Bodyweight Dip",
      "focalJoints": [
        "Triceps Long/Lateral Head",
        "Lower Pectorals",
        "Anterior Deltoid"
      ],
      "tacticalCues": [
        {
          "label": "Parallel bar grip",
          "x": 50,
          "y": 45
        },
        {
          "label": "90\u00b0 elbow depth",
          "x": 60,
          "y": 55
        }
      ]
    }
  },
  {
    "id": "quads-bulgarian-split-squat",
    "name": "BULGARIAN SPLIT SQUAT",
    "tier": "advanced",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "3 \u00d7 10 REPS / LEG",
    "tempo": "3-1-1-0",
    "tacticalCue": "REAR FOOT ELEVATED \u00b7 FRONT KNEE STAYS TRACKED OVER SECOND TOE",
    "instructions": [
      "Stand 2-3 feet in front of a bench, place top of rear foot on bench.",
      "Lower hips straight down until front thigh is parallel to deck.",
      "Pause for 1 second, then drive through front mid-foot and heel to return."
    ],
    "mistakes": [
      "Front heel lifting",
      "Torso collapsing forward"
    ],
    "blueprint": {
      "figureType": "lunge",
      "startAngle": "Split stance elevated",
      "endAngle": "Front thigh parallel",
      "motionVector": "Unilateral Quad Load",
      "focalJoints": [
        "Quadriceps",
        "Gluteus Maximus",
        "Adductors"
      ],
      "tacticalCues": [
        {
          "label": "Rear foot perch",
          "x": 20,
          "y": 50
        },
        {
          "label": "Front knee 90\u00b0",
          "x": 65,
          "y": 70
        }
      ]
    }
  },
  {
    "id": "quads-cossack-squat",
    "name": "LATERAL COSSACK SQUAT",
    "tier": "advanced",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipment": "FLOOR",
    "prescription": "3 \u00d7 8 REPS / SIDE",
    "tempo": "2-1-1-0",
    "tacticalCue": "WIDE STANCE \u00b7 SINK INTO ONE HIP \u00b7 STRAIGHT LEG HEEL DIGS IN",
    "instructions": [
      "Take a very wide stance, double shoulder-width apart.",
      "Shift weight to one side, squatting deep on that leg while keeping heel flat.",
      "The opposite leg remains completely straight with toes pointing toward ceiling.",
      "Press through working heel to rise and transition to opposite side."
    ],
    "mistakes": [
      "Working heel lifting off deck",
      "Rounding lower back excessively"
    ],
    "blueprint": {
      "figureType": "squat",
      "startAngle": "Wide frontal stance",
      "endAngle": "Deep single leg hinge",
      "motionVector": "Frontal Plane Unilateral Squat",
      "focalJoints": [
        "Vastus Medialis",
        "Adductor Magnus",
        "Hip Mobility"
      ],
      "tacticalCues": [
        {
          "label": "Flat working heel",
          "x": 65,
          "y": 85
        },
        {
          "label": "Elevated toe point",
          "x": 30,
          "y": 80
        }
      ]
    }
  },
  {
    "id": "quads-jump-squat",
    "name": "EXPLOSIVE VERTICAL JUMP SQUAT",
    "tier": "advanced",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "calves"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 10 REPS",
    "tempo": "EXPLOSIVE",
    "tacticalCue": "SINK TO PARALLEL \u00b7 EXPLODE VERTICAL \u00b7 LAND SOFT LIKE A GHOST",
    "instructions": [
      "Descend into a full parallel air squat.",
      "Immediately reverse and explode vertically toward ceiling with full triple extension.",
      "Land softly on balls of feet, rolling to heels and smoothly absorbing into next squat."
    ],
    "mistakes": [
      "Stiff-legged heavy landing",
      "Incomplete squat depth before jump"
    ],
    "blueprint": {
      "figureType": "squat",
      "startAngle": "Parallel squat load",
      "endAngle": "Airborne triple extension",
      "motionVector": "Ballistic Vertical Jump",
      "focalJoints": [
        "Quadriceps",
        "Gastrocnemius",
        "Glutes"
      ],
      "tacticalCues": [
        {
          "label": "Spring load depth",
          "x": 50,
          "y": 70
        },
        {
          "label": "Soft deceleration",
          "x": 50,
          "y": 88
        }
      ]
    }
  },
  {
    "id": "abs-hanging-knee-raise",
    "name": "HANGING RIG KNEE RAISE",
    "tier": "advanced",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "obliques",
      "forearms"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "3 \u00d7 12\u201315 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "PULL KNEES TO CHEST \u00b7 ROTATE PELVIS UPWARD \u00b7 ZERO SWING",
    "instructions": [
      "Hang from bar with active shoulders and hollow body tension.",
      "Exhale and drive knees up toward chest, curling pelvis toward ribs.",
      "Pause for 1 second at top with abs fully compressed.",
      "Lower legs slowly back to vertical without swinging."
    ],
    "mistakes": [
      "Using momentum to swing legs up",
      "Not curling pelvis"
    ],
    "blueprint": {
      "figureType": "leg_raise",
      "startAngle": "Dead hang vertical",
      "endAngle": "Knees to chest compression",
      "motionVector": "Anterior Pelvic Compression",
      "focalJoints": [
        "Rectus Abdominis",
        "Hip Flexors"
      ],
      "tacticalCues": [
        {
          "label": "Bar overhand hook",
          "x": 50,
          "y": 15
        },
        {
          "label": "Knee chest curl",
          "x": 50,
          "y": 55
        }
      ]
    }
  },
  {
    "id": "abs-hollow-body-hold",
    "name": "GYMNASTIC HOLLOW BODY HOLD",
    "tier": "advanced",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "obliques",
      "quads",
      "deltoids"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 30\u201345s HOLD",
    "tempo": "ISOMETRIC",
    "tacticalCue": "LUMBAR CRUSHED INTO DECK \u00b7 ARMS EXTENDED OVERHEAD \u00b7 TOES POINTED",
    "instructions": [
      "Lie on back with legs straight and arms reaching straight overhead past ears.",
      "Push lower back completely into floor, lifting shoulder blades and legs 6 inches off deck.",
      "Hold the shallow curved banana/hollow position with iron abdominal tension.",
      "Point toes and squeeze inner thighs together."
    ],
    "mistakes": [
      "Lumbar spine arching off floor",
      "Bending knees"
    ],
    "blueprint": {
      "figureType": "plank",
      "startAngle": "Supine flat",
      "endAngle": "Curved hollow dish",
      "motionVector": "Total Anterior Core Lock",
      "focalJoints": [
        "Rectus Abdominis",
        "Transversus Abdominis",
        "Psoas"
      ],
      "tacticalCues": [
        {
          "label": "Overhead arm extension",
          "x": 20,
          "y": 40
        },
        {
          "label": "6-inch foot hover",
          "x": 80,
          "y": 45
        }
      ]
    }
  },
  {
    "id": "delts-pike-pushup",
    "name": "ELEVATED FEET PIKE PUSH-UP",
    "tier": "advanced",
    "primaryMuscle": "deltoids",
    "secondaryMuscles": [
      "triceps",
      "traps",
      "abs"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "4 \u00d7 8\u201310 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "FEET ON BENCH \u00b7 HIPS OVER SHOULDERS \u00b7 HEAD LOWERS FORWARD",
    "instructions": [
      "Place feet on a bench, walk hands back until hips are stacked over shoulders (L-shape).",
      "Inhale and lower crown of head forward in front of hands to form a tripod.",
      "Press through palms and shoulders back up, pushing chest toward bench at top."
    ],
    "mistakes": [
      "Flaring elbows wide",
      "Allowing hips to drop forward out of vertical stack"
    ],
    "blueprint": {
      "figureType": "handstand",
      "startAngle": "90\u00b0 Inverted L-Shape",
      "endAngle": "Tripod Head Touch",
      "motionVector": "Inverted Overhead Press",
      "focalJoints": [
        "Anterior Deltoid",
        "Lateral Deltoid",
        "Triceps"
      ],
      "tacticalCues": [
        {
          "label": "Bench foot plant",
          "x": 25,
          "y": 30
        },
        {
          "label": "Vertical hip stack",
          "x": 55,
          "y": 25
        }
      ]
    }
  },
  {
    "id": "calves-single-leg-raise",
    "name": "SINGLE-LEG DEFICIT CALF RAISE",
    "tier": "advanced",
    "primaryMuscle": "calves",
    "secondaryMuscles": [
      "forearms"
    ],
    "equipment": "ELEVATED SURFACE",
    "prescription": "4 \u00d7 12\u201315 REPS / LEG",
    "tempo": "2-2-1-0",
    "tacticalCue": "DEEP DEFICIT HEEL STRETCH \u00b7 2-SECOND PEAK ISOMETRIC CONTRACTION",
    "instructions": [
      "Stand on edge of step on one foot, other foot hooked behind working ankle.",
      "Lower heel deep below platform for a full 2-second stretch.",
      "Drive up to maximum height on the ball of your foot, holding peak contraction."
    ],
    "mistakes": [
      "Bouncing rapidly",
      "Not achieving full ankle extension"
    ],
    "blueprint": {
      "figureType": "calf_raise",
      "startAngle": "Deep heel deficit",
      "endAngle": "Single leg max extension",
      "motionVector": "Unilateral Plantarflexion",
      "focalJoints": [
        "Gastrocnemius",
        "Soleus"
      ],
      "tacticalCues": [
        {
          "label": "Ledge deficit point",
          "x": 50,
          "y": 75
        },
        {
          "label": "Peak unilateral squeeze",
          "x": 50,
          "y": 40
        }
      ]
    }
  },
  {
    "id": "chest-archer-pushup",
    "name": "TACTICAL ARCHER PUSH-UP",
    "tier": "pro",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "triceps",
      "deltoids",
      "abs"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 8\u201310 REPS / SIDE",
    "tempo": "2-1-1-0",
    "tacticalCue": "ONE ARM FULLY EXTENDED STRAIGHT \u00b7 ONE ARM PRESSES 100% LOAD",
    "instructions": [
      "Assume a very wide pushup stance with fingers pointing outward.",
      "Lower body strictly toward one hand while keeping opposite arm locked straight.",
      "Chest touches the working hand while non-working arm glides out like an archer.",
      "Press through working chest back to center, alternating sides."
    ],
    "mistakes": [
      "Bending the straight assist arm",
      "Rotating hips off plane"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Wide Horizontal Stance",
      "endAngle": "One-Arm Deep Press",
      "motionVector": "Unilateral Lateral Press",
      "focalJoints": [
        "Pectoralis Major",
        "Triceps",
        "Anterior Deltoid"
      ],
      "tacticalCues": [
        {
          "label": "Working arm deep flex",
          "x": 75,
          "y": 80
        },
        {
          "label": "Locked assist wing",
          "x": 25,
          "y": 75
        }
      ]
    }
  },
  {
    "id": "chest-pseudo-planche",
    "name": "PSEUDO PLANCHE PUSH-UP",
    "tier": "pro",
    "primaryMuscle": "deltoids",
    "secondaryMuscles": [
      "chest",
      "triceps",
      "abs"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 8\u201310 REPS",
    "tempo": "3-1-1-0",
    "tacticalCue": "HANDS BY WAISTLINE \u00b7 LEAN MASS FORWARD \u00b7 PROTRACT SCAPULA",
    "instructions": [
      "Place hands with fingers pointing outward/backward next to mid-torso.",
      "Lean forward until shoulders are far ahead of wrists, weight shifted to toes.",
      "Lower chest while maintaining severe forward lean.",
      "Press up and hollow out upper back at top."
    ],
    "mistakes": [
      "Letting shoulders slide backward during descent"
    ],
    "blueprint": {
      "figureType": "planche",
      "startAngle": "Severe Forward Lean",
      "endAngle": "Waistline Deep Dip",
      "motionVector": "High-Leverage Anterior Press",
      "focalJoints": [
        "Anterior Deltoid",
        "Pectoralis Major",
        "Biceps Tendon"
      ],
      "tacticalCues": [
        {
          "label": "Shoulder overhang line",
          "x": 75,
          "y": 45
        },
        {
          "label": "Waist-height hands",
          "x": 55,
          "y": 65
        }
      ]
    }
  },
  {
    "id": "lats-wide-pullup",
    "name": "WIDE GRIP OVERHAND PULL-UP",
    "tier": "pro",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "traps",
      "biceps",
      "forearms"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 8\u201310 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "WIDE WINGSPAN GRIP \u00b7 DRIVE ELBOWS DOWN TO RIBS \u00b7 CHEST TO BAR",
    "instructions": [
      "Take a wide overhand grip on the bar, 1.5\u00d7 shoulder width.",
      "Retract and depress scapulae, then pull chest toward the bar.",
      "Focus on squeezing outer lats and lower traps at peak contraction.",
      "Lower under control back to full stretch."
    ],
    "mistakes": [
      "Half reps",
      "Shrugging neck forward"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Wide Dead Hang",
      "endAngle": "Chest to Bar Clearance",
      "motionVector": "Wide Coronal Pull",
      "focalJoints": [
        "Latissimus Dorsi",
        "Teres Major",
        "Lower Trapezius"
      ],
      "tacticalCues": [
        {
          "label": "Wide bar grip",
          "x": 50,
          "y": 15
        },
        {
          "label": "Latissimus flare",
          "x": 42,
          "y": 38
        }
      ]
    }
  },
  {
    "id": "lats-lsit-pullup",
    "name": "L-SIT STRICT PULL-UP",
    "tier": "pro",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "abs",
      "quads",
      "biceps"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 6\u20138 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "LEGS LOCKED 90\u00b0 HORIZONTAL \u00b7 ZERO DROP IN LEG ANGLE DURING PULL",
    "instructions": [
      "Hang from bar, then raise legs straight out at 90 degrees into an L-sit.",
      "Maintain strict horizontal leg angle while performing strict pull-ups.",
      "Clear chin over bar and lower back down without lowering legs."
    ],
    "mistakes": [
      "Dropping legs down during pull",
      "Bending knees"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "L-Sit dead hang",
      "endAngle": "Chin clears bar in L-sit",
      "motionVector": "Compound Pull & Core Lock",
      "focalJoints": [
        "Lats",
        "Rectus Abdominis",
        "Hip Flexors"
      ],
      "tacticalCues": [
        {
          "label": "90\u00b0 leg horizon",
          "x": 65,
          "y": 50
        },
        {
          "label": "Chin over bar",
          "x": 50,
          "y": 25
        }
      ]
    }
  },
  {
    "id": "quads-pistol-squat",
    "name": "SINGLE-LEG PISTOL SQUAT",
    "tier": "pro",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "hamstrings",
      "calves",
      "abs"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 6\u20138 REPS / LEG",
    "tempo": "3-1-1-0",
    "tacticalCue": "EXTEND NON-WORKING LEG FORWARD \u00b7 SINK ALL THE WAY TO HEEL",
    "instructions": [
      "Stand on one leg, extending other leg straight out in front off floor.",
      "Reach arms forward for counterbalance and descend into a deep single-leg squat.",
      "Bottom position: working hamstring touches calf, non-working leg hovers off deck.",
      "Drive through heel and midfoot back to full standing lockout."
    ],
    "mistakes": [
      "Heel lifting off floor",
      "Non-working leg touching ground"
    ],
    "blueprint": {
      "figureType": "squat",
      "startAngle": "Single leg balance",
      "endAngle": "Deep single leg crease",
      "motionVector": "Apex Unilateral Leg Drive",
      "focalJoints": [
        "Quadriceps Femoris",
        "Gluteus Maximus",
        "Ankle Dorsiflexion"
      ],
      "tacticalCues": [
        {
          "label": "Hovering leg line",
          "x": 75,
          "y": 60
        },
        {
          "label": "Single heel ground plant",
          "x": 48,
          "y": 88
        }
      ]
    }
  },
  {
    "id": "quads-dragon-squat",
    "name": "DRAGON SQUAT / CURTSY DROP",
    "tier": "pro",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipment": "FLOOR",
    "prescription": "3 \u00d7 6 REPS / LEG",
    "tempo": "3-1-1-0",
    "tacticalCue": "WEAVE NON-WORKING LEG BEHIND AND OUTWARD \u00b7 DEEP ROTATIONAL LOAD",
    "instructions": [
      "Stand on one foot, send opposite foot behind and across body without touching deck.",
      "Squat deep on working leg while hovering the reaching leg off floor.",
      "Press through working foot back to starting position."
    ],
    "mistakes": [
      "Losing balance",
      "Knee caving excessively"
    ],
    "blueprint": {
      "figureType": "squat",
      "startAngle": "Single leg stance",
      "endAngle": "Curtsy hover depth",
      "motionVector": "Rotational Unilateral Squat",
      "focalJoints": [
        "Gluteus Medius",
        "Quadriceps",
        "Vastus Medialis"
      ],
      "tacticalCues": [
        {
          "label": "Crossing leg vector",
          "x": 30,
          "y": 70
        },
        {
          "label": "Deep working hip",
          "x": 60,
          "y": 65
        }
      ]
    }
  },
  {
    "id": "hamstrings-nordic-curl-tuck",
    "name": "NORDIC HAMSTRING CURL (ECCENTRIC)",
    "tier": "pro",
    "primaryMuscle": "hamstrings",
    "secondaryMuscles": [
      "glutes",
      "calves"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 5\u20136 REPS",
    "tempo": "4-1-1-0",
    "tacticalCue": "ANKLES ANCHORED \u00b7 LOWER BODY SLOW AS MOLTEN LEAD \u00b7 RIGID HIPS",
    "instructions": [
      "Kneel upright with ankles firmly secured beneath a heavy rail or loaded surface.",
      "Keep body completely straight from knees to shoulders, glutes clamped tight.",
      "Lower torso forward toward floor as slowly as possible using only hamstrings.",
      "Catch yourself with hands at bottom, push back lightly to reset."
    ],
    "mistakes": [
      "Bending at the hips (breaking the straight line)",
      "Free falling without hamstring resistance"
    ],
    "blueprint": {
      "figureType": "bridge",
      "startAngle": "Upright Kneeling",
      "endAngle": "Slow Eccentric Fall",
      "motionVector": "Extreme Knee Flexor Eccentric",
      "focalJoints": [
        "Biceps Femoris",
        "Semitendinosus",
        "Gastrocnemius"
      ],
      "tacticalCues": [
        {
          "label": "Anchored heels",
          "x": 15,
          "y": 75
        },
        {
          "label": "Locked hip extension",
          "x": 45,
          "y": 55
        }
      ]
    }
  },
  {
    "id": "abs-hanging-leg-raise",
    "name": "STRICT TOES-TO-BAR LEG RAISE",
    "tier": "pro",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "obliques",
      "lats",
      "quads",
      "forearms"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 8\u201310 REPS",
    "tempo": "2-1-2-0",
    "tacticalCue": "LEGS PINNED TOGETHER \u00b7 TOES TOUCH STEEL BAR \u00b7 ZERO KIP",
    "instructions": [
      "Hang from pull-up bar with active shoulders and hollow body position.",
      "Without any swing, engage lats and core to raise straight legs toward ceiling.",
      "Touch toes to the bar between hands.",
      "Lower legs slowly with a 2-second negative back to dead hang."
    ],
    "mistakes": [
      "Swinging into reps with a kip",
      "Bending knees"
    ],
    "blueprint": {
      "figureType": "leg_raise",
      "startAngle": "Dead hang straight",
      "endAngle": "Toes touch steel bar",
      "motionVector": "Strict Total Core Flexion",
      "focalJoints": [
        "Rectus Abdominis",
        "Hip Flexors",
        "Lats"
      ],
      "tacticalCues": [
        {
          "label": "Toes touch bar",
          "x": 50,
          "y": 18
        },
        {
          "label": "Zero kip torso",
          "x": 50,
          "y": 45
        }
      ]
    }
  },
  {
    "id": "abs-dragon-flag-tuck",
    "name": "TUCKED DRAGON FLAG",
    "tier": "pro",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "lower_back",
      "lats"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 6\u20138 REPS",
    "tempo": "3-1-1-0",
    "tacticalCue": "WEIGHT ON UPPER BACK ONLY \u00b7 LOWER TORSO SLOWLY WITHOUT BENDING WAIST",
    "instructions": [
      "Lie on bench or floor, gripping a sturdy post or bench edge behind head.",
      "Drive body up vertically onto shoulders, knees tucked toward chest.",
      "Slowly lower entire body down toward deck while maintaining straight torso line.",
      "Hover just above bench, then raise back to vertical."
    ],
    "mistakes": [
      "Dropping hips onto bench",
      "Bending at waist on descent"
    ],
    "blueprint": {
      "figureType": "leg_raise",
      "startAngle": "Vertical shoulder balance",
      "endAngle": "Horizontal hover",
      "motionVector": "High-Leverage Core Anti-Extension",
      "focalJoints": [
        "Rectus Abdominis",
        "Lats"
      ],
      "tacticalCues": [
        {
          "label": "Shoulder anchor",
          "x": 20,
          "y": 60
        },
        {
          "label": "Tucked torso hover",
          "x": 65,
          "y": 60
        }
      ]
    }
  },
  {
    "id": "core-lsit-hold",
    "name": "FLOOR / PARALLEL BAR L-SIT",
    "tier": "pro",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "triceps",
      "deltoids",
      "quads"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 20\u201330s HOLD",
    "tempo": "ISOMETRIC",
    "tacticalCue": "PALMS PRESSED INTO DECK \u00b7 DEPRESS SHOULDERS \u00b7 LEGS LOCKED 90\u00b0",
    "instructions": [
      "Sit on floor with legs extended, palms placed flat beside hips.",
      "Push hard through palms, depressing shoulder blades to lift hips off deck.",
      "Lift straight legs off floor into a rigid 90\u00b0 L-position.",
      "Breathe through nose while locking quads and toes pointed."
    ],
    "mistakes": [
      "Shoulders shrugging toward ears",
      "Feet touching floor"
    ],
    "blueprint": {
      "figureType": "dip",
      "startAngle": "Seated base",
      "endAngle": "Suspended 90\u00b0 L-Sit",
      "motionVector": "Isometric Compression & Support",
      "focalJoints": [
        "Scapular Depressors",
        "Rectus Abdominis",
        "Rectus Femoris"
      ],
      "tacticalCues": [
        {
          "label": "Palm drive floor lockout",
          "x": 50,
          "y": 65
        },
        {
          "label": "90\u00b0 leg elevation",
          "x": 65,
          "y": 55
        }
      ]
    }
  },
  {
    "id": "triceps-straight-bar-dip",
    "name": "STRAIGHT BAR MUSCLE-UP DIP",
    "tier": "pro",
    "primaryMuscle": "triceps",
    "secondaryMuscles": [
      "chest",
      "deltoids",
      "abs"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 6\u20138 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "LEAN FORWARD OVER BAR \u00b7 LOWER CHEST UNTIL IT TOUCHES STEEL",
    "instructions": [
      "Support yourself on top of a single horizontal pull-up bar.",
      "Lean torso forward, balancing over the bar with core braced.",
      "Lower chest until sternum touches the bar, elbows tracking behind.",
      "Press forcefully back to top support lockout."
    ],
    "mistakes": [
      "Falling behind bar",
      "Not reaching chest to bar"
    ],
    "blueprint": {
      "figureType": "dip",
      "startAngle": "Bar support lockout",
      "endAngle": "Sternum touches bar",
      "motionVector": "Straight Bar Dip",
      "focalJoints": [
        "Triceps Brachii",
        "Lower Pectorals",
        "Shoulder Stabilizers"
      ],
      "tacticalCues": [
        {
          "label": "Straight bar anchor",
          "x": 50,
          "y": 45
        },
        {
          "label": "Forward chest lean",
          "x": 55,
          "y": 35
        }
      ]
    }
  },
  {
    "id": "delts-wall-handstand-pushup",
    "name": "WALL-SUPPORTED HANDSTAND PUSH-UP",
    "tier": "pro",
    "primaryMuscle": "deltoids",
    "secondaryMuscles": [
      "triceps",
      "traps",
      "abs"
    ],
    "equipment": "WALL",
    "prescription": "4 \u00d7 5\u20138 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "HEELS AGAINST WALL \u00b7 LOWER HEAD FORWARD TO TRIPOD \u00b7 PRESS LOCKOUT",
    "instructions": [
      "Kick up into handstand facing away from wall (or stomach to wall).",
      "Keep body tight in hollow alignment.",
      "Lower crown of head forward toward floor ahead of fingertips.",
      "Press through shoulders and triceps back to full vertical lockout."
    ],
    "mistakes": [
      "Flaring elbows 90 degrees outward",
      "Arching lower back into scorpion"
    ],
    "blueprint": {
      "figureType": "handstand",
      "startAngle": "Full Inverted Lockout",
      "endAngle": "Head Touches Deck",
      "motionVector": "Vertical Overhead Inverted Press",
      "focalJoints": [
        "Anterior Deltoid",
        "Triceps Brachii",
        "Trapezius"
      ],
      "tacticalCues": [
        {
          "label": "Wall stabilization line",
          "x": 30,
          "y": 20
        },
        {
          "label": "Head tripod touchdown",
          "x": 55,
          "y": 85
        }
      ]
    }
  },
  {
    "id": "chest-clapping-pushup",
    "name": "EXPLOSIVE CLAPPING PUSH-UP",
    "tier": "military",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "triceps",
      "deltoids"
    ],
    "equipment": "FLOOR",
    "prescription": "5 \u00d7 8\u201310 REPS",
    "tempo": "EXPLOSIVE",
    "tacticalCue": "DECELERATE TO CHEST \u00b7 EXPLODE VIOLENTLY \u00b7 CLAP HANDS IN AIR",
    "instructions": [
      "Lower chest to floor under control.",
      "Explode upward with maximal force so hands completely leave deck.",
      "Clap hands firmly together in mid-air.",
      "Catch deck with soft elbows, instantly absorbing momentum into next repetition."
    ],
    "mistakes": [
      "Landing with stiff locked elbows",
      "Piking hips to create false height"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Chest Grazes Deck",
      "endAngle": "Airborne Mid-Air Flight",
      "motionVector": "Ballistic Explosive Push",
      "focalJoints": [
        "Pectoralis Major",
        "Triceps",
        "Wrist Shock Absorption"
      ],
      "tacticalCues": [
        {
          "label": "Ballistic deck rebound",
          "x": 75,
          "y": 80
        },
        {
          "label": "Mid-air hand clap",
          "x": 70,
          "y": 60
        }
      ]
    }
  },
  {
    "id": "chest-onearm-elevated-pushup",
    "name": "ONE-ARM FLOOR PUSH-UP",
    "tier": "military",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "triceps",
      "deltoids",
      "obliques",
      "abs"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 5 REPS / ARM",
    "tempo": "2-1-1-0",
    "tacticalCue": "FEET WIDE \u00b7 NON-WORKING ARM BEHIND BACK \u00b7 ZERO SHOULDER TILT",
    "instructions": [
      "Place feet double shoulder-width apart, one hand flat under chest.",
      "Tuck non-working hand behind small of back.",
      "Lower chest strictly to floor without letting shoulders or hips tilt sideways.",
      "Press back up through chest and core to full lockout."
    ],
    "mistakes": [
      "Excessive rotational twisting of torso",
      "Cutting depth short"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Unilateral Hand Plant",
      "endAngle": "One-Arm Chest to Deck",
      "motionVector": "Asymmetric Unilateral Press",
      "focalJoints": [
        "Pectoralis Major",
        "Triceps",
        "Anti-Rotational Core"
      ],
      "tacticalCues": [
        {
          "label": "Single hand press center",
          "x": 65,
          "y": 80
        },
        {
          "label": "Wide anti-rotational base",
          "x": 20,
          "y": 65
        }
      ]
    }
  },
  {
    "id": "lats-chest-to-bar-pullup",
    "name": "TACTICAL CHEST-TO-BAR PULL-UP",
    "tier": "military",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "traps",
      "biceps",
      "abs"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 8\u201310 REPS",
    "tempo": "EXPLOSIVE",
    "tacticalCue": "EXPLODE HIGH \u00b7 STERNUM STRIKES STEEL BAR \u00b7 SCAPULAR PINCH",
    "instructions": [
      "Hang with active shoulder engagement.",
      "Pull with violent concentric speed, driving elbows past ribcage.",
      "Continue pull until collarbone or sternum physically strikes the bar.",
      "Lower under control with 2-second negative."
    ],
    "mistakes": [
      "Using kipping momentum",
      "Stopping at chin clearance"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Full Dead Hang",
      "endAngle": "Sternum Touches Bar",
      "motionVector": "High Explosive Vertical Pull",
      "focalJoints": [
        "Latissimus Dorsi",
        "Lower Trapezius",
        "Rhomboids"
      ],
      "tacticalCues": [
        {
          "label": "Steel bar contact",
          "x": 50,
          "y": 15
        },
        {
          "label": "Sternum strike point",
          "x": 50,
          "y": 28
        }
      ]
    }
  },
  {
    "id": "lats-bar-muscleup",
    "name": "EXPLOSIVE BAR MUSCLE-UP",
    "tier": "military",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "triceps",
      "chest",
      "deltoids",
      "abs"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "5 \u00d7 3\u20135 REPS",
    "tempo": "EXPLOSIVE",
    "tacticalCue": "PULL HIGH TO STERNUM \u00b7 WHIP CHEST OVER BAR \u00b7 PRESS TO LOCKOUT",
    "instructions": [
      "Hang from bar with false grip or thumbs-over grip.",
      "Initiate an explosive high pull toward hips, arching slightly back.",
      "As chest reaches bar height, whip head and chest forward over the bar.",
      "Press through straight bar dip to full arm lockout."
    ],
    "mistakes": [
      "Chicken-winging (one elbow over at a time)",
      "Excessive knee kick"
    ],
    "blueprint": {
      "figureType": "muscle_up",
      "startAngle": "Explosive pull",
      "endAngle": "Full Support Over Bar",
      "motionVector": "Compound Pull-To-Dip Transition",
      "focalJoints": [
        "Latissimus Dorsi",
        "Triceps",
        "Wrist Rotation"
      ],
      "tacticalCues": [
        {
          "label": "High bar pull vector",
          "x": 50,
          "y": 45
        },
        {
          "label": "Overhead bar lockout",
          "x": 50,
          "y": 20
        }
      ]
    }
  },
  {
    "id": "lats-archer-pullup",
    "name": "STRICT ARCHER PULL-UP",
    "tier": "military",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "biceps",
      "traps",
      "forearms"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 5 REPS / SIDE",
    "tempo": "2-1-1-0",
    "tacticalCue": "PULL TO ONE HAND \u00b7 OPPOSITE ARM GLIDES STRAIGHT OVER BAR",
    "instructions": [
      "Take a very wide grip on the bar.",
      "Pull body up toward right hand while left arm locks completely straight across bar.",
      "Chin touches right wrist.",
      "Lower back to center and pull to left side."
    ],
    "mistakes": [
      "Bending the straight assist arm",
      "Swinging body"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Wide hang",
      "endAngle": "Chin to single wrist",
      "motionVector": "Unilateral Coronal Pull",
      "focalJoints": [
        "Lats",
        "Biceps",
        "Brachioradialis"
      ],
      "tacticalCues": [
        {
          "label": "Working arm lock",
          "x": 65,
          "y": 25
        },
        {
          "label": "Straight wing arm",
          "x": 30,
          "y": 18
        }
      ]
    }
  },
  {
    "id": "quads-shrimp-squat",
    "name": "AIRBORNE SHRIMP SQUAT",
    "tier": "military",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "hamstrings"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 6 REPS / LEG",
    "tempo": "3-1-1-0",
    "tacticalCue": "HOLD REAR ANKLE BEHIND GLUTE \u00b7 LOWER UNTIL REAR KNEE TOUCHES DECK",
    "instructions": [
      "Stand on one leg, bend opposite knee and hold rear ankle behind glute with same-side hand.",
      "Reach other arm forward and descend slowly on working leg.",
      "Gently touch rear knee to floor behind working heel without resting weight.",
      "Drive back up to full standing extension."
    ],
    "mistakes": [
      "Bouncing off rear knee",
      "Heel lifting"
    ],
    "blueprint": {
      "figureType": "squat",
      "startAngle": "Single leg upright",
      "endAngle": "Rear knee touches deck",
      "motionVector": "Pure Quadriceps Isolation",
      "focalJoints": [
        "Quadriceps Femoris",
        "Gluteus Maximus"
      ],
      "tacticalCues": [
        {
          "label": "Hand holding rear ankle",
          "x": 35,
          "y": 45
        },
        {
          "label": "Rear knee touch",
          "x": 35,
          "y": 80
        }
      ]
    }
  },
  {
    "id": "quads-sissy-squat",
    "name": "FREESTANDING SISSY SQUAT",
    "tier": "military",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "calves",
      "abs"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 8\u201310 REPS",
    "tempo": "3-1-1-0",
    "tacticalCue": "RISE ONTO TOES \u00b7 LEAN TORSO BACK \u00b7 KNEES TRAVEL FAR FORWARD",
    "instructions": [
      "Stand tall, rise high onto the balls of your feet.",
      "Lean torso back in a straight line with thighs while pushing knees forward and down.",
      "Descend until knees hover inches from the deck, feeling intense quad stretch.",
      "Drive through balls of feet to return to start."
    ],
    "mistakes": [
      "Bending at hips",
      "Dropping heels"
    ],
    "blueprint": {
      "figureType": "squat",
      "startAngle": "Toe stance",
      "endAngle": "Extreme knee forward travel",
      "motionVector": "Isolated Knee Extension",
      "focalJoints": [
        "Rectus Femoris",
        "Patellar Tendon"
      ],
      "tacticalCues": [
        {
          "label": "Torso lean angle",
          "x": 35,
          "y": 45
        },
        {
          "label": "Knee forward travel",
          "x": 65,
          "y": 70
        }
      ]
    }
  },
  {
    "id": "abs-windshield-wipers",
    "name": "HANGING WINDSHIELD WIPERS",
    "tier": "military",
    "primaryMuscle": "obliques",
    "secondaryMuscles": [
      "abs",
      "lats",
      "forearms"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 6 REPS / SIDE",
    "tempo": "2-1-2-0",
    "tacticalCue": "TOES POINTED TO SKY \u00b7 ROTATE LEGS SIDEWAYS THROUGH 180\u00b0 ARC",
    "instructions": [
      "Hang from bar and lift legs up into a vertical inverted toes-to-bar position.",
      "Rotate legs side to side in a windshield wiper arc without bending knees.",
      "Touch feet toward 9 o'clock, return through center, sweep to 3 o'clock."
    ],
    "mistakes": [
      "Dropping legs below horizontal",
      "Losing shoulder lock"
    ],
    "blueprint": {
      "figureType": "leg_raise",
      "startAngle": "Vertical inverted toes",
      "endAngle": "Lateral 180\u00b0 sweep",
      "motionVector": "Rotational Core Shear",
      "focalJoints": [
        "Obliquus Externus",
        "Rectus Abdominis",
        "Lats"
      ],
      "tacticalCues": [
        {
          "label": "Bar hang anchor",
          "x": 50,
          "y": 15
        },
        {
          "label": "Lateral wiper arc",
          "x": 70,
          "y": 35
        }
      ]
    }
  },
  {
    "id": "abs-front-lever-tuck",
    "name": "ADVANCED TUCK FRONT LEVER",
    "tier": "military",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "abs",
      "traps",
      "forearms"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "5 \u00d7 12\u201315s HOLD",
    "tempo": "ISOMETRIC",
    "tacticalCue": "ARMS LOCKED DEAD STRAIGHT \u00b7 TORSO STRICTLY PARALLEL TO DECK",
    "instructions": [
      "Hang from bar with overhand grip and straight arms.",
      "Pull straight arms down against bar, lifting torso parallel to floor.",
      "Keep knees tucked at 90 degrees, back completely flat.",
      "Hold rigid horizontal plane without hips dropping."
    ],
    "mistakes": [
      "Bending elbows",
      "Rounding upper back"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Dead hang",
      "endAngle": "Horizontal torso plane",
      "motionVector": "Straight-Arm Lat Leverage",
      "focalJoints": [
        "Latissimus Dorsi",
        "Teres Major",
        "Abdominals"
      ],
      "tacticalCues": [
        {
          "label": "Straight arm lever",
          "x": 50,
          "y": 25
        },
        {
          "label": "Parallel body plane",
          "x": 50,
          "y": 45
        }
      ]
    }
  },
  {
    "id": "back-back-lever-tuck",
    "name": "ADVANCED TUCK BACK LEVER",
    "tier": "military",
    "primaryMuscle": "lower_back",
    "secondaryMuscles": [
      "deltoids",
      "biceps",
      "glutes"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 12\u201315s HOLD",
    "tempo": "ISOMETRIC",
    "tacticalCue": "SKIN THE CAT \u00b7 LOWER TO HORIZONTAL \u00b7 SQUEEZE BICEPS & GLUTES",
    "instructions": [
      "Invert through bar (skin the cat) into inverted tuck.",
      "Lower body down until back and thighs form a straight horizontal line facing floor.",
      "Lock arms straight, absorbing force through biceps tendon and anterior deltoids.",
      "Hold rigid horizontal line."
    ],
    "mistakes": [
      "Dropping hips below bar level",
      "Bending elbows"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Inverted hang",
      "endAngle": "Horizontal back plane",
      "motionVector": "Posterior Shoulder Leverage",
      "focalJoints": [
        "Biceps Tendon",
        "Erector Spinae",
        "Anterior Deltoid"
      ],
      "tacticalCues": [
        {
          "label": "Bar hand grasp",
          "x": 50,
          "y": 25
        },
        {
          "label": "Horizontal back stack",
          "x": 50,
          "y": 50
        }
      ]
    }
  },
  {
    "id": "delts-strict-hspu-wall",
    "name": "STRICT DEFICIT WALL HANDSTAND PUSH-UP",
    "tier": "military",
    "primaryMuscle": "deltoids",
    "secondaryMuscles": [
      "triceps",
      "traps",
      "abs"
    ],
    "equipment": "WALL",
    "prescription": "5 \u00d7 5\u20138 REPS",
    "tempo": "3-1-1-0",
    "tacticalCue": "HANDS ON ELEVATED PARALLETTES \u00b7 HEAD DESCENDS BELOW HAND LEVEL",
    "instructions": [
      "Set parallettes or blocks against wall. Kick up into strict handstand.",
      "Lower crown of head below hand level into deep deficit stretch.",
      "Press explosively through shoulders back to full vertical lockout."
    ],
    "mistakes": [
      "Scorpion arched back",
      "Bouncing off floor"
    ],
    "blueprint": {
      "figureType": "handstand",
      "startAngle": "Deficit handstand",
      "endAngle": "Head below hand plane",
      "motionVector": "Deficit Overhead Press",
      "focalJoints": [
        "Deltoid Anterior/Lateral",
        "Triceps",
        "Upper Trapezius"
      ],
      "tacticalCues": [
        {
          "label": "Deficit hand elevation",
          "x": 50,
          "y": 75
        },
        {
          "label": "Full vertical line",
          "x": 50,
          "y": 25
        }
      ]
    }
  },
  {
    "id": "fullbody-navy-seal-burpee",
    "name": "NAVY SEAL 8-COUNT BURPEE COMPLEX",
    "tier": "military",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "quads",
      "abs",
      "deltoids",
      "calves"
    ],
    "equipment": "FLOOR",
    "prescription": "5 \u00d7 10 REPS",
    "tempo": "MILITARY CADENCE",
    "tacticalCue": "DROP TO PLANK \u00b7 2 PUSHUPS WITH ALTERNATING KNEE-TO-ELBOW \u00b7 JUMP",
    "instructions": [
      "Drop hands to deck, kick feet back to plank.",
      "Pushup 1: bring right knee to right elbow at bottom.",
      "Pushup 2: bring left knee to left elbow at bottom.",
      "Hop feet forward and explode into vertical jump."
    ],
    "mistakes": [
      "Rushing counts",
      "Incomplete pushup depth"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Standing readiness",
      "endAngle": "Double pushup knee strike",
      "motionVector": "Full-Body Combat Circuit",
      "focalJoints": [
        "Total Body Musculature",
        "Anaerobic Engine"
      ],
      "tacticalCues": [
        {
          "label": "Floor strike pushup",
          "x": 60,
          "y": 75
        },
        {
          "label": "Knee elbow tuck",
          "x": 50,
          "y": 65
        }
      ]
    }
  },
  {
    "id": "chest-aztec-pushup",
    "name": "AZTEC EXPLOSIVE PIKE JUMP PUSH-UP",
    "tier": "brutal",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "abs",
      "deltoids",
      "hamstrings"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 4\u20136 REPS",
    "tempo": "EXPLOSIVE",
    "tacticalCue": "CHEST TO DECK \u00b7 LAUNCH ENTIRE BODY \u00b7 TOUCH TOES IN AIR \u00b7 LAND SMOOTH",
    "instructions": [
      "Descend to bottom of pushup with chest grazing floor.",
      "Explode upward with violent force, launching both hands AND feet off deck.",
      "Pike body in mid-air and touch fingers to toes.",
      "Instantly snap back out to plank and catch floor with soft elbows."
    ],
    "mistakes": [
      "Missing toe touch",
      "Hard landing crashing on floor"
    ],
    "blueprint": {
      "figureType": "pushup",
      "startAngle": "Chest on deck",
      "endAngle": "Mid-air pike toe touch",
      "motionVector": "Supreme Explosive Full-Body Flight",
      "focalJoints": [
        "Pectoralis Major",
        "Rectus Abdominis",
        "Psoas"
      ],
      "tacticalCues": [
        {
          "label": "Explosive floor thrust",
          "x": 75,
          "y": 80
        },
        {
          "label": "Mid-air toe strike",
          "x": 50,
          "y": 35
        }
      ]
    }
  },
  {
    "id": "chest-planche-pushup",
    "name": "FULL PLANCHE PUSH-UP",
    "tier": "brutal",
    "primaryMuscle": "deltoids",
    "secondaryMuscles": [
      "chest",
      "biceps",
      "abs",
      "lower_back"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 3\u20135 REPS",
    "tempo": "3-1-1-0",
    "tacticalCue": "BODY COMPLETELY HORIZONTAL \u00b7 FEET FLOATING \u00b7 ZERO DECK CONTACT",
    "instructions": [
      "Assume a full planche position with straight legs suspended parallel to floor.",
      "Maintain horizontal balance while bending elbows to lower chest.",
      "Press through anterior deltoids and chest back to full planche lockout.",
      "Feet never touch the ground throughout the entire set."
    ],
    "mistakes": [
      "Feet dropping",
      "Piking hips upward"
    ],
    "blueprint": {
      "figureType": "planche",
      "startAngle": "Horizontal Float Lockout",
      "endAngle": "Horizontal Deep Pushup",
      "motionVector": "Ultimate Calisthenic Press",
      "focalJoints": [
        "Anterior Deltoid",
        "Biceps Tendon",
        "Wrist Extensors"
      ],
      "tacticalCues": [
        {
          "label": "Zero foot floor contact",
          "x": 15,
          "y": 45
        },
        {
          "label": "Waistline palm drive",
          "x": 55,
          "y": 55
        }
      ]
    }
  },
  {
    "id": "lats-onearm-pullup",
    "name": "ONE-ARM STRICT PULL-UP",
    "tier": "brutal",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "biceps",
      "traps",
      "forearms",
      "abs"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 2\u20133 REPS / ARM",
    "tempo": "2-1-1-0",
    "tacticalCue": "ONE HAND ONLY ON BAR \u00b7 ZERO ASSIST \u00b7 CHIN CLEARS OVER BAR",
    "instructions": [
      "Hang from pull-up bar with one hand only. Free arm tucked beside ribs.",
      "Engage scapular depression, then drive elbow down with immense lat force.",
      "Pull until chin clearly crosses above the top of the bar.",
      "Lower under control back to a dead hang."
    ],
    "mistakes": [
      "Kicking legs",
      "Dropping down uncontrolled"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Single-Arm Dead Hang",
      "endAngle": "Single-Arm Chin Clearance",
      "motionVector": "Apex Unilateral Vertical Pull",
      "focalJoints": [
        "Latissimus Dorsi",
        "Biceps Brachii",
        "Finger Grip Hook"
      ],
      "tacticalCues": [
        {
          "label": "Single hand bar lock",
          "x": 50,
          "y": 15
        },
        {
          "label": "Chin clearance apex",
          "x": 50,
          "y": 28
        }
      ]
    }
  },
  {
    "id": "lats-slow-muscleup",
    "name": "STRICT SLOW BAR MUSCLE-UP (ZERO KICK)",
    "tier": "brutal",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "triceps",
      "forearms",
      "abs",
      "chest"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 3\u20134 REPS",
    "tempo": "4-2-2-0",
    "tacticalCue": "FALSE GRIP WRAPPED \u00b7 PULL SLOW TO ARMPITS \u00b7 TRANSITION WITHOUT KICK",
    "instructions": [
      "Set false grip with wrists wrapped firmly over the bar.",
      "Pull up in slow motion, bringing chest and armpits to the bar.",
      "Roll shoulders and chest forward over the bar simultaneously with zero momentum.",
      "Lock out into straight bar dip and reverse in slow motion."
    ],
    "mistakes": [
      "Kicking knees",
      "Fast kipping transition"
    ],
    "blueprint": {
      "figureType": "muscle_up",
      "startAngle": "False grip dead hang",
      "endAngle": "Slow roll over bar",
      "motionVector": "Pure Strength Muscle-Up",
      "focalJoints": [
        "Lats",
        "Forearm Flexors",
        "Triceps"
      ],
      "tacticalCues": [
        {
          "label": "False grip wrist perch",
          "x": 50,
          "y": 25
        },
        {
          "label": "Slow forward chest roll",
          "x": 50,
          "y": 30
        }
      ]
    }
  },
  {
    "id": "lats-front-lever-pull",
    "name": "FULL FRONT LEVER PULL-TO-INVERTED",
    "tier": "brutal",
    "primaryMuscle": "lats",
    "secondaryMuscles": [
      "abs",
      "traps",
      "forearms",
      "glutes"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 3\u20135 REPS",
    "tempo": "3-1-2-0",
    "tacticalCue": "DEAD HANG TO HORIZONTAL FRONT LEVER TO INVERTED \u00b7 ARMS LOCKED",
    "instructions": [
      "Hang from bar with straight arms.",
      "Pull straight arms down, lifting straight body through a full front lever.",
      "Continue pulling all the way to vertical inverted candle, then lower back."
    ],
    "mistakes": [
      "Bending elbows",
      "Hips arching"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Dead hang straight",
      "endAngle": "Full front lever arc",
      "motionVector": "Full Range Straight-Arm Pull",
      "focalJoints": [
        "Lats",
        "Teres Major",
        "Total Core"
      ],
      "tacticalCues": [
        {
          "label": "Straight arm pivot",
          "x": 50,
          "y": 20
        },
        {
          "label": "Iron horizontal plane",
          "x": 50,
          "y": 45
        }
      ]
    }
  },
  {
    "id": "quads-pistol-jump",
    "name": "EXPLOSIVE PISTOL SQUAT JUMP",
    "tier": "brutal",
    "primaryMuscle": "quads",
    "secondaryMuscles": [
      "glutes",
      "calves"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 5 REPS / LEG",
    "tempo": "EXPLOSIVE",
    "tacticalCue": "DEEP SINGLE-LEG PISTOL \u00b7 EXPLODE COMPLETELY OFF DECK \u00b7 SOFT LANDING",
    "instructions": [
      "Descend to full depth on one leg into a pistol squat.",
      "From bottom, explode upward with maximum force, leaping airborne off floor.",
      "Absorb landing back into bottom of next repetition."
    ],
    "mistakes": [
      "Stiff knee landing",
      "Non-working leg touching"
    ],
    "blueprint": {
      "figureType": "squat",
      "startAngle": "Deep pistol bottom",
      "endAngle": "Single-leg airborne jump",
      "motionVector": "Ballistic Unilateral Power",
      "focalJoints": [
        "Quadriceps",
        "Gluteus Maximus",
        "Achilles"
      ],
      "tacticalCues": [
        {
          "label": "Single-leg explosive launch",
          "x": 50,
          "y": 80
        },
        {
          "label": "Airborne height clearance",
          "x": 50,
          "y": 40
        }
      ]
    }
  },
  {
    "id": "hamstrings-full-nordic-curl",
    "name": "FULL CONCENTRIC NORDIC HAMSTRING CURL",
    "tier": "brutal",
    "primaryMuscle": "hamstrings",
    "secondaryMuscles": [
      "glutes",
      "calves"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 4\u20136 REPS",
    "tempo": "3-1-2-0",
    "tacticalCue": "LOWER CHEST TO DECK \u00b7 PULL BACK TO UPRIGHT USING HAMSTRINGS ONLY",
    "instructions": [
      "Anchor ankles firmly under bar or partner.",
      "Lower torso forward with rigid hips until chest grazes floor.",
      "Without pushing with hands, contract hamstrings violently to pull torso back to upright."
    ],
    "mistakes": [
      "Piking hips backward",
      "Using hand push"
    ],
    "blueprint": {
      "figureType": "bridge",
      "startAngle": "Upright Kneel",
      "endAngle": "Chest touches deck and returns",
      "motionVector": "Concentric Knee Flexion",
      "focalJoints": [
        "Biceps Femoris",
        "Semitendinosus"
      ],
      "tacticalCues": [
        {
          "label": "Ankle anchor pivot",
          "x": 15,
          "y": 75
        },
        {
          "label": "Pure hamstring pull",
          "x": 45,
          "y": 60
        }
      ]
    }
  },
  {
    "id": "abs-dragon-flag-full",
    "name": "FULL DRAGON FLAG STRICT REPETITIONS",
    "tier": "brutal",
    "primaryMuscle": "abs",
    "secondaryMuscles": [
      "lats",
      "glutes",
      "quads",
      "lower_back"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 5\u20136 REPS",
    "tempo": "3-1-1-0",
    "tacticalCue": "BODY RIGID AS STEEL SPEAR \u00b7 ONLY UPPER SHOULDERS TOUCH BENCH",
    "instructions": [
      "Grip bench behind head, raise body vertically onto shoulders.",
      "Lower straight body down until hovering 2 inches above bench.",
      "Pause for 1 second, then raise back to vertical without bending hips."
    ],
    "mistakes": [
      "Piking hips at waist",
      "Resting hips on bench"
    ],
    "blueprint": {
      "figureType": "leg_raise",
      "startAngle": "Vertical candlestick",
      "endAngle": "Horizontal full spear hover",
      "motionVector": "Extreme Full-Body Leverage",
      "focalJoints": [
        "Rectus Abdominis",
        "Lats",
        "Hip Extensors"
      ],
      "tacticalCues": [
        {
          "label": "Shoulder fulcrum point",
          "x": 20,
          "y": 60
        },
        {
          "label": "Steel spear body line",
          "x": 65,
          "y": 60
        }
      ]
    }
  },
  {
    "id": "core-human-flag",
    "name": "FULL HUMAN FLAG HOLD",
    "tier": "brutal",
    "primaryMuscle": "obliques",
    "secondaryMuscles": [
      "deltoids",
      "lats",
      "abs"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "4 \u00d7 8\u201312s HOLD / SIDE",
    "tempo": "ISOMETRIC",
    "tacticalCue": "BOTTOM ARM PUSHES \u00b7 TOP ARM PULLS \u00b7 BODY HORIZONTAL SPEAR",
    "instructions": [
      "Grip vertical pole with bottom palm facing away (push) and top palm facing pole (pull).",
      "Kick legs up and lock body into a strict horizontal flight line.",
      "Push hard through bottom shoulder while pulling hard with top lat.",
      "Hold horizontal line with legs pinned together and toes pointed."
    ],
    "mistakes": [
      "Hips sagging toward ground",
      "Twisting chest upward"
    ],
    "blueprint": {
      "figureType": "plank",
      "startAngle": "Pole grip lock",
      "endAngle": "Horizontal flag suspension",
      "motionVector": "Lateral Anti-Gravitational Shear",
      "focalJoints": [
        "Obliques",
        "Lats",
        "Shoulder Girdle"
      ],
      "tacticalCues": [
        {
          "label": "Vertical pole anchor",
          "x": 20,
          "y": 50
        },
        {
          "label": "Suspended horizontal spear",
          "x": 65,
          "y": 50
        }
      ]
    }
  },
  {
    "id": "delts-freestanding-hspu",
    "name": "FREESTANDING HANDSTAND PUSH-UP",
    "tier": "brutal",
    "primaryMuscle": "deltoids",
    "secondaryMuscles": [
      "triceps",
      "traps",
      "abs"
    ],
    "equipment": "FLOOR",
    "prescription": "4 \u00d7 3\u20135 REPS",
    "tempo": "2-1-1-0",
    "tacticalCue": "ZERO WALL ASSIST \u00b7 FREESTANDING BALANCE \u00b7 LOWER NOSE TO DECK",
    "instructions": [
      "Kick up into a freestanding handstand with zero wall support.",
      "Grip floor with fingertips for micro-balance adjustments.",
      "Lower head forward to touch floor, maintaining tight hollow alignment.",
      "Press straight up through shoulders back to handstand balance."
    ],
    "mistakes": [
      "Falling out of balance",
      "Over-arching back into scorpion"
    ],
    "blueprint": {
      "figureType": "handstand",
      "startAngle": "Freestanding Inverted Balance",
      "endAngle": "Freestanding Deltoid Dip",
      "motionVector": "Zero-Anchor Overhead Press",
      "focalJoints": [
        "Anterior/Lateral Deltoid",
        "Wrist Stability",
        "Core Tension"
      ],
      "tacticalCues": [
        {
          "label": "Zero wall support",
          "x": 50,
          "y": 20
        },
        {
          "label": "Fingertip balance adjustments",
          "x": 50,
          "y": 80
        }
      ]
    }
  },
  {
    "id": "fullbody-devils-burpee-complex",
    "name": "DEVIL'S 100-REP TACTICAL BURPEE COMPLEX",
    "tier": "brutal",
    "primaryMuscle": "chest",
    "secondaryMuscles": [
      "quads",
      "lats",
      "deltoids",
      "abs",
      "calves"
    ],
    "equipment": "PULL-UP BAR",
    "prescription": "100 REPS FOR TIME",
    "tempo": "IRON CADENCE",
    "tacticalCue": "BURPEE TO FLOOR \u00b7 EXPLOSIVE JUMP TO PULLUP BAR \u00b7 CHIN OVER BAR",
    "instructions": [
      "Drop chest to floor in strict military pushup.",
      "Snap feet forward and explode vertically under pull-up bar.",
      "Grab bar mid-air and pull chin over bar in one fluid strike.",
      "Drop to deck and immediately repeat. Unforgiving mental test."
    ],
    "mistakes": [
      "Pacing too fast early",
      "Cutting pushup or pullup depth"
    ],
    "blueprint": {
      "figureType": "pullup",
      "startAngle": "Floor Burpee Pushup",
      "endAngle": "Mid-Air Pull-Up Clearance",
      "motionVector": "Total Operational Conditioning",
      "focalJoints": [
        "Entire Kinetic Chain",
        "Vascular Endurance"
      ],
      "tacticalCues": [
        {
          "label": "Chest deck strike",
          "x": 50,
          "y": 85
        },
        {
          "label": "Vertical leap to bar",
          "x": 50,
          "y": 20
        }
      ]
    }
  }
];

export const FULL_BODY_ROUTINES: FullBodyRoutine[] = [
  {
    "id": "routine-tier1-bootcamp",
    "name": "OPERATION BOOTCAMP // BEGINNER FULL-BODY FOUNDATION",
    "tier": "beginner",
    "tagline": "Establish neuromuscular baseline across all primary kinetic chains.",
    "totalTime": "32 MIN",
    "rounds": "3 ROUNDS \u00b7 60s REST BETWEEN ROUNDS",
    "exerciseIds": [
      "chest-incline-pushup",
      "quads-air-squat",
      "lats-dead-hang",
      "hamstrings-glute-bridge",
      "abs-plank-hold",
      "triceps-bench-dip",
      "calves-double-leg-raise"
    ],
    "description": "Fundamental calisthenics routine targeting push, pull, knee flexion, hip extension, and core anti-extension."
  },
  {
    "id": "routine-tier2-operator",
    "name": "OPERATION PHALANX // ADVANCED OPERATOR CIRCUIT",
    "tier": "advanced",
    "tagline": "Build unbreakable bodyweight density and strict mechanical strength.",
    "totalTime": "42 MIN",
    "rounds": "4 ROUNDS \u00b7 75s REST BETWEEN ROUNDS",
    "exerciseIds": [
      "chest-standard-pushup",
      "lats-strict-pullup",
      "quads-bulgarian-split-squat",
      "triceps-parallel-dip",
      "quads-cossack-squat",
      "abs-hanging-knee-raise",
      "delts-pike-pushup",
      "abs-hollow-body-hold"
    ],
    "description": "Military-grade conditioning protocol incorporating unilateral leg drive, strict vertical pulling, and dips."
  },
  {
    "id": "routine-tier3-vanguard",
    "name": "OPERATION VANGUARD // PRO ATHLETIC MASTERY",
    "tier": "pro",
    "tagline": "Master advanced leverage, asymmetric pressing, and unilateral balance.",
    "totalTime": "48 MIN",
    "rounds": "4 ROUNDS \u00b7 90s REST BETWEEN ROUNDS",
    "exerciseIds": [
      "chest-archer-pushup",
      "lats-wide-pullup",
      "quads-pistol-squat",
      "delts-wall-handstand-pushup",
      "hamstrings-nordic-curl-tuck",
      "abs-hanging-leg-raise",
      "core-lsit-hold",
      "triceps-straight-bar-dip"
    ],
    "description": "High-intensity calisthenic routine developing pistol squats, archer pushups, toes-to-bar, and wall handstand presses."
  },
  {
    "id": "routine-tier4-special-forces",
    "name": "OPERATION RECON STRIKE // MILITARY SPECIAL FORCES",
    "tier": "military",
    "tagline": "Classified combat conditioning protocol testing speed, power, and mental grit.",
    "totalTime": "55 MIN",
    "rounds": "5 ROUNDS \u00b7 90s REST BETWEEN ROUNDS",
    "exerciseIds": [
      "lats-bar-muscleup",
      "chest-clapping-pushup",
      "quads-shrimp-squat",
      "lats-chest-to-bar-pullup",
      "delts-strict-hspu-wall",
      "abs-windshield-wipers",
      "abs-front-lever-tuck",
      "fullbody-navy-seal-burpee"
    ],
    "description": "Elite operational roster featuring muscle-ups, clapping pushups, strict deficit handstands, and Navy Seal 8-counts."
  },
  {
    "id": "routine-tier5-blackout",
    "name": "OPERATION BLACKOUT // BRUTAL APEX WARRIOR ROSTER",
    "tier": "brutal",
    "tagline": "Apex human gymnastic strength and sheer unrelenting physical discipline.",
    "totalTime": "60 MIN",
    "rounds": "5 ROUNDS \u00b7 120s REST BETWEEN ROUNDS",
    "exerciseIds": [
      "chest-planche-pushup",
      "lats-onearm-pullup",
      "delts-freestanding-hspu",
      "quads-pistol-jump",
      "lats-front-lever-pull",
      "core-human-flag",
      "hamstrings-full-nordic-curl",
      "chest-aztec-pushup",
      "fullbody-devils-burpee-complex"
    ],
    "description": "The ultimate test of bodyweight supremacy: one-arm pullups, planche pushups, freestanding handstands, and human flags."
  }
];

export const CALISTHENICS_STRETCHES: StretchItem[] = [
  {
    "id": "stretch-chest-doorway",
    "name": "TACTICAL WALL / CORNER PECTORAL STRETCH",
    "type": "static",
    "primaryMuscle": "chest",
    "targetArea": "Pectoralis Major & Minor, Anterior Shoulder",
    "duration": "45s PER SIDE",
    "protocol": "POST-WORKOUT MOBILITY OR TACTICAL RESET",
    "instructions": [
      "Place forearm and elbow against wall at 90 degrees.",
      "Step forward with same-side leg and gently rotate chest away from wall.",
      "Feel the deep stretch across chest and front shoulder.",
      "Hold for 45s, then raise elbow to 120\u00b0 for lower chest fibers."
    ],
    "keySafetyCheck": "Never force past sharp joint pain in front of shoulder.",
    "blueprintType": "stretch_upper"
  },
  {
    "id": "stretch-lat-hang",
    "name": "PASSIVE DEAD HANG LAT DECOMPRESSION",
    "type": "static",
    "primaryMuscle": "lats",
    "targetArea": "Latissimus Dorsi, Spine Decompression, Shoulders",
    "duration": "60s HOLD",
    "protocol": "POST-PULL REPAIR & SPINAL RECOVERY",
    "instructions": [
      "Grip pull-up bar with overhand grip just outside shoulder width.",
      "Completely relax all back and shoulder muscles; allow gravity to elongate spine.",
      "Take deep diaphragmatic breaths expanding ribcage.",
      "Release slowly to deck without jumping down abruptly."
    ],
    "keySafetyCheck": "Use neutral grip if shoulder impingement is present.",
    "blueprintType": "stretch_upper"
  },
  {
    "id": "stretch-arm-circles",
    "name": "DYNAMIC OVERHEAD SCAPULAR CIRCLES",
    "type": "dynamic",
    "primaryMuscle": "deltoids",
    "targetArea": "Shoulder Rotator Cuff, Deltoids, Upper Traps",
    "duration": "20 REPS EACH DIRECTION",
    "protocol": "PRE-WORKOUT DRILL FOR PRESSING SESSIONS",
    "instructions": [
      "Stand tall, extend both arms laterally at shoulder height.",
      "Perform controlled small circles, expanding to huge sweeping rotations.",
      "Reverse smoothly into backward rotations after 20 reps."
    ],
    "keySafetyCheck": "Keep core locked so lumbar doesn't hyperextend.",
    "blueprintType": "stretch_upper"
  },
  {
    "id": "stretch-overhead-triceps",
    "name": "OVERHEAD ELBOW TRICEPS & LAT STRETCH",
    "type": "static",
    "primaryMuscle": "triceps",
    "targetArea": "Triceps Long Head, Lat Insertion",
    "duration": "30s PER SIDE",
    "protocol": "POST-PUSH REPAIR",
    "instructions": [
      "Reach one arm overhead, bend elbow so hand drops behind neck.",
      "Use opposite hand to gently draw elevated elbow backward.",
      "Keep torso upright and chin up off chest."
    ],
    "keySafetyCheck": "Do not flare ribs or arch lower back.",
    "blueprintType": "stretch_upper"
  },
  {
    "id": "stretch-biceps-wall",
    "name": "WALL BICEPS & CHEST OPENER",
    "type": "static",
    "primaryMuscle": "biceps",
    "targetArea": "Biceps Brachii, Anterior Shoulder, Wrist Flexors",
    "duration": "45s PER SIDE",
    "protocol": "POST-PULL RECOVERY",
    "instructions": [
      "Place palm flat against wall at shoulder height, fingers pointing behind you.",
      "Straighten arm and slowly rotate chest away from wall.",
      "Feel the stretch run through palm, forearm, and bicep belly."
    ],
    "keySafetyCheck": "Keep elbow soft, do not aggressively hyperextend joint.",
    "blueprintType": "stretch_upper"
  },
  {
    "id": "stretch-wrist-rotations",
    "name": "DYNAMIC QUADRUPED WRIST MOBILIZATION",
    "type": "dynamic",
    "primaryMuscle": "forearms",
    "targetArea": "Wrist Flexors, Extensors, Carpal Tunnel Defense",
    "duration": "15 REPS EACH DIRECTION",
    "protocol": "PRE-WORKOUT DRILL FOR HANDSTANDS & PLANCHES",
    "instructions": [
      "Start on hands and knees with palms flat on floor, fingers pointing back toward knees.",
      "Gently lean hips back to stretch forearms.",
      "Flip hands so backs of hands rest on deck, lightly curling fingers into fists."
    ],
    "keySafetyCheck": "Ease into pressure gradually; wrists require gentle adaptation.",
    "blueprintType": "stretch_upper"
  },
  {
    "id": "stretch-cobra-spine",
    "name": "COBRA / SPHINX ABDOMINAL & SPINAL RECOVERY",
    "type": "static",
    "primaryMuscle": "abs",
    "targetArea": "Rectus Abdominis, Hip Flexors, Thoracic Extension",
    "duration": "45s HOLD",
    "protocol": "POST-CORE RESET",
    "instructions": [
      "Lie prone on deck with palms flat under shoulders.",
      "Press gently into palms to lift chest while keeping hips glued to deck.",
      "Draw shoulders down and elongate spine through crown of head."
    ],
    "keySafetyCheck": "Engage glutes lightly to protect lumbar from pinching.",
    "blueprintType": "stretch_core"
  },
  {
    "id": "stretch-seated-twist",
    "name": "SEATED SPINAL OBLIQUE TWIST",
    "type": "static",
    "primaryMuscle": "obliques",
    "targetArea": "Internal & External Obliques, Thoracic Rotators",
    "duration": "30s PER SIDE",
    "protocol": "ROTATIONAL MOBILITY RESET",
    "instructions": [
      "Sit tall with legs straight, cross right foot over left knee.",
      "Place left elbow outside right knee and right hand on floor behind hip.",
      "Inhale to lengthen spine, exhale to rotate torso to the right."
    ],
    "keySafetyCheck": "Keep both sit bones rooted firmly on deck.",
    "blueprintType": "stretch_core"
  },
  {
    "id": "stretch-childs-pose",
    "name": "EXTENDED TACTICAL CHILD'S POSE",
    "type": "static",
    "primaryMuscle": "lower_back",
    "targetArea": "Thoracolumbar Fascia, Erector Spinae, Lat Wings",
    "duration": "60s HOLD",
    "protocol": "DEEP SPINAL DECOMPRESSION",
    "instructions": [
      "Kneel with big toes touching and knees spread wide.",
      "Walk hands forward along deck, lowering forehead to floor.",
      "Sink hips back onto heels and breathe into lower back."
    ],
    "keySafetyCheck": "Completely relax neck and jaw.",
    "blueprintType": "stretch_core"
  },
  {
    "id": "stretch-hip-couch",
    "name": "TACTICAL COUCH / WALL QUAD & HIP FLEXOR",
    "type": "static",
    "primaryMuscle": "quads",
    "targetArea": "Quadriceps (Rectus Femoris) & Psoas Hip Flexors",
    "duration": "60s PER LEG",
    "protocol": "LOWER BODY MOBILITY & HIP UNLOCK",
    "instructions": [
      "Kneel in front of wall with rear shin vertical against wall, toes pointing up.",
      "Step other foot out into 90\u00b0 lunge in front.",
      "Squeeze rear glute hard, driving hips forward while keeping torso upright."
    ],
    "keySafetyCheck": "Keep rear glute locked to protect lower back.",
    "blueprintType": "stretch_lower"
  },
  {
    "id": "stretch-hamstring-pancake",
    "name": "SEATED HAMSTRING & POSTERIOR CHAIN SWEEP",
    "type": "static",
    "primaryMuscle": "hamstrings",
    "targetArea": "Biceps Femoris, Semitendinosus, Calves",
    "duration": "45s HOLD",
    "protocol": "POST-LEGS SPRINT & MARCH RECOVERY",
    "instructions": [
      "Sit on deck with legs extended straight in front, toes toward shins.",
      "Hinge forward from hips with a flat back, reaching chest toward feet.",
      "Deepen stretch with each exhale."
    ],
    "keySafetyCheck": "Bend knees slightly if pulling is felt behind knee joint.",
    "blueprintType": "stretch_lower"
  },
  {
    "id": "stretch-pigeon-glute",
    "name": "ELEVATED PIGEON GLUTE STRETCH",
    "type": "static",
    "primaryMuscle": "glutes",
    "targetArea": "Gluteus Maximus, Piriformis, Deep Hip Rotators",
    "duration": "60s PER SIDE",
    "protocol": "POST-SQUAT MOBILITY RESET",
    "instructions": [
      "Place front shin across bench or floor at roughly 90 degrees.",
      "Extend rear leg straight behind, squaring hips toward deck.",
      "Fold torso forward over front shin and breathe deeply."
    ],
    "keySafetyCheck": "No twisting stress on front knee joint.",
    "blueprintType": "stretch_lower"
  },
  {
    "id": "stretch-calf-wall",
    "name": "TACTICAL WALL CALF & ACHILLES DRIVE",
    "type": "static",
    "primaryMuscle": "calves",
    "targetArea": "Gastrocnemius, Soleus, Achilles Tendon",
    "duration": "45s PER LEG",
    "protocol": "MARCHING & JUMP SQUAT DEFENSE",
    "instructions": [
      "Stand facing wall with hands placed flat at chest height.",
      "Step one leg back 3 feet, driving rear heel firmly into deck.",
      "Keep rear knee locked straight, then slightly bend to target soleus."
    ],
    "keySafetyCheck": "Ensure rear toes point dead straight forward.",
    "blueprintType": "stretch_lower"
  },
  {
    "id": "stretch-neck-cervical",
    "name": "CERVICAL 4-WAY ISOMETRIC STRETCH",
    "type": "dynamic",
    "primaryMuscle": "neck",
    "targetArea": "Sternocleidomastoid, Splenius Capitis, Traps",
    "duration": "30s TOTAL",
    "protocol": "POST-HANDSTAND & LOAD CARRIAGE REPAIR",
    "instructions": [
      "Gently tilt right ear to right shoulder, place right hand on head with light pressure.",
      "Repeat on left side, followed by tucking chin to chest.",
      "Breathe smoothly and never yank cervical spine."
    ],
    "keySafetyCheck": "Zero sudden or jerky motions.",
    "blueprintType": "stretch_upper"
  },
  {
    "id": "stretch-thread-needle",
    "name": "THREAD THE NEEDLE THORACIC OPENER",
    "type": "dynamic",
    "primaryMuscle": "traps",
    "targetArea": "Rhomboids, Middle Traps, Thoracic Spine",
    "duration": "10 REPS / SIDE",
    "protocol": "SCAPULAR MOBILITY DRILL",
    "instructions": [
      "Start on all fours. Slide right arm under left armpit along floor.",
      "Lower right shoulder and temple to deck.",
      "Press left hand into floor to rotate upper back toward ceiling."
    ],
    "keySafetyCheck": "Hips stay centered over knees.",
    "blueprintType": "stretch_upper"
  }
];
