'use client'

import { useParams } from 'next/navigation'
import { DayView } from '../../exercises/dayView'

// Dummy data for each day
const dayData: Record<string, {
  date: string;
  dayNumber: number;
  category: string;
  runData?: {
    helper?: string;
    miles: number | string;
    vert?: number | string;
    zone?: number | string;
    rpe?: string;
    route?: string;
  };
  exercises: Array<{
    exerciseName: string;
    sets?: number;
    reps?: number | string;
    weight?: string;
    exerciseNote?: string;
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
        exerciseName: 'Barbell Back Squat',
        sets: 3,
        reps: 8,
        weight: '#135',
        exerciseNote: '60%'
      },
      {
        exerciseName: 'Romanian Deadlift',
        sets: 3,
        reps: 10,
        weight: '#155',
        exerciseNote: '55%'
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
        exerciseName: 'Trap Bar Deadlift',
        sets: 4,
        reps: 6,
        weight: '#185',
        exerciseNote: 'Heavy'
      },
      {
        exerciseName: 'Bulgarian Split Squats',
        sets: 3,
        reps: 10,
        weight: '#40',
        exerciseNote: 'Each leg'
      },
      {
        exerciseName: 'Pull-ups',
        sets: 3,
        reps: 8,
        exerciseNote: 'Bodyweight'
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
        exerciseName: 'Bench Press',
        sets: 3,
        reps: 8,
        weight: '#135',
        exerciseNote: '60%'
      },
      {
        exerciseName: 'Overhead Press',
        sets: 3,
        reps: 8,
        weight: '#85',
        exerciseNote: '55%'
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
      zone: 3,
      rpe: '6-7',
      route: 'Track or road'
    },
    exercises: [
      {
        exerciseName: 'Front Squat',
        sets: 4,
        reps: 5,
        weight: '#155',
        exerciseNote: 'Heavy'
      },
      {
        exerciseName: 'Barbell Rows',
        sets: 4,
        reps: 8,
        weight: '#135',
        exerciseNote: '70%'
      },
      {
        exerciseName: 'Dips',
        sets: 3,
        reps: 10,
        exerciseNote: 'Bodyweight'
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
        exerciseName: 'Sumo Deadlift',
        sets: 3,
        reps: 8,
        weight: '#175',
        exerciseNote: '60%'
      },
      {
        exerciseName: 'Leg Press',
        sets: 3,
        reps: 12,
        weight: '#270',
        exerciseNote: 'Moderate'
      }
    ]
  },
  saturday: {
    date: 'Saturday, Apr 6',
    dayNumber: 13,
    category: 'Durability',
    runData: {
      helper: 'Cross training',
      miles: 'Row',
      rpe: '5-6',
      route: 'Indoor rower'
    },
    exercises: [
      {
        exerciseName: 'Kettlebell Swings',
        sets: 3,
        reps: 15,
        weight: '#53',
        exerciseNote: 'Explosive'
      },
      {
        exerciseName: 'Core Circuit',
        sets: 3,
        reps: '30 sec',
        exerciseNote: 'Plank, Side Plank, Dead Bug'
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
        exerciseName: 'Trap Bar Deadlift',
        sets: 3,
        reps: 8,
        weight: '#165',
        exerciseNote: '60%'
      },
      {
        exerciseName: 'Barbell Back Squat with Pause at Bottom',
        sets: 4,
        reps: 6,
        exerciseNote: '65%'
      }
    ]
  }
};

export default function DayPage() {
  const params = useParams()
  const dayName = params?.dayName as string
  
  // Get data for this day, default to Sunday if not found
  const dayInfo = dayData[dayName?.toLowerCase()] || dayData.sunday

  return (
    <div 
      style={{ 
        background: '#272727', 
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <DayView 
        date={dayInfo.date}
        dayNumber={dayInfo.dayNumber}
        category={dayInfo.category}
        runData={dayInfo.runData}
        exercises={dayInfo.exercises}
      />
    </div>
  )
}

