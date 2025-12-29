-- Add strength_sets_logged column to daily_logs table
-- This column stores detailed set-by-set logging for strength exercises
-- Structure: { "exercise_name": [{ set: 1, reps: 10, weight: 95, unit: "lbs", notes: "" }] }

ALTER TABLE daily_logs
ADD COLUMN IF NOT EXISTS strength_sets_logged JSONB;

-- Add comment explaining the structure
COMMENT ON COLUMN daily_logs.strength_sets_logged IS
'Detailed strength exercise logging. Structure: { "exercise_name": [{ "set": 1, "reps": 10, "weight": 95, "unit": "lbs", "notes": "" }] }';

-- Create index for better query performance on JSONB column
CREATE INDEX IF NOT EXISTS idx_daily_logs_strength_sets_logged
ON daily_logs USING gin(strength_sets_logged);
