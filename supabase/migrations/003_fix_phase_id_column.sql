-- Fix: Ensure phase_id column exists in weekly_plans table
DO $$
BEGIN
  -- Check if weekly_plans table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'weekly_plans') THEN
    -- Add phase_id column if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'phase_id'
    ) THEN
      -- First, ensure training_phases table exists
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'training_phases') THEN
        ALTER TABLE weekly_plans 
        ADD COLUMN phase_id UUID REFERENCES training_phases(id) ON DELETE CASCADE;
        
        -- Create index if it doesn't exist
        CREATE INDEX IF NOT EXISTS idx_weekly_plans_phase_id ON weekly_plans(phase_id);
        
        RAISE NOTICE 'Added phase_id column to weekly_plans table';
      ELSE
        RAISE EXCEPTION 'training_phases table does not exist. Please run migration 001 first.';
      END IF;
    ELSE
      RAISE NOTICE 'phase_id column already exists in weekly_plans table';
    END IF;
  ELSE
    RAISE EXCEPTION 'weekly_plans table does not exist. Please run migration 001 first.';
  END IF;
END $$;
