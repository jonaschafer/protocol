-- Seed data for PT Foundation protocol

-- Insert protocol
INSERT INTO protocols (id, name, description, active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'PT Foundation (Weeks 1-4)',
  'Physical therapy foundation program focusing on adductor weakness, abductor maintenance, and ITBS management',
  true
);

-- Insert sessions
INSERT INTO sessions (id, protocol_id, day_of_week, name, duration_minutes, session_type) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 2, 'Tuesday Strength', 30, 'main'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 4, 'Thursday Strength', 30, 'main'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 1, 'Monday Micro - Adductor Weakness', 15, 'micro'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 3, 'Wednesday Micro - Abductor Maintenance', 15, 'micro'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 5, 'Friday Micro - Knee/ITBS', 15, 'micro'),
  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 6, 'Saturday Rest - Calves Only', 2, 'rest'),
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 0, 'Sunday Rest - Calves Only', 2, 'rest');

-- Tuesday Strength exercises
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Trap Bar Deadlift', 3, '8', 95, 'lbs', NULL, 1, false, true, 'Monitor hip flexor'),
  ('10000000-0000-0000-0000-000000000001', 'Copenhagen Plank', 3, '20sec', NULL, NULL, NULL, 2, true, false, 'PT priority - 2x/week minimum'),
  ('10000000-0000-0000-0000-000000000001', 'Wall Sit', 3, '30sec', NULL, NULL, NULL, 3, true, false, 'ITBS management'),
  ('10000000-0000-0000-0000-000000000001', 'Single-Leg Calf Raise', 3, 'AMRAP', NULL, NULL, NULL, 4, true, false, 'Daily until 30 reps. Current: L:14, R:19'),
  ('10000000-0000-0000-0000-000000000001', 'Farmer''s Carry', 2, '50ft', 35, 'lbs', 'each hand', 5, false, false, NULL),
  ('10000000-0000-0000-0000-000000000001', 'Band Rows', 2, '15', NULL, NULL, 'black band', 6, false, false, NULL);

-- Thursday Strength exercises
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('10000000-0000-0000-0000-000000000002', 'Bulgarian Split Squat', 3, '8 each', 20, 'lbs', 'dumbbells', 1, false, true, 'Monitor hip flexor'),
  ('10000000-0000-0000-0000-000000000002', 'Single-Leg RDL', 3, '8 each', 35, 'lbs', NULL, 2, false, false, NULL),
  ('10000000-0000-0000-0000-000000000002', 'Copenhagen Plank', 3, '20sec', NULL, NULL, NULL, 3, true, false, 'PT priority - 2x/week minimum'),
  ('10000000-0000-0000-0000-000000000002', 'Single-Leg Calf Raise', 3, 'AMRAP', NULL, NULL, NULL, 4, true, false, 'Daily until 30 reps. Current: L:14, R:19'),
  ('10000000-0000-0000-0000-000000000002', 'Goblet Squat', 3, '10', 35, 'lbs', 'kettlebell', 5, false, false, NULL),
  ('10000000-0000-0000-0000-000000000002', 'Push-ups', 2, '10-15', NULL, NULL, NULL, 6, false, false, NULL);

-- Monday Micro - Adductor Weakness exercises
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('10000000-0000-0000-0000-000000000003', 'Copenhagen Plank', 3, '20sec', NULL, NULL, NULL, 1, true, false, 'PT priority - 2x/week minimum'),
  ('10000000-0000-0000-0000-000000000003', 'Hip Marches', 2, '15', NULL, NULL, NULL, 2, false, false, 'Standing, knee drive'),
  ('10000000-0000-0000-0000-000000000003', 'Single-Leg Glute Bridge', 4, '8', 20, 'lbs', NULL, 3, false, false, 'PT prescribed 4 sets'),
  ('10000000-0000-0000-0000-000000000003', 'Standing Clams', 2, '15', NULL, NULL, 'red band', 4, false, false, NULL),
  ('10000000-0000-0000-0000-000000000003', 'Side-Lying Adduction', 2, '15', NULL, NULL, 'red band', 5, false, false, NULL),
  ('10000000-0000-0000-0000-000000000003', 'Single-Leg Calf Raise', 3, 'AMRAP', NULL, NULL, NULL, 6, true, false, 'Daily until 30 reps. Current: L:14, R:19');

-- Wednesday Micro - Abductor Maintenance exercises
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('10000000-0000-0000-0000-000000000004', 'Monster Walks', 3, '18ft', NULL, NULL, 'black band', 1, false, false, NULL),
  ('10000000-0000-0000-0000-000000000004', 'Side Walks w/ Band', 3, '9ft', NULL, NULL, 'black band', 2, false, false, NULL),
  ('10000000-0000-0000-0000-000000000004', 'Jane Fondas', 3, '15 each', NULL, NULL, 'red band', 3, false, false, 'Side-lying hip abduction'),
  ('10000000-0000-0000-0000-000000000004', 'Single-Leg Balance', 3, '30sec', NULL, NULL, NULL, 4, false, false, 'Eyes closed'),
  ('10000000-0000-0000-0000-000000000004', 'Single-Leg Calf Raise', 3, 'AMRAP', NULL, NULL, NULL, 5, true, false, 'Daily until 30 reps. Current: L:14, R:19');

-- Friday Micro - Knee/ITBS exercises
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('10000000-0000-0000-0000-000000000005', 'Wall Sit', 3, '30sec', NULL, NULL, NULL, 1, true, false, 'ITBS management'),
  ('10000000-0000-0000-0000-000000000005', 'Step-Downs', 2, '20', NULL, NULL, '24" box', 2, false, true, 'Monitor knee'),
  ('10000000-0000-0000-0000-000000000005', 'Single-Leg Calf Raise', 3, 'AMRAP', NULL, NULL, NULL, 3, true, false, 'Daily until 30 reps. Current: L:14, R:19');

-- Saturday Rest - Calves Only exercise
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('10000000-0000-0000-0000-000000000006', 'Single-Leg Calf Raise', 2, 'AMRAP', NULL, NULL, NULL, 1, true, false, 'Recovery day - just calves');

-- Sunday Rest - Calves Only exercise
INSERT INTO session_exercises (session_id, exercise_name, sets, target_reps, target_weight, weight_unit, equipment, order_index, is_non_negotiable, injury_warning, notes) VALUES
  ('10000000-0000-0000-0000-000000000007', 'Single-Leg Calf Raise', 2, 'AMRAP', NULL, NULL, NULL, 1, true, false, 'Recovery day - just calves');
