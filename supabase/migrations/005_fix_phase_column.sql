-- Fix: Handle phase vs phase_id column mismatch
-- Drop "phase" column if it exists (it has NOT NULL constraint causing errors)
-- Ensure "phase_id" column exists instead

DO $$
BEGIN
  -- Check if weekly_plans table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'weekly_plans') THEN
    
    -- Drop "phase" column if it exists (this will remove the NOT NULL constraint error)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'phase'
    ) THEN
      ALTER TABLE weekly_plans DROP COLUMN phase;
      RAISE NOTICE 'Dropped "phase" column';
    END IF;
    
    -- Ensure phase_id exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'phase_id'
    ) THEN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'training_phases') THEN
        ALTER TABLE weekly_plans 
        ADD COLUMN phase_id UUID REFERENCES training_phases(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_weekly_plans_phase_id ON weekly_plans(phase_id);
        RAISE NOTICE 'Added phase_id column';
      ELSE
        RAISE EXCEPTION 'training_phases table does not exist. Please run migration 001 first.';
      END IF;
    END IF;
    
  ELSE
    RAISE EXCEPTION 'weekly_plans table does not exist. Please run migration 001 first.';
  END IF;
END $$;
