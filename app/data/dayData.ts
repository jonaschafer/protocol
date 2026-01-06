// Dummy data for each day
export const dayData: Record<string, {
  date: string;
  dayNumber: number;
  category: string;
  runData?: {
    variant?: 'run' | 'row';
    helper?: string;
    miles: number | string;
    vert?: number | string;
    zone?: number | string;
    rpe?: string;
    route?: string;
    pace?: number | string;
    spm?: number | string;
    cues?: string;
  };
  exercises: Array<{
    id: string;
    exerciseName: string;
    sets?: number;
    reps?: number | string;
    weight?: string;
    /** Short descriptive note (e.g., "60%", "Heavy", "Bodyweight"). Should be a single note, not a list of exercises. */
    exerciseNote?: string;
    restNote?: string;
    cues?: string;
  }>;
}> = {
  monday: {
    date: 'Monday, Apr 1',
    dayNumber: 13,
    category: 'Durability',
    runData: {
      helper: 'Easy run',
      miles: 3,
      rpe: '4-5',
      route: 'Neighborhood loop'
    },
    exercises: [
      {
        id: 'barbell-back-squat',
        exerciseName: 'Barbell Back Squat',
        sets: 3,
        reps: 8,
        weight: '#135',
        exerciseNote: '60%',
        restNote: '2-3 minutes rest between sets',
        cues: 'Stand with feet shoulder-width apart, bar on upper back. Lower down by bending knees and hips, keeping chest up and knees tracking over toes. Descend until thighs are parallel to floor, then drive through heels to return to standing.'
      },
      {
        id: 'romanian-deadlift',
        exerciseName: 'Romanian Deadlift',
        sets: 3,
        reps: 10,
        weight: '#155',
        exerciseNote: '55%',
        restNote: '2-3 minutes rest between sets',
        cues: 'Hold bar with feet hip-width apart. Hinge at hips, pushing hips back while keeping back straight and knees slightly bent. Lower bar along legs until you feel stretch in hamstrings, then drive hips forward to return to standing.'
      },
      {
        id: 'leg-curls',
        exerciseName: 'Leg Curls',
        sets: 3,
        reps: 12,
        weight: '#80',
        exerciseNote: 'Moderate',
        restNote: '90 seconds rest between sets',
        cues: 'Lie face down on leg curl machine with pad against back of ankles. Curl heels toward glutes by flexing hamstrings. Squeeze at top, then lower with control. Keep hips pressed into pad throughout movement.'
      },
      {
        id: 'calf-raises',
        exerciseName: 'Standing Calf Raises',
        sets: 3,
        reps: 15,
        weight: '#135',
        exerciseNote: 'Moderate',
        restNote: '60 seconds rest between sets',
        cues: 'Stand with balls of feet on platform, heels hanging off. Rise up onto toes by contracting calves, hold for 1 second at top. Lower with control to full stretch. Keep knees slightly bent throughout.'
      }
    ]
  },
  tuesday: {
    date: 'Tuesday, Apr 2',
    dayNumber: 13,
    category: 'Durability',
    runData: {
      helper: 'Hill workout',
      miles: 6,
      vert: 1500,
      rpe: '7-8',
      route: 'Trail with elevation'
    },
    exercises: [
      {
        id: 'trap-bar-deadlift',
        exerciseName: 'Trap Bar Deadlift',
        sets: 4,
        reps: 6,
        weight: '#185',
        exerciseNote: 'Heavy',
        restNote: '3-4 minutes rest between sets',
        cues: 'Stand inside trap bar with feet hip-width apart. Hinge at hips and knees to lower down and grip handles. Drive through heels and extend hips and knees simultaneously to lift bar. Keep chest up and core braced throughout movement.'
      },
      {
        id: 'bulgarian-split-squats',
        exerciseName: 'Bulgarian Split Squats',
        sets: 3,
        reps: 10,
        weight: '#40',
        exerciseNote: 'Each leg',
        restNote: '90 seconds rest between sets',
        cues: 'Place rear foot on bench behind you, front foot forward. Lower down by bending front knee, keeping torso upright. Descend until front thigh is parallel to floor, then drive through front heel to return to standing.'
      },
      {
        id: 'pull-ups',
        exerciseName: 'Pull-ups',
        sets: 3,
        reps: 8,
        exerciseNote: 'Bodyweight',
        restNote: '2-3 minutes rest between sets',
        cues: 'Hang from bar with palms facing away, hands slightly wider than shoulders. Pull body up by engaging lats and pulling elbows down and back. Bring chin over bar, then lower with control to full arm extension.'
      },
      {
        id: 'barbell-shrugs',
        exerciseName: 'Barbell Shrugs',
        sets: 3,
        reps: 12,
        weight: '#185',
        exerciseNote: 'Moderate',
        restNote: '60 seconds rest between sets',
        cues: 'Hold bar with overhand grip, arms extended. Lift shoulders straight up toward ears, squeezing traps at top. Hold for 1 second, then lower with control. Avoid rolling shoulders forward or backward.'
      }
    ]
  },
  wednesday: {
    date: 'Wednesday, Apr 3',
    dayNumber: 13,
    category: 'Durability',
    runData: {
      helper: 'Recovery run',
      miles: 4,
      rpe: '3-4',
      route: 'Flat terrain'
    },
    exercises: [
      {
        id: 'bench-press',
        exerciseName: 'Bench Press',
        sets: 3,
        reps: 8,
        weight: '#135',
        exerciseNote: '60%',
        restNote: '2-3 minutes rest between sets',
        cues: 'Lie on bench with feet flat on floor. Grip bar slightly wider than shoulders. Lower bar to chest with control, keeping elbows at 45-degree angle. Press bar up explosively, fully extending arms.'
      },
      {
        id: 'overhead-press',
        exerciseName: 'Overhead Press',
        sets: 3,
        reps: 8,
        weight: '#85',
        exerciseNote: '55%',
        restNote: '2-3 minutes rest between sets',
        cues: 'Stand with feet hip-width apart, bar at shoulder height. Grip bar slightly wider than shoulders. Press bar overhead by extending arms, keeping core braced and avoiding excessive arch in back. Lower with control.'
      },
      {
        id: 'tricep-dips',
        exerciseName: 'Tricep Dips',
        sets: 3,
        reps: 10,
        exerciseNote: 'Bodyweight',
        restNote: '90 seconds rest between sets',
        cues: 'Sit on edge of bench with hands gripping edge, fingers forward. Slide forward so body is supported by arms. Lower body by bending elbows, keeping torso upright. Descend until elbows are at 90 degrees, then press up.'
      },
      {
        id: 'lateral-raises',
        exerciseName: 'Lateral Raises',
        sets: 3,
        reps: 12,
        weight: '#15',
        exerciseNote: 'Each arm',
        restNote: '60 seconds rest between sets',
        cues: 'Stand with dumbbells at sides, palms facing in. Raise arms out to sides until parallel to floor, keeping slight bend in elbows. Lower with control, maintaining tension throughout movement.'
      }
    ]
  },
  thursday: {
    date: 'Thursday, Apr 4',
    dayNumber: 13,
    category: 'Durability',
    runData: {
      helper: 'Tempo run',
      miles: 5,
      vert: 500,
      zone: 3,
      rpe: '6-7',
      route: 'Track or road'
    },
    exercises: [
      {
        id: 'front-squat',
        exerciseName: 'Front Squat',
        sets: 4,
        reps: 5,
        weight: '#155',
        exerciseNote: 'Heavy',
        restNote: '3-4 minutes rest between sets',
        cues: 'Rest bar on front deltoids with elbows high. Stand with feet shoulder-width apart. Lower down by bending knees and hips, keeping torso upright and elbows up. Descend until thighs are parallel to floor, then drive through heels to stand.'
      },
      {
        id: 'barbell-rows',
        exerciseName: 'Barbell Rows',
        sets: 4,
        reps: 8,
        weight: '#135',
        exerciseNote: '70%',
        restNote: '2-3 minutes rest between sets',
        cues: 'Bend over with slight knee bend, holding bar with overhand grip. Pull bar to lower chest/upper abdomen by retracting shoulder blades and pulling elbows back. Lower with control, maintaining slight bend in knees.'
      },
      {
        id: 'dips',
        exerciseName: 'Dips',
        sets: 3,
        reps: 10,
        exerciseNote: 'Bodyweight',
        restNote: '90 seconds rest between sets',
        cues: 'Support body on parallel bars with arms extended. Lower body by bending elbows, keeping torso upright. Descend until shoulders are below elbows, then press up to return to starting position.'
      },
      {
        id: 'bicep-curls',
        exerciseName: 'Barbell Bicep Curls',
        sets: 3,
        reps: 10,
        weight: '#65',
        exerciseNote: 'Moderate',
        restNote: '60 seconds rest between sets',
        cues: 'Stand with feet hip-width apart, holding bar with underhand grip. Curl bar toward shoulders by flexing biceps, keeping elbows at sides. Squeeze at top, then lower with control. Avoid swinging or using momentum.'
      }
    ]
  },
  friday: {
    date: 'Friday, Apr 5',
    dayNumber: 13,
    category: 'Durability',
    runData: {
      helper: 'Steady run',
      miles: 7,
      rpe: '5-6',
      route: 'Mixed terrain'
    },
    exercises: [
      {
        id: 'sumo-deadlift',
        exerciseName: 'Sumo Deadlift',
        sets: 3,
        reps: 8,
        weight: '#175',
        exerciseNote: '60%',
        restNote: '2-3 minutes rest between sets',
        cues: 'Stand with feet wide, toes pointed out. Grip bar inside legs with hands shoulder-width apart. Lower hips and keep chest up. Drive through heels and extend hips and knees to lift bar. Keep bar close to body throughout.'
      },
      {
        id: 'leg-press',
        exerciseName: 'Leg Press',
        sets: 3,
        reps: 12,
        weight: '#270',
        exerciseNote: 'Moderate',
        restNote: '2 minutes rest between sets',
        cues: 'Sit in leg press machine with feet shoulder-width apart on platform. Lower weight by bending knees until thighs are parallel to platform. Press through heels to extend legs, keeping core engaged.'
      },
      {
        id: 'walking-lunges',
        exerciseName: 'Walking Lunges',
        sets: 3,
        reps: 12,
        weight: '#40',
        exerciseNote: 'Each leg',
        restNote: '90 seconds rest between sets',
        cues: 'Hold dumbbells at sides, step forward into lunge position. Lower back knee toward ground while keeping front knee over ankle. Drive through front heel to step forward into next lunge. Maintain upright torso throughout.'
      },
      {
        id: 'hip-thrusts',
        exerciseName: 'Hip Thrusts',
        sets: 3,
        reps: 12,
        weight: '#135',
        exerciseNote: 'Moderate',
        restNote: '90 seconds rest between sets',
        cues: 'Sit with upper back against bench, bar across hips. Drive through heels to lift hips, squeezing glutes at top. Lower with control until hips are just above ground. Keep core braced and avoid hyperextending lower back.'
      }
    ]
  },
  saturday: {
    date: 'Saturday, Apr 6',
    dayNumber: 13,
    category: 'Durability',
    runData: {
      variant: 'row',
      miles: 'Row',
      pace: '2:05',
      spm: 22,
      cues: 'Focus on smooth drive phase, strong leg engagement, and controlled recovery. Maintain consistent stroke rate throughout.'
    },
    exercises: [
      {
        id: 'kettlebell-swings',
        exerciseName: 'Kettlebell Swings',
        sets: 3,
        reps: 15,
        weight: '#53',
        exerciseNote: 'Explosive',
        restNote: '60 seconds rest between sets',
        cues: 'Stand with feet slightly wider than shoulders, kettlebell between legs. Hinge at hips and swing kettlebell back between legs. Explosively drive hips forward and swing kettlebell to chest height. Control descent and repeat.'
      },
      {
        id: 'goblet-squats',
        exerciseName: 'Goblet Squats',
        sets: 3,
        reps: 12,
        weight: '#53',
        exerciseNote: 'Moderate',
        restNote: '60 seconds rest between sets',
        cues: 'Hold kettlebell or dumbbell at chest with both hands. Stand with feet shoulder-width apart. Lower into squat by bending knees and hips, keeping chest up. Descend until thighs are parallel to floor, then drive through heels to stand.'
      },
      {
        id: 'farmer-walks',
        exerciseName: 'Farmer Walks',
        sets: 3,
        reps: '50 yards',
        weight: '#70',
        exerciseNote: 'Each hand',
        restNote: '90 seconds rest between sets',
        cues: 'Hold heavy dumbbells or kettlebells at sides with arms extended. Walk forward maintaining upright posture, keeping core braced. Focus on grip strength and maintaining proper alignment throughout walk.'
      }
    ]
  },
  sunday: {
    date: 'Sunday, Apr 7',
    dayNumber: 13,
    category: 'Durability',
    runData: {
      helper: 'Long run',
      miles: 18,
      vert: 2600,
      rpe: '5-6',
      route: 'Wildwood out and back, or a double Nasty'
    },
    exercises: [
      {
        id: 'trap-bar-deadlift',
        exerciseName: 'Trap Bar Deadlift',
        sets: 3,
        reps: 8,
        weight: '#165',
        exerciseNote: '60%',
        restNote: '2-3 minutes rest between sets',
        cues: 'Stand inside trap bar with feet hip-width apart. Hinge at hips and knees to lower down and grip handles. Drive through heels and extend hips and knees simultaneously to lift bar. Keep chest up and core braced throughout movement.'
      },
      {
        id: 'barbell-back-squat-pause',
        exerciseName: 'Barbell Back Squat with Pause at Bottom',
        sets: 4,
        reps: 6,
        exerciseNote: '65%',
        restNote: '3-4 minutes rest between sets',
        cues: 'Perform standard back squat, but pause for 2-3 seconds at the bottom position (thighs parallel to floor). Maintain tension throughout pause, then drive up explosively. This builds strength out of the hole.'
      },
      {
        id: 'good-mornings',
        exerciseName: 'Good Mornings',
        sets: 3,
        reps: 10,
        weight: '#95',
        exerciseNote: 'Moderate',
        restNote: '2 minutes rest between sets',
        cues: 'Place bar on upper back like back squat. Hinge at hips, pushing hips back while keeping back straight and knees slightly bent. Lower until torso is parallel to floor, then drive hips forward to return to standing.'
      },
      {
        id: 'plank-hold',
        exerciseName: 'Plank Hold',
        sets: 3,
        reps: '45 sec',
        exerciseNote: 'Core',
        restNote: '60 seconds rest between sets',
        cues: 'Support body on forearms and toes, body in straight line from head to heels. Keep core braced, hips level, and avoid sagging or raising hips. Breathe normally while maintaining position.'
      }
    ]
  }
};



