-- Fix: Ensure all required columns exist in weekly_plans table
DO $$
BEGIN
  -- Check if weekly_plans table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'weekly_plans') THEN
    
    -- Add start_date if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'start_date'
    ) THEN
      ALTER TABLE weekly_plans ADD COLUMN start_date DATE NOT NULL DEFAULT CURRENT_DATE;
      RAISE NOTICE 'Added start_date column to weekly_plans table';
    END IF;
    
    -- Add end_date if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'end_date'
    ) THEN
      ALTER TABLE weekly_plans ADD COLUMN end_date DATE NOT NULL DEFAULT CURRENT_DATE;
      RAISE NOTICE 'Added end_date column to weekly_plans table';
    END IF;
    
    -- Add week_number if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'week_number'
    ) THEN
      ALTER TABLE weekly_plans ADD COLUMN week_number INTEGER NOT NULL DEFAULT 1;
      RAISE NOTICE 'Added week_number column to weekly_plans table';
    END IF;
    
    -- Add week_theme if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'week_theme'
    ) THEN
      ALTER TABLE weekly_plans ADD COLUMN week_theme TEXT;
      RAISE NOTICE 'Added week_theme column to weekly_plans table';
    END IF;
    
    -- Add target_miles if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'target_miles'
    ) THEN
      ALTER TABLE weekly_plans ADD COLUMN target_miles DECIMAL;
      RAISE NOTICE 'Added target_miles column to weekly_plans table';
    END IF;
    
    -- Add target_vert if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'target_vert'
    ) THEN
      ALTER TABLE weekly_plans ADD COLUMN target_vert INTEGER;
      RAISE NOTICE 'Added target_vert column to weekly_plans table';
    END IF;
    
    -- Add notes if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'notes'
    ) THEN
      ALTER TABLE weekly_plans ADD COLUMN notes TEXT;
      RAISE NOTICE 'Added notes column to weekly_plans table';
    END IF;
    
    -- Add phase_id if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'phase_id'
    ) THEN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'training_phases') THEN
        ALTER TABLE weekly_plans 
        ADD COLUMN phase_id UUID REFERENCES training_phases(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_weekly_plans_phase_id ON weekly_plans(phase_id);
        RAISE NOTICE 'Added phase_id column to weekly_plans table';
      END IF;
    END IF;
    
    -- Add plan_id if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' AND column_name = 'plan_id'
    ) THEN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'training_plans') THEN
        ALTER TABLE weekly_plans 
        ADD COLUMN plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE;
        CREATE INDEX IF NOT EXISTS idx_weekly_plans_plan_id ON weekly_plans(plan_id);
        RAISE NOTICE 'Added plan_id column to weekly_plans table';
      END IF;
    END IF;
    
    -- Remove NOT NULL constraints if they were added with defaults (after data is inserted)
    -- This allows existing rows to work, but we'll need to update them
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'weekly_plans' 
      AND column_name = 'start_date' 
      AND column_default IS NOT NULL
    ) THEN
      -- Check if there are any rows
      IF (SELECT COUNT(*) FROM weekly_plans) > 0 THEN
        RAISE NOTICE 'Warning: weekly_plans table has rows. You may need to update start_date/end_date values.';
      END IF;
    END IF;
    
  ELSE
    RAISE EXCEPTION 'weekly_plans table does not exist. Please run migration 001 first.';
  END IF;
END $$;
