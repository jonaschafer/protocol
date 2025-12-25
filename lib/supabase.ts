import { createClient } from '@supabase/supabase-js';
import { ExerciseLog } from './types';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the most recent exercise log for a specific session exercise
 * Used for progression suggestions
 */
export async function getLastExerciseLog(
  sessionExerciseId: string
): Promise<ExerciseLog | null> {
  try {
    const { data, error } = await supabase
      .from('exercise_logs')
      .select('*')
      .eq('session_exercise_id', sessionExerciseId)
      .order('logged_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // PGRST116 means no rows found - this is expected for first-time exercises
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching last exercise log:', error);
    return null;
  }
}
