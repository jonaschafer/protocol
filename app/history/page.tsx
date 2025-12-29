'use client';

import { useState, useEffect } from 'react';
import { getPhaseWeeks, getRecentLogs, getCurrentWeekNumber } from '@/lib/queries';
import Navigation from '../components/Navigation';
import { ChevronDown, ChevronUp, CheckCircle2, Calendar, Activity, Mountain, Route, Clock, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'Foundation' | 'Durability' | 'Specificity';

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

export default function HistoryPage() {
  const [selectedPhase, setSelectedPhase] = useState<Phase>('Foundation');
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [showCurrentPhaseOnly, setShowCurrentPhaseOnly] = useState(false);
  const [phaseWeeks, setPhaseWeeks] = useState<WeekData[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadPhaseData();
  }, [selectedPhase, showCompletedOnly, showCurrentPhaseOnly]);

  const loadInitialData = async () => {
    try {
      const [current, logs] = await Promise.all([
        getCurrentWeekNumber(),
        getRecentLogs(5)
      ]);
      setCurrentWeek(current);
      setRecentLogs(logs);

      // Determine current phase based on week number
      const currentPhase = current <= 12 ? 'Foundation' : current <= 24 ? 'Durability' : 'Specificity';
      setSelectedPhase(currentPhase as Phase);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadPhaseData = async () => {
    setIsLoading(true);
    try {
      let weeks = await getPhaseWeeks(selectedPhase);

      // Filter by current phase only if toggled
      if (showCurrentPhaseOnly) {
        const currentPhase = currentWeek <= 12 ? 'Foundation' : currentWeek <= 24 ? 'Durability' : 'Specificity';
        if (selectedPhase !== currentPhase) {
          weeks = [];
        }
      }

      // Filter by completion status if toggled
      if (showCompletedOnly) {
        weeks = weeks.filter(week => {
          const completed = week.summary?.workoutsCompleted || 0;
          const total = week.summary?.totalWorkouts || 0;
          return completed === total && total > 0;
        });
      }

      setPhaseWeeks(weeks);
    } catch (error) {
      console.error('Error loading phase data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWeekExpanded = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  const getCompletionBadge = (week: WeekData) => {
    const completed = week.summary?.workoutsCompleted || 0;
    const total = week.summary?.totalWorkouts || 0;

    if (total === 0) {
      return { color: 'bg-gray-100 text-gray-600', text: 'Not Started' };
    }

    if (completed === total) {
      return { color: 'bg-green-100 text-green-700', text: 'Complete' };
    }

    if (completed > 0) {
      return { color: 'bg-amber-100 text-amber-700', text: `${completed}/${total}` };
    }

    return { color: 'bg-gray-100 text-gray-600', text: '0/' + total };
  };

  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case 'run':
        return <Route className="w-4 h-4 text-blue-600" />;
      case 'strength':
        return <Dumbbell className="w-4 h-4 text-purple-600" />;
      case 'rowing':
        return <Activity className="w-4 h-4 text-teal-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Training History</h1>
          <p className="text-blue-100 text-sm">Review your progress and past workouts</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">
        {/* Recent Activity Feed */}
        {recentLogs.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentLogs.map((log, idx) => {
                const workout = log.daily_workout;
                const workoutType = workout?.workout_type || 'rest';
                const hasStrengthSets = log.strength_sets_logged && Object.keys(log.strength_sets_logged).length > 0;

                return (
                  <div key={idx} className="py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getWorkoutTypeIcon(workoutType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formatDate(log.log_date)} - {workout?.day_of_week || 'Workout'}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          {log.run_distance_miles && (
                            <span>{log.run_distance_miles} mi</span>
                          )}
                          {log.run_vert_feet && (
                            <span>{log.run_vert_feet} ft</span>
                          )}
                          {log.strength_duration_minutes && (
                            <span>{log.strength_duration_minutes} min</span>
                          )}
                          {log.rowing_duration_minutes && (
                            <span>{log.rowing_duration_minutes} min rowing</span>
                          )}
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    </div>

                    {/* Show detailed strength sets if logged */}
                    {hasStrengthSets && (
                      <div className="mt-2 ml-8 space-y-2">
                        {Object.entries(log.strength_sets_logged).map(([exerciseName, sets]: [string, any]) => {
                          if (!Array.isArray(sets) || sets.length === 0) return null;

                          return (
                            <div key={exerciseName} className="bg-purple-50 rounded p-2">
                              <p className="text-xs font-medium text-purple-900 mb-1">{exerciseName}</p>
                              <div className="text-xs text-purple-700 space-y-0.5">
                                {sets.map((set: any, setIdx: number) => (
                                  <div key={setIdx} className="flex items-center space-x-2">
                                    <span className="text-purple-600 font-medium">Set {set.set}:</span>
                                    <span>
                                      {set.reps} reps
                                      {set.weight && set.weight > 0 && (
                                        <> @ {set.weight}{set.unit || 'lbs'}</>
                                      )}
                                    </span>
                                    {set.notes && <span className="text-purple-600 italic">({set.notes})</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Phase Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="grid grid-cols-3 gap-2 p-2">
            {(['Foundation', 'Durability', 'Specificity'] as Phase[]).map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`py-3 px-4 rounded-lg font-medium text-sm transition-colors min-h-[44px] ${
                  selectedPhase === phase
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 space-y-3">
          <label className="flex items-center justify-between cursor-pointer min-h-[44px]">
            <span className="text-sm font-medium text-gray-700">Show completed only</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showCompletedOnly}
                onChange={(e) => setShowCompletedOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer min-h-[44px]">
            <span className="text-sm font-medium text-gray-700">Show current phase only</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showCurrentPhaseOnly}
                onChange={(e) => setShowCurrentPhaseOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
        </div>

        {/* Week Cards */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : phaseWeeks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Weeks Found</h3>
            <p className="text-gray-600">
              {showCompletedOnly && 'No completed weeks in this phase yet.'}
              {showCurrentPhaseOnly && !showCompletedOnly && 'No weeks available for the current phase.'}
              {!showCompletedOnly && !showCurrentPhaseOnly && 'No weeks found in this phase.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {phaseWeeks.map((week) => {
              const badge = getCompletionBadge(week);
              const isExpanded = expandedWeeks.has(week.week_number);
              const isCurrent = week.week_number === currentWeek;

              return (
                <div
                  key={week.week_number}
                  className={`bg-white rounded-lg shadow-sm border ${
                    isCurrent ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleWeekExpanded(week.week_number)}
                    className="w-full p-4 text-left min-h-[44px]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-gray-900">Week {week.week_number}</h3>
                          {isCurrent && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{formatDateRange(week.start_date, week.end_date)}</p>
                        {week.week_theme && (
                          <p className="text-xs text-gray-500 mt-1">{week.week_theme}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
                          {badge.text}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-2">
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
                    </div>
                  </button>

                  {/* Expandable Week Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">7-Day Summary</h4>
                          <div className="grid grid-cols-7 gap-1">
                            {['M', 'T', 'W', 'Th', 'F', 'S', 'Su'].map((day, idx) => (
                              <div key={idx} className="text-center">
                                <div className="text-xs text-gray-500 mb-1">{day}</div>
                                <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center">
                                  {/* Placeholder for workout type icon - would need actual data */}
                                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-3 text-center">
                            Click a week number to view full details
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
