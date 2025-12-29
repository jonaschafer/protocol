'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, addWeeks, differenceInWeeks, isFuture, parseISO } from 'date-fns';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function ConfigurePlanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [raceDate, setRaceDate] = useState<string>('');
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate weeks until race
  const weeksUntilRace = raceDate ? differenceInWeeks(parseISO(raceDate), new Date()) : 0;

  // Calculate recommended start date (32 weeks before race)
  const recommendedStartDate = raceDate ? format(addWeeks(parseISO(raceDate), -32), 'yyyy-MM-dd') : '';

  // Validation for Step 1
  const isStep1Valid = () => {
    if (!raceDate) return false;
    const raceDateObj = parseISO(raceDate);
    return isFuture(raceDateObj) && weeksUntilRace >= 24;
  };

  // Validation for Step 2
  const isStep2Valid = () => {
    if (!hasStarted) return true;
    return currentWeek >= 1 && currentWeek <= 36;
  };

  // Validation for Step 3
  const isStep3Valid = () => {
    if (hasStarted) return true; // Skip this step if already started
    return startDate !== '';
  };

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid()) {
      // Skip step 3 if already started
      setCurrentStep(hasStarted ? 4 : 3);
    } else if (currentStep === 3 && isStep3Valid()) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 4) {
      // Go back to step 2 if already started, otherwise step 3
      setCurrentStep(hasStarted ? 2 : 3);
    }
  };

  const handleGeneratePlan = async () => {
    setCurrentStep(5);
    setIsGenerating(true);

    try {
      const finalStartDate = hasStarted ? new Date() : parseISO(startDate || recommendedStartDate);

      const response = await fetch('/api/reconfigure-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raceDate: raceDate,
          startDate: format(finalStartDate, 'yyyy-MM-dd'),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsGenerating(false);
        setCurrentStep(6);
      } else {
        setIsGenerating(false);
        alert(`Error generating plan: ${result.error}`);
        setCurrentStep(4); // Go back to preview
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      setIsGenerating(false);
      alert('Failed to generate plan. Please try again.');
      setCurrentStep(4); // Go back to preview
    }
  };

  // Calculate phase dates for preview
  const getPhasePreview = () => {
    if (!raceDate) return null;

    const finalStartDate = hasStarted ? new Date() : parseISO(startDate || recommendedStartDate);
    const foundationEnd = addWeeks(finalStartDate, 10);
    const durabilityEnd = addWeeks(finalStartDate, 24);
    const specificityStart = addWeeks(finalStartDate, 24);
    const raceDateObj = parseISO(raceDate);

    return {
      start: format(finalStartDate, 'MMM d, yyyy'),
      foundationEnd: format(foundationEnd, 'MMM d, yyyy'),
      durabilityEnd: format(durabilityEnd, 'MMM d, yyyy'),
      specificityStart: format(specificityStart, 'MMM d'),
      raceDate: format(raceDateObj, 'MMM d, yyyy')
    };
  };

  const phasePreview = getPhasePreview();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/settings')}
            className="inline-flex items-center text-white/90 hover:text-white mb-4 min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Settings
          </button>
          <h1 className="text-2xl font-bold mb-2">Reconfigure Training Plan</h1>
          <p className="text-blue-100 text-sm">Compress your 36-week plan to 32 weeks</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">
        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Race Date</span>
            <span>Status</span>
            <span>Start Date</span>
            <span>Preview</span>
          </div>
        </div>

        {/* Step 1: New Race Date */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Update Your Race Date</h2>
              <p className="text-gray-600">When is your next 100K race?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Race Date
              </label>
              <input
                type="date"
                value={raceDate}
                onChange={(e) => setRaceDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
              />
            </div>

            {raceDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">
                      {weeksUntilRace} weeks from today
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {format(parseISO(raceDate), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {raceDate && !isStep1Valid() && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Date validation</p>
                    <p className="text-sm text-amber-700 mt-1">
                      {!isFuture(parseISO(raceDate))
                        ? 'Race date must be in the future'
                        : 'Race must be at least 24 weeks away for a 32-week plan'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!isStep1Valid()}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px]"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Training Status */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Have you started training?</h2>
              <p className="text-gray-600">This helps us determine your starting point</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 min-h-[44px]">
                <input
                  type="radio"
                  name="training-status"
                  checked={!hasStarted}
                  onChange={() => setHasStarted(false)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">No, I haven't started yet</p>
                  <p className="text-sm text-gray-600">We'll set up a fresh 32-week plan</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 min-h-[44px]">
                <input
                  type="radio"
                  name="training-status"
                  checked={hasStarted}
                  onChange={() => setHasStarted(true)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Yes, I'm currently training</p>
                  <p className="text-sm text-gray-600">We'll adjust from your current week</p>
                </div>
              </label>
            </div>

            {hasStarted && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What week are you currently on?
                </label>
                <select
                  value={currentWeek}
                  onChange={(e) => setCurrentWeek(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] bg-white"
                >
                  {Array.from({ length: 36 }, (_, i) => i + 1).map((week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 min-h-[44px]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!isStep2Valid()}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px]"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Start Date */}
        {currentStep === 3 && !hasStarted && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">When will you start training?</h2>
              <p className="text-gray-600">We recommend starting 32 weeks before your race</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Recommended Start Date</p>
              <p className="text-lg font-bold text-blue-900">
                {recommendedStartDate && format(parseISO(recommendedStartDate), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                This gives you 32 weeks of training
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate || recommendedStartDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 min-h-[44px]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                disabled={!isStep3Valid()}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px]"
              >
                <span>Next</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Plan Compression Preview */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your Compressed Training Plan</h2>
              <p className="text-gray-600">Review the plan structure before generating</p>
            </div>

            {/* Before/After Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 font-bold text-gray-900">Phase</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-900">Original</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-900">New Plan</th>
                    <th className="text-left py-3 px-2 font-bold text-gray-900">Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-900">Foundation</td>
                    <td className="py-3 px-2 text-center text-gray-700">12 weeks</td>
                    <td className="py-3 px-2 text-center font-medium text-blue-600">10 weeks</td>
                    <td className="py-3 px-2 text-sm text-gray-600">2 fewer build weeks (reach 35mpw)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-900">Durability</td>
                    <td className="py-3 px-2 text-center text-gray-700">16 weeks</td>
                    <td className="py-3 px-2 text-center font-medium text-blue-600">14 weeks</td>
                    <td className="py-3 px-2 text-sm text-gray-600">Blocks compressed (3-3-4-4 instead of 4-4-4-4)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium text-gray-900">Specificity</td>
                    <td className="py-3 px-2 text-center text-gray-700">8 weeks</td>
                    <td className="py-3 px-2 text-center font-medium text-green-600">8 weeks</td>
                    <td className="py-3 px-2 text-sm text-gray-600">Unchanged</td>
                  </tr>
                  <tr className="border-t-2 border-gray-300 font-bold">
                    <td className="py-3 px-2 text-gray-900">Total</td>
                    <td className="py-3 px-2 text-center text-gray-700">36 weeks</td>
                    <td className="py-3 px-2 text-center text-blue-600">32 weeks</td>
                    <td className="py-3 px-2 text-sm text-red-600">-4 weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* New Dates */}
            {phasePreview && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <p className="font-bold text-blue-900">Your New Plan Dates</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-700 font-medium">Start</p>
                    <p className="text-blue-900 font-bold">{phasePreview.start}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Foundation ends</p>
                    <p className="text-blue-900">{phasePreview.foundationEnd}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Durability ends</p>
                    <p className="text-blue-900">{phasePreview.durabilityEnd}</p>
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Specificity/Taper</p>
                    <p className="text-blue-900">{phasePreview.specificityStart} - {phasePreview.raceDate}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-blue-300">
                  <p className="text-blue-700 font-medium">Race Day</p>
                  <p className="text-xl font-bold text-blue-900">{phasePreview.raceDate}</p>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900">This will regenerate your entire training plan</p>
                  <p className="text-sm text-amber-700 mt-1">
                    All existing workout data will be replaced with the new compressed plan.
                    Your logged workouts will be preserved.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 min-h-[44px]"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleGeneratePlan}
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 min-h-[44px]"
              >
                <span>Generate Plan</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Generating */}
        {currentStep === 5 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Regenerating your training plan...</h2>
            <p className="text-gray-600">This will take a few moments</p>
          </div>
        )}

        {/* Step 6: Success */}
        {currentStep === 6 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Updated!</h2>
              <p className="text-gray-600">Your compressed 32-week training plan is ready</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="font-bold text-blue-900 mb-2">Summary of Changes</p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• 32-week plan generated (down from 36 weeks)</li>
                <li>• Foundation: 10 weeks</li>
                <li>• Durability: 14 weeks</li>
                <li>• Specificity: 8 weeks</li>
                <li>• Race date: {phasePreview?.raceDate}</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => router.push('/today')}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 min-h-[44px]"
              >
                View Today's Workout
              </button>
              <button
                onClick={() => router.push('/plan')}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 min-h-[44px]"
              >
                View Full Plan
              </button>
            </div>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
