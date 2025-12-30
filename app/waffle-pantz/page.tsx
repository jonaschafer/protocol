import WafflePantz from '../components/WafflePantz';

export default function WafflePantzDemo() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          WafflePantz Component Demo
        </h1>

        {/* Instructions */}
        <div className="bg-white/5 rounded-lg p-6 mb-8 text-white/80">
          <h3 className="text-lg font-semibold mb-3 text-white">Interactive Features:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Swipe Left</strong> on any set to reveal delete button (swipe far to auto-delete)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Click "Add set"</strong> to create a new set (copies reps/weight from previous set)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Auto-renumbering</strong> when sets are deleted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span><strong>Touch & Mouse</strong> support for all gestures</span>
            </li>
          </ul>
        </div>

        <div className="grid gap-8">
          {/* Default Example */}
          <div>
            <h2 className="text-xl text-white/70 mb-4">Default (Trap Bar Deadlift)</h2>
            <WafflePantz />
          </div>

          {/* Custom Example */}
          <div>
            <h2 className="text-xl text-white/70 mb-4">Custom (Bench Press)</h2>
            <WafflePantz
              exerciseName="Barbell Bench Press"
              restTime="2 minutes rest between sets"
              cues="Retract scapula, arch lower back slightly. Bar path should be straight up and down. Lower to nipple line. Drive through legs."
              initialSets={[
                { setNumber: 1, reps: 5, weight: 225 },
                { setNumber: 2, reps: 5, weight: 235 },
                { setNumber: 3, reps: 3, weight: 245 },
                { setNumber: 4, reps: 2, weight: 255 },
              ]}
            />
          </div>

          {/* Another Example */}
          <div>
            <h2 className="text-xl text-white/70 mb-4">Custom (Squat)</h2>
            <WafflePantz
              exerciseName="Back Squat"
              restTime="90 seconds rest between sets"
              cues="Bar on rear delts, chest up, knees track over toes. Depth to parallel or below. Drive through heels."
              initialSets={[
                { setNumber: 1, reps: 10, weight: 185 },
                { setNumber: 2, reps: 8, weight: 205 },
                { setNumber: 3, reps: 6, weight: 225 },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
