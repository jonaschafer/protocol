-- Seed data for additional protocols (Hyrox Foundation and Full Hyrox)

-- Insert Hyrox Foundation protocol
INSERT INTO protocols (id, name, description, active)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Hyrox Foundation (Weeks 5-8)',
  'Transition phase building toward Hyrox-specific training with running, strength, and hybrid work',
  false
);

-- Insert Full Hyrox protocol
INSERT INTO protocols (id, name, description, active)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Full Hyrox (Week 9+)',
  'Competition-focused training with full Hyrox simulation workouts and race-specific preparation',
  false
);

-- Insert sessions for Hyrox Foundation (Weeks 5-8)
INSERT INTO sessions (id, protocol_id, day_of_week, name, duration_minutes, session_type) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 1, 'Monday - Easy Run + Strength', 45, 'main'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 2, 'Tuesday - Hybrid Intervals', 40, 'main'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 3, 'Wednesday - Recovery Run', 30, 'micro'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 4, 'Thursday - Strength Focus', 45, 'main'),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 5, 'Friday - Tempo Run', 35, 'main'),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 6, 'Saturday - Long Run', 60, 'main'),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 0, 'Sunday - Active Recovery', 20, 'rest');

-- Sample exercises for Hyrox Foundation Monday
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Easy Run', 1, '3 miles', NULL, NULL, NULL, 1, false, false, 'Zone 2 heart rate'),
  ('20000000-0000-0000-0000-000000000001', 'Goblet Squat', 3, '12', 35, 'lbs', 'kettlebell', 2, false, false, NULL),
  ('20000000-0000-0000-0000-000000000001', 'Push-ups', 3, '15', NULL, NULL, NULL, 3, false, false, NULL),
  ('20000000-0000-0000-0000-000000000001', 'Dumbbell Rows', 3, '12 each', 35, 'lbs', 'dumbbells', 4, false, false, NULL);

-- Sample exercises for Hyrox Foundation Tuesday
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('20000000-0000-0000-0000-000000000002', 'Run Intervals', 5, '400m', NULL, NULL, NULL, 1, false, false, '90sec rest between intervals'),
  ('20000000-0000-0000-0000-000000000002', 'Ski Erg', 5, '250m', NULL, NULL, 'ski erg', 2, false, false, 'Between run intervals'),
  ('20000000-0000-0000-0000-000000000002', 'Wall Balls', 3, '15', 20, 'lbs', 'medicine ball', 3, false, false, NULL);

-- Insert sessions for Full Hyrox (Week 9+)
INSERT INTO sessions (id, protocol_id, day_of_week, name, duration_minutes, session_type) VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 1, 'Monday - Hyrox Simulation', 75, 'main'),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 2, 'Tuesday - Recovery Run', 30, 'micro'),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 3, 'Wednesday - Strength Power', 50, 'main'),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 4, 'Thursday - Station Work', 60, 'main'),
  ('30000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 5, 'Friday - Tempo Run', 40, 'main'),
  ('30000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 6, 'Saturday - Full Simulation', 90, 'main'),
  ('30000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 0, 'Sunday - Rest', 0, 'rest');

-- Sample exercises for Full Hyrox Monday
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('30000000-0000-0000-0000-000000000001', '1K Run', 1, '1000m', NULL, NULL, NULL, 1, true, false, 'Race pace'),
  ('30000000-0000-0000-0000-000000000001', 'Ski Erg', 1, '1000m', NULL, NULL, 'ski erg', 2, true, false, 'Max effort'),
  ('30000000-0000-0000-0000-000000000001', 'Sled Push', 1, '50m', 102, 'lbs', 'sled', 3, true, false, 'Hyrox weight'),
  ('30000000-0000-0000-0000-000000000001', 'Burpee Broad Jump', 1, '80m', NULL, NULL, NULL, 4, true, false, 'Race simulation'),
  ('30000000-0000-0000-0000-000000000001', 'Rowing', 1, '1000m', NULL, NULL, 'rowing machine', 5, true, false, 'Max effort');
