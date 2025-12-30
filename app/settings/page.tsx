'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrainingPlan, getCurrentWeekNumber } from '@/lib/queries';
import { supabase } from '@/lib/supabase';
import Navigation from '../components/Navigation';
import { BookOpen, AlertTriangle, Save } from 'lucide-react';

export default function SettingsPage() {
  const [trainingPlan, setTrainingPlan] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Editable plan fields
  const [goalRace, setGoalRace] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Placeholder state for preferences (no logic yet)
  const [distanceUnits, setDistanceUnits] = useState('miles');
  const [defaultPreRunFuel, setDefaultPreRunFuel] = useState('');
  const [defaultDuringRunNutrition, setDefaultDuringRunNutrition] = useState('');

  useEffect(() => {
    loadPlanData();
  }, []);

  useEffect(() => {
    // Check if there are changes
    if (trainingPlan) {
      const changed =
        goalRace !== (trainingPlan.goal_race || '') ||
        raceDate !== (trainingPlan.end_date || '');
      setHasChanges(changed);
    }
  }, [goalRace, raceDate, trainingPlan]);

  const loadPlanData = async () => {
    setIsLoading(true);
    try {
      const [plan, weekNum] = await Promise.all([
        getTrainingPlan(),
        getCurrentWeekNumber()
      ]);
      setTrainingPlan(plan);
      setCurrentWeek(weekNum);

      // Set initial values for editing
      setGoalRace(plan?.goal_race || '');
      setRaceDate(plan?.end_date || '');
    } catch (error) {
      console.error('Error loading plan data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!trainingPlan?.id) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase
        .from('training_plans')
        .update({
          goal_race: goalRace,
          end_date: raceDate
        })
        .eq('id', trainingPlan.id);

      if (error) throw error;

      setSaveMessage({ type: 'success', text: 'Plan updated successfully!' });
      setHasChanges(false);

      // Reload plan data
      await loadPlanData();

      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving plan:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
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
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-blue-100 text-sm mt-1">Manage your training preferences</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Plan Info Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Plan Info</h2>

          <div className="space-y-4">
            {/* Editable Goal Race */}
            <div>
              <label htmlFor="goal-race" className="text-sm font-medium text-gray-700 block mb-1">
                Goal Race
              </label>
              <input
                id="goal-race"
                type="text"
                value={goalRace}
                onChange={(e) => setGoalRace(e.target.value)}
                placeholder="e.g., Wy'East Wonder 50M - September 7, 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              />
            </div>

            {/* Editable Race Date */}
            <div>
              <label htmlFor="race-date" className="text-sm font-medium text-gray-700 block mb-1">
                Race Date
              </label>
              <input
                id="race-date"
                type="date"
                value={raceDate}
                onChange={(e) => setRaceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              />
            </div>

            {/* Warning about date changes */}
            {hasChanges && raceDate !== trainingPlan?.end_date && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900 mb-1">
                      Important: Date Change Notice
                    </p>
                    <p className="text-xs text-amber-800">
                      Changing the race date will update the end date in your plan. However, shifting all workout dates requires manual updates in Supabase.
                      Weekly workouts and content will stay the same, only the dates would need to be adjusted.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            )}

            {/* Save Message */}
            {saveMessage && (
              <div className={`rounded-lg p-3 ${
                saveMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm font-medium">{saveMessage.text}</p>
              </div>
            )}

            {/* Read-only Plan Info */}
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Current Week</label>
                  <p className="text-gray-900">{currentWeek}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Total Weeks</label>
                  <p className="text-gray-900">{trainingPlan?.total_weeks || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Start Date</label>
                <p className="text-gray-900">{formatDate(trainingPlan?.start_date)}</p>
              </div>

              <Link
                href="/plan"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm min-h-[44px]"
              >
                <BookOpen className="w-5 h-5" />
                <span>View Full Training Plan</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="distance-units" className="text-sm font-medium text-gray-700 block mb-1">
                Distance Units
              </label>
              <select
                id="distance-units"
                value={distanceUnits}
                onChange={(e) => setDistanceUnits(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              >
                <option value="miles">Miles</option>
                <option value="kilometers">Kilometers</option>
              </select>
            </div>

            <div>
              <label htmlFor="pre-run-fuel" className="text-sm font-medium text-gray-700 block mb-1">
                Default Pre-Run Fuel
              </label>
              <input
                id="pre-run-fuel"
                type="text"
                value={defaultPreRunFuel}
                onChange={(e) => setDefaultPreRunFuel(e.target.value)}
                placeholder="e.g., Banana, coffee"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              />
            </div>

            <div>
              <label htmlFor="during-run-nutrition" className="text-sm font-medium text-gray-700 block mb-1">
                Default During-Run Nutrition
              </label>
              <input
                id="during-run-nutrition"
                type="text"
                value={defaultDuringRunNutrition}
                onChange={(e) => setDefaultDuringRunNutrition(e.target.value)}
                placeholder="e.g., GU gels, tailwind"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                Note: Preferences will be saved in a future update
              </p>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>

          <div className="space-y-3">
            <button
              disabled
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed min-h-[44px]"
            >
              Export Training Data
            </button>

            <button
              disabled
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed min-h-[44px]"
            >
              Clear All Logs
            </button>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-amber-800">
                Note: Data management features coming soon
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">App Name</label>
              <p className="text-gray-900">Protocol Training Tracker</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Version</label>
              <p className="text-gray-900">1.0.0</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
              <p className="text-gray-900">Training plan tracker for Wy'East Wonder 50M</p>
            </div>

            <div className="pt-2">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm min-h-[44px] flex items-center"
              >
                View Training Plan Documentation
              </a>
            </div>
          </div>
        </div>

      </div>

      <Navigation />
    </div>
  );
}
