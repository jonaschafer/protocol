-- Add is_completed field to daily_workouts table
ALTER TABLE daily_workouts 
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;

-- Create index for faster queries on completion status
CREATE INDEX IF NOT EXISTS idx_daily_workouts_is_completed ON daily_workouts(is_completed);
