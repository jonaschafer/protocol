'use client';

import { useState } from 'react';
import { X, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { createDailyLog, type DailyLogData } from '@/lib/queries';
import type { TodaysWorkout } from '@/lib/queries';

interface LogWorkoutModalProps {
  workout: TodaysWorkout;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LogWorkoutModal({ workout, onClose, onSuccess }: LogWorkoutModalProps) {
  const [formData, setFormData] = useState<Partial<DailyLogData>>({
    daily_workout_id: workout.id,
    log_date: new Date().toISOString().split('T')[0],
    workout_completed: true,
  });

  const [niggles, setNiggles] = useState<Array<{ location: string; severity: number; description: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [strengthSetsLogged, setStrengthSetsLogged] = useState<Record<string, Array<{ set: number; reps: number; weight: number; unit: string; notes: string }>>>({});
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [loggedSets, setLoggedSets] = useState<Record<string, Set<number>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter to only include logged sets
      const loggedStrengthSets: any = {};
      Object.entries(strengthSetsLogged).forEach(([exerciseName, sets]) => {
        const filtered = sets.filter((set: any) =>
          loggedSets[exerciseName]?.has(set.set)
        );
        if (filtered.length > 0) {
          loggedStrengthSets[exerciseName] = filtered;
        }
      });

      await createDailyLog({
        ...formData,
        niggles: niggles.length > 0 ? niggles : undefined,
        strength_sets_logged: Object.keys(loggedStrengthSets).length > 0 ? loggedStrengthSets : undefined,
      } as DailyLogData);

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to log workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNiggle = () => {
    setNiggles([...niggles, { location: '', severity: 5, description: '' }]);
  };

  const removeNiggle = (index: number) => {
    setNiggles(niggles.filter((_, i) => i !== index));
  };

  const updateNiggle = (index: number, field: string, value: any) => {
    const updated = [...niggles];
    updated[index] = { ...updated[index], [field]: value };
    setNiggles(updated);
  };

  const toggleExerciseExpansion = (exerciseName: string, targetSets?: number) => {
    const newExpanded = new Set(expandedExercises);

    if (newExpanded.has(exerciseName)) {
      newExpanded.delete(exerciseName);
    } else {
      newExpanded.add(exerciseName);

      // Initialize sets if not already done
      if (!strengthSetsLogged[exerciseName]) {
        const defaultSets = targetSets || 3;
        const initialSets = Array.from({ length: defaultSets }, (_, i) => ({
          set: i + 1,
          reps: 0,
          weight: 0,
          unit: 'lbs',
          notes: ''
        }));
        setStrengthSetsLogged({
          ...strengthSetsLogged,
          [exerciseName]: initialSets
        });
      }
    }

    setExpandedExercises(newExpanded);
  };

  const updateSet = (exerciseName: string, setIndex: number, field: string, value: any) => {
    const exerciseSets = [...(strengthSetsLogged[exerciseName] || [])];
    exerciseSets[setIndex] = { ...exerciseSets[setIndex], [field]: value };
    setStrengthSetsLogged({
      ...strengthSetsLogged,
      [exerciseName]: exerciseSets
    });
  };

  const addSet = (exerciseName: string) => {
    const exerciseSets = strengthSetsLogged[exerciseName] || [];
    const newSetNumber = exerciseSets.length + 1;
    setStrengthSetsLogged({
      ...strengthSetsLogged,
      [exerciseName]: [
        ...exerciseSets,
        { set: newSetNumber, reps: 0, weight: 0, unit: 'lbs', notes: '' }
      ]
    });
  };

  const removeSet = (exerciseName: string, setIndex: number) => {
    const exerciseSets = strengthSetsLogged[exerciseName] || [];
    if (exerciseSets.length <= 1) return; // Don't remove if only one set

    const updatedSets = exerciseSets
      .filter((_, i) => i !== setIndex)
      .map((set, i) => ({ ...set, set: i + 1 })); // Renumber sets

    setStrengthSetsLogged({
      ...strengthSetsLogged,
      [exerciseName]: updatedSets
    });
  };

  const toggleSetLogged = (exerciseName: string, setNumber: number) => {
    // Check current state BEFORE any updates
    const isCurrentlyLogged = loggedSets[exerciseName]?.has(setNumber) || false;
    console.log('Toggle clicked:', exerciseName, 'Set', setNumber, 'Currently logged:', isCurrentlyLogged);

    // If currently logged (green "Done"), clear the set data when toggling back to "Log"
    if (isCurrentlyLogged) {
      console.log('Clearing set data for', exerciseName, 'Set', setNumber);
      const exerciseSets = strengthSetsLogged[exerciseName] || [];
      const setIndex = exerciseSets.findIndex(s => s.set === setNumber);

      if (setIndex !== -1) {
        const updatedSets = [...exerciseSets];
        updatedSets[setIndex] = {
          set: setNumber,
          reps: 0,
          weight: 0,
          unit: 'lbs',
          notes: ''
        };

        setStrengthSetsLogged({
          ...strengthSetsLogged,
          [exerciseName]: updatedSets
        });
        console.log('Data cleared, set to:', updatedSets[setIndex]);
      }
    }

    // Toggle logged state AFTER clearing data
    setLoggedSets(prev => {
      const prevSet = prev[exerciseName] || new Set();
      const newSet = new Set(prevSet); // Create a NEW Set (don't modify in place)

      if (newSet.has(setNumber)) {
        console.log('Removing from logged sets');
        newSet.delete(setNumber);
      } else {
        console.log('Adding to logged sets');
        newSet.add(setNumber);
      }

      return {
        ...prev,
        [exerciseName]: newSet
      };
    });
  };

  const isSetLogged = (exerciseName: string, setNumber: number) => {
    return loggedSets[exerciseName]?.has(setNumber) || false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Log Workout</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 space-y-6">

          {/* Run Fields */}
          {workout.workout_type === 'run' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Run Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance (miles)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={workout.run_distance_miles?.toString()}
                    onChange={(e) => setFormData({ ...formData, run_distance_miles: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vert (ft)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={workout.run_vert_feet?.toString()}
                    onChange={(e) => setFormData({ ...formData, run_vert_feet: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time (hours)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1.5"
                    onChange={(e) => setFormData({ ...formData, run_time_hours: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avg Pace</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10:30"
                    onChange={(e) => setFormData({ ...formData, run_pace_per_mile: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RPE: {formData.run_rpe || 5}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.run_rpe || 5}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  onChange={(e) => setFormData({ ...formData, run_rpe: parseInt(e.target.value) })}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Easy</span>
                  <span>Moderate</span>
                  <span>Hard</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={workout.run_route || 'Route name'}
                  onChange={(e) => setFormData({ ...formData, run_route: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Strength Fields */}
          {(workout.workout_type === 'strength' || workout.strength_session_type) && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Strength Session</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={workout.strength_duration_minutes?.toString() || '30'}
                  onChange={(e) => setFormData({ ...formData, strength_duration_minutes: parseInt(e.target.value) })}
                />
              </div>

              {workout.strength_exercises && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exercises</label>
                  <div className="space-y-3">
                    {JSON.parse(workout.strength_exercises).map((ex: any, idx: number) => {
                      const isExpanded = expandedExercises.has(ex.exercise);
                      const exerciseSets = strengthSetsLogged[ex.exercise] || [];

                      return (
                        <div key={idx} className="border border-purple-200 bg-purple-50 rounded-lg overflow-hidden">
                          {/* Exercise Header */}
                          <div className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{ex.exercise}</h4>
                                <p className="text-sm text-gray-600">
                                  Target: {ex.sets} x {ex.reps || ex.reps_range || 'prescribed reps'}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleExerciseExpansion(ex.exercise, ex.sets)}
                                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 font-medium min-h-[44px] px-3"
                              >
                                <span>{isExpanded ? 'Collapse' : 'Log Sets'}</span>
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Set Logging Form */}
                          {isExpanded && (
                            <div className="border-t border-purple-200 bg-white p-3 space-y-3">
                              {exerciseSets.map((set, setIdx) => (
                                <div key={setIdx} className="border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm text-gray-700">Set {set.set}</span>
                                    {exerciseSets.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeSet(ex.exercise, setIdx)}
                                        className="p-1 text-red-600 hover:text-red-700"
                                        aria-label="Remove set"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Reps Input */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Reps</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={set.reps || ''}
                                        onChange={(e) => updateSet(ex.exercise, setIdx, 'reps', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px]"
                                        placeholder="0"
                                      />
                                    </div>

                                    {/* Weight Input */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Weight</label>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={set.weight || ''}
                                        onChange={(e) => updateSet(ex.exercise, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px]"
                                        placeholder="0"
                                      />
                                    </div>

                                    {/* Unit Selector */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
                                      <select
                                        value={set.unit}
                                        onChange={(e) => updateSet(ex.exercise, setIdx, 'unit', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px] bg-white"
                                      >
                                        <option value="lbs">lbs</option>
                                        <option value="kg">kg</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Notes Input */}
                                  <div className="mt-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Notes (optional)</label>
                                    <input
                                      type="text"
                                      value={set.notes}
                                      onChange={(e) => updateSet(ex.exercise, setIdx, 'notes', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px]"
                                      placeholder="How did this set feel?"
                                    />
                                  </div>

                                  {/* Log Button */}
                                  <div className="mt-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleSetLogged(ex.exercise, set.set)}
                                      className={`w-full min-h-[44px] font-medium rounded-lg transition-colors ${
                                        isSetLogged(ex.exercise, set.set)
                                          ? 'bg-green-600 hover:bg-green-700 text-white'
                                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                                      }`}
                                    >
                                      {isSetLogged(ex.exercise, set.set) ? 'Done' : 'Log'}
                                    </button>
                                  </div>
                                </div>
                              ))}

                              {/* Add Set Button */}
                              <button
                                type="button"
                                onClick={() => addSet(ex.exercise)}
                                className="flex items-center justify-center space-x-1 w-full py-2 text-purple-600 hover:text-purple-700 font-medium border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors min-h-[44px]"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Add Set</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rowing Fields */}
          {workout.workout_type === 'rowing' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Rowing</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={workout.rowing_duration_minutes?.toString()}
                    onChange={(e) => setFormData({ ...formData, rowing_duration_minutes: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SPM</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="20"
                    onChange={(e) => setFormData({ ...formData, rowing_spm: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Recovery Metrics */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Recovery Metrics</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sleep (hours)</label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7.5"
                  onChange={(e) => setFormData({ ...formData, sleep_hours: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Quality: {formData.sleep_quality || 7}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.sleep_quality || 7}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  onChange={(e) => setFormData({ ...formData, sleep_quality: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stress: {formData.stress_level || 5}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stress_level || 5}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  onChange={(e) => setFormData({ ...formData, stress_level: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivation: {formData.motivation_level || 7}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.motivation_level || 7}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  onChange={(e) => setFormData({ ...formData, motivation_level: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Niggles */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Niggles</h3>
              <button
                type="button"
                onClick={addNiggle}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {niggles.map((niggle, idx) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Location (e.g., Left knee)"
                    className="flex-1 px-2 py-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    value={niggle.location}
                    onChange={(e) => updateNiggle(idx, 'location', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeNiggle(idx)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Severity: {niggle.severity}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={niggle.severity}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    onChange={(e) => updateNiggle(idx, 'severity', parseInt(e.target.value))}
                  />
                </div>

                <textarea
                  placeholder="Description"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                  value={niggle.description}
                  onChange={(e) => updateNiggle(idx, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="How did the workout feel? Any observations?"
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="border-t p-4 bg-white sticky bottom-0">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isSubmitting ? 'Saving...' : 'Save Workout'}
          </button>
        </div>
      </div>
    </div>
  );
}
