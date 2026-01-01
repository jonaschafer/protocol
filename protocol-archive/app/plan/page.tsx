'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getPhaseWeeks, getCurrentWeekByDate, getWeekWorkouts, getWeekLogs, getTrainingPlan, getTrainingPhases } from '@/lib/queries';
import Navigation from '../components/Navigation';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Mountain, Route, Clock, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'Recovery' | 'Foundation' | 'Durability' | 'Specificity';

interface PhaseInfo {
  name: Phase;
  dateRange: string;
  weekRange: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

// Phase colors mapping
const PHASE_COLORS: Record<string, { color: string; borderColor: string; bgColor: string }> = {
  'Recovery': {
    color: 'text-amber-700',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-50'
  },
  'Foundation': {
    color: 'text-green-700',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-50'
  },
  'Durability': {
    color: 'text-blue-700',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50'
  },
  'Specificity': {
    color: 'text-purple-700',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50'
  }
};

interface WeekData {
  week_number: number;
  phase: string;
  week_theme?: string;
  start_date: string;
  end_date: string;
  target_miles?: number;
  target_vert?: number;
  summary?: {
    actualMiles: number;
    actualVert: number;
    workoutsCompleted: number;
    totalWorkouts: number;
  };
}

interface WorkoutDetails {
  daily_workouts: any[];
}

function PlanPageContent() {
  const searchParams = useSearchParams();
  const [expandedPhases, setExpandedPhases] = useState<Phase[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo[]>([]);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [weeksData, setWeeksData] = useState<Record<string, WeekData[]>>({});
  const [weekWorkouts, setWeekWorkouts] = useState<Record<number, any>>({});
  const [weekLogs, setWeekLogs] = useState<Record<number, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [trainingPlan, setTrainingPlan] = useState<any>(null);
  const weekRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Handle query params
    const phase = searchParams.get('phase') as Phase | null;
    const week = searchParams.get('week');

    if (phase && phaseInfo.length > 0 && phaseInfo.find(p => p.name.toLowerCase() === phase.toLowerCase())) {
      const phaseName = phaseInfo.find(p => p.name.toLowerCase() === phase.toLowerCase())!.name;
      if (!expandedPhases.includes(phaseName)) {
        setExpandedPhases([phaseName]);
      }
    }

    if (week) {
      const weekNumber = parseInt(week);
      if (weekNumber >= 0 && weekNumber <= 36) {
        setExpandedWeeks(new Set([weekNumber]));

        // Scroll to week after a short delay to ensure rendering
        setTimeout(() => {
          weekRefs.current[weekNumber]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 500);
      }
    }
  }, [searchParams]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [current, plan, phases] = await Promise.all([
        getCurrentWeekByDate(),
        getTrainingPlan(),
        getTrainingPhases()
      ]);
      setCurrentWeek(current);
      setTrainingPlan(plan);

      // Build phase info from database
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      };

      const phaseInfoFromDB: PhaseInfo[] = phases.map((phase: any) => ({
        name: phase.name as Phase,
        dateRange: `${formatDate(phase.start_date)} - ${formatDate(phase.end_date)}`,
        weekRange: phase.week_start === phase.week_end
          ? `Week ${phase.week_start}`
          : `Weeks ${phase.week_start}-${phase.week_end}`,
        ...PHASE_COLORS[phase.name as Phase]
      }));

      setPhaseInfo(phaseInfoFromDB);

      // Load all phases
      const [recoveryWeeks, foundationWeeks, durabilityWeeks, specificityWeeks] = await Promise.all([
        getPhaseWeeks('Recovery'),
        getPhaseWeeks('Foundation'),
        getPhaseWeeks('Durability'),
        getPhaseWeeks('Specificity')
      ]);

      setWeeksData({
        Recovery: recoveryWeeks,
        Foundation: foundationWeeks,
        Durability: durabilityWeeks,
        Specificity: specificityWeeks
      });

      // Expand current phase by default
      const currentPhase = getPhaseForWeek(current);
      setExpandedPhases([currentPhase]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPhaseForWeek = (weekNumber: number): Phase => {
    if (weekNumber === 0) return 'Recovery';
    if (weekNumber <= 12) return 'Foundation';
    if (weekNumber <= 28) return 'Durability';
    return 'Specificity';
  };

  const togglePhase = (phase: Phase) => {
    setExpandedPhases(prev =>
      prev.includes(phase)
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    );
  };

  const toggleWeek = async (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);

    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);

      // Load week details if not already loaded
      if (!weekWorkouts[weekNumber]) {
        try {
          const [workouts, logs] = await Promise.all([
            getWeekWorkouts(weekNumber),
            getWeekLogs(weekNumber)
          ]);

          setWeekWorkouts(prev => ({ ...prev, [weekNumber]: workouts }));
          setWeekLogs(prev => ({ ...prev, [weekNumber]: logs }));
        } catch (error) {
          console.error('Error loading week details:', error);
        }
      }
    }

    setExpandedWeeks(newExpanded);
  };

  const getPhaseColor = (phaseName: string): string => {
    switch (phaseName) {
      case 'Foundation': return 'green-500';
      case 'Durability': return 'blue-500';
      case 'Specificity': return 'purple-500';
      default: return 'gray-500';
    }
  };

  const getWeekStatus = (week: WeekData): { color: string; text: string } => {
    const completed = week.summary?.workoutsCompleted || 0;
    const total = week.summary?.totalWorkouts || 0;

    if (total === 0 || week.week_number > currentWeek) {
      return { color: 'bg-gray-100 text-gray-600', text: 'Not Started' };
    }

    if (completed === total) {
      return { color: 'bg-green-100 text-green-700', text: `Complete (${completed}/${total})` };
    }

    if (completed > 0) {
      return { color: 'bg-amber-100 text-amber-700', text: `${completed}/${total} Completed` };
    }

    return { color: 'bg-gray-100 text-gray-600', text: `0/${total}` };
  };

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `${startStr} - ${endStr}`;
  };

  const getWorkoutTypeColor = (type: string): string => {
    switch (type) {
      case 'run': return 'border-blue-500 bg-blue-50';
      case 'strength': return 'border-purple-500 bg-purple-50';
      case 'rowing': return 'border-teal-500 bg-teal-50';
      case 'rest': return 'border-gray-300 bg-gray-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case 'run': return <Route className="w-4 h-4 text-blue-600" />;
      case 'strength': return <Dumbbell className="w-4 h-4 text-purple-600" />;
      case 'rowing': return <Clock className="w-4 h-4 text-teal-600" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const isWorkoutLogged = (workoutId: string, logs: any[]): boolean => {
    return logs?.some(log => log.daily_workout_id === workoutId && log.workout_completed) || false;
  };

  const getStrengthSessionSummary = (workout: any): string => {
    if (!workout.strength_exercises) return workout.strength_session_type || 'Strength';

    try {
      const exercises = JSON.parse(workout.strength_exercises);
      const exerciseNames = exercises.slice(0, 2).map((ex: any) => {
        const sets = ex.sets || '';
        const reps = ex.reps || '';
        return `${ex.exercise}${sets && reps ? ` ${sets}x${reps}` : ''}`;
      });

      const summary = exerciseNames.join(', ');
      const more = exercises.length > 2 ? ` +${exercises.length - 2} more` : '';

      return `${workout.strength_session_type || 'Strength'}: ${summary}${more}`;
    } catch {
      return workout.strength_session_type || 'Strength';
    }
  };

  const getPhaseStats = (phaseName: Phase) => {
    const weeks = weeksData[phaseName] || [];
    const totalMiles = weeks.reduce((sum, w) => sum + (w.target_miles || 0), 0);
    const totalVert = weeks.reduce((sum, w) => sum + (w.target_vert || 0), 0);
    return { totalMiles, totalVert };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading training plan...</p>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            {trainingPlan?.plan_name || 'Training Plan'}
          </h1>
          <p className="text-blue-100 text-sm">
            {trainingPlan?.goal_race || 'Wy\'East Wonder 50M Training Plan'}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-3">
        {/* Phase Sections */}
        {phaseInfo.map((phase) => {
          const isExpanded = expandedPhases.includes(phase.name);
          const weeks = weeksData[phase.name] || [];
          const stats = getPhaseStats(phase.name);

          return (
            <div
              key={phase.name}
              className={`bg-white rounded-lg shadow-sm border-l-4 ${phase.borderColor} overflow-hidden`}
            >
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.name)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors min-h-[44px]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h2 className={`text-xl font-bold ${phase.color}`}>
                      {phase.name} Phase
                    </h2>
                    <p className="text-sm text-gray-600">{phase.dateRange}</p>
                    <p className="text-xs text-gray-500 mt-1">{phase.weekRange}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Phase Stats */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className={`${phase.bgColor} rounded-lg p-2`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Route className={`w-4 h-4 ${phase.color}`} />
                      <p className={`text-xs font-medium ${phase.color}`}>Target Miles</p>
                    </div>
                    <p className={`text-lg font-bold ${phase.color}`}>
                      {stats.totalMiles.toFixed(0)}
                    </p>
                  </div>

                  <div className={`${phase.bgColor} rounded-lg p-2`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Mountain className={`w-4 h-4 ${phase.color}`} />
                      <p className={`text-xs font-medium ${phase.color}`}>Target Vert</p>
                    </div>
                    <p className={`text-lg font-bold ${phase.color}`}>
                      {(stats.totalVert / 1000).toFixed(0)}k ft
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Phase Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 p-3 space-y-2">
                      {weeks.map((week) => {
                        const isCurrent = week.week_number === currentWeek;
                        const isFuture = week.week_number > currentWeek;
                        const isExpanded = expandedWeeks.has(week.week_number);
                        const status = getWeekStatus(week);
                        const workouts = weekWorkouts[week.week_number]?.daily_workouts || [];
                        const logs = weekLogs[week.week_number] || [];

                        return (
                          <div
                            key={week.week_number}
                            ref={(el) => { weekRefs.current[week.week_number] = el; }}
                            className={`bg-white rounded-lg border shadow-sm ${
                              isCurrent ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
                            } ${isFuture ? 'opacity-60' : ''}`}
                          >
                            {/* Week Header */}
                            <button
                              onClick={() => toggleWeek(week.week_number)}
                              className="w-full p-3 text-left min-h-[44px]"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-bold text-gray-900">Week {week.week_number}</h3>
                                    {isCurrent && (
                                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {formatDateRange(week.start_date, week.end_date)}
                                  </p>
                                  {week.week_theme && (
                                    <p className="text-xs text-gray-500 mt-1 italic">{week.week_theme}</p>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                                    {status.text}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                              </div>

                              {/* Week Stats */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div className="bg-blue-50 rounded p-2 text-center">
                                  <div className="flex items-center justify-center space-x-1 mb-1">
                                    <Route className="w-3 h-3 text-blue-600" />
                                    <p className="text-xs text-blue-600 font-medium">Miles</p>
                                  </div>
                                  <p className="text-sm font-bold text-blue-900">
                                    {week.summary?.actualMiles?.toFixed(1) || '0.0'}
                                    {week.target_miles && (
                                      <span className="text-xs text-blue-600 font-normal">
                                        /{week.target_miles}
                                      </span>
                                    )}
                                  </p>
                                </div>

                                <div className="bg-orange-50 rounded p-2 text-center">
                                  <div className="flex items-center justify-center space-x-1 mb-1">
                                    <Mountain className="w-3 h-3 text-orange-600" />
                                    <p className="text-xs text-orange-600 font-medium">Vert</p>
                                  </div>
                                  <p className="text-sm font-bold text-orange-900">
                                    {week.summary?.actualVert?.toLocaleString() || '0'}
                                    {week.target_vert && (
                                      <span className="text-xs text-orange-600 font-normal">
                                        /{week.target_vert.toLocaleString()}
                                      </span>
                                    )}
                                  </p>
                                </div>

                                <div className="bg-green-50 rounded p-2 text-center">
                                  <div className="flex items-center justify-center space-x-1 mb-1">
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    <p className="text-xs text-green-600 font-medium">Done</p>
                                  </div>
                                  <p className="text-sm font-bold text-green-900">
                                    {week.summary?.workoutsCompleted || 0}/{week.summary?.totalWorkouts || 7}
                                  </p>
                                </div>

                                <div className="bg-purple-50 rounded p-2 text-center">
                                  <div className="flex items-center justify-center space-x-1 mb-1">
                                    <Dumbbell className="w-3 h-3 text-purple-600" />
                                    <p className="text-xs text-purple-600 font-medium">Strength</p>
                                  </div>
                                  <p className="text-sm font-bold text-purple-900">
                                    {workouts.filter((w: any) => w.workout_type === 'strength').length}
                                    <span className="text-xs text-purple-600 font-normal"> sessions</span>
                                  </p>
                                </div>
                              </div>
                            </button>

                            {/* Expanded Week Details - 7-Day Summary */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="border-t border-gray-100 p-3 space-y-2">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                      Week Details
                                    </h4>

                                    {workouts.length > 0 ? (
                                      <div className="space-y-2">
                                        {workouts.map((workout: any) => {
                                          const logged = isWorkoutLogged(workout.id, logs);
                                          const workoutDate = new Date(workout.workout_date);
                                          const formattedDate = workoutDate.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                          });

                                          return (
                                            <Link
                                              key={workout.id}
                                              href={`/today?date=${workout.workout_date}`}
                                            >
                                              <div className={`border-l-4 rounded p-2 hover:shadow-md transition-shadow ${getWorkoutTypeColor(workout.workout_type)}`}>
                                                <div className="flex items-start justify-between mb-1">
                                                  <div className="flex items-center space-x-2">
                                                    {getWorkoutIcon(workout.workout_type)}
                                                    <div>
                                                      <p className="text-sm font-bold text-gray-900">
                                                        {workout.day_of_week}
                                                      </p>
                                                      <p className="text-xs text-gray-600">{formattedDate}</p>
                                                    </div>
                                                  </div>

                                                  {logged ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                  ) : (
                                                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                                  )}
                                                </div>

                                                {/* Workout Details */}
                                                {workout.workout_type === 'run' && (
                                                  <div className="flex items-center space-x-3 text-xs text-gray-700 mt-1">
                                                    <span className="font-medium">{workout.run_distance_miles} mi</span>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="font-medium">{workout.run_vert_feet} ft</span>
                                                    {workout.run_effort && (
                                                      <>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="text-gray-600">{workout.run_effort}</span>
                                                      </>
                                                    )}
                                                  </div>
                                                )}

                                                {workout.workout_type === 'strength' && (
                                                  <div className="text-xs mt-1">
                                                    {workout.strength_session_type && (
                                                      <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium mr-2">
                                                        {workout.strength_session_type}
                                                      </span>
                                                    )}
                                                    {workout.strength_duration_minutes && (
                                                      <span className="text-gray-600">{workout.strength_duration_minutes} min</span>
                                                    )}
                                                    {workout.strength_exercises && (
                                                      <div className="text-gray-700 mt-1">
                                                        {(() => {
                                                          try {
                                                            const exercises = JSON.parse(workout.strength_exercises);
                                                            const exerciseList = exercises.slice(0, 2).map((ex: any, idx: number) => {
                                                              const sets = ex.sets || '';
                                                              const reps = ex.reps || '';
                                                              const setsReps = sets && reps ? ` ${sets}x${reps}` : '';
                                                              return (
                                                                <span key={idx}>
                                                                  {idx > 0 && ', '}
                                                                  {ex.exercise}{setsReps}
                                                                </span>
                                                              );
                                                            });
                                                            const more = exercises.length > 2 ? ` +${exercises.length - 2} more` : '';
                                                            return (
                                                              <>
                                                                {exerciseList}
                                                                {more && <span className="text-gray-500">{more}</span>}
                                                              </>
                                                            );
                                                          } catch {
                                                            return null;
                                                          }
                                                        })()}
                                                      </div>
                                                    )}
                                                  </div>
                                                )}

                                                {workout.workout_type === 'rowing' && (
                                                  <div className="text-xs text-gray-700 mt-1">
                                                    {workout.rowing_duration_minutes && (
                                                      <span className="font-medium">{workout.rowing_duration_minutes} min</span>
                                                    )}
                                                    {workout.rowing_effort && (
                                                      <span className="text-gray-600"> • {workout.rowing_effort}</span>
                                                    )}
                                                  </div>
                                                )}

                                                {workout.workout_type === 'rest' && (
                                                  <p className="text-xs text-gray-600 mt-1">Rest day - Recovery and PT</p>
                                                )}
                                              </div>
                                            </Link>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div className="text-center py-4">
                                        <p className="text-sm text-gray-500">Loading workouts...</p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <Navigation />
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan...</p>
        </div>
      </div>
    }>
      <PlanPageContent />
    </Suspense>
  );
}
