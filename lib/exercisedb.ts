/**
 * ExerciseDB API Client
 * Handles fetching exercises from ExerciseDB API and uploading to Supabase
 */

import { supabase } from './supabase';

// ExerciseDB API base URL
const EXERCISEDB_API_URL = 'https://exercisedb.p.rapidapi.com';

// ExerciseDB exercise interface
export interface ExerciseDBExercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// Our exercise library interface
export interface ExerciseLibraryRow {
  external_id: string;
  name: string;
  description: string;
  body_parts: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  demo_file_path: string | null;
  instructions: string[];
  target_muscles: string[];
  secondary_muscles: string[];
}

/**
 * Fetch all exercises from ExerciseDB API
 * @param apiKey - ExerciseDB API key from RapidAPI
 * @param offset - Pagination offset (default 0)
 * @param limit - Number of exercises to fetch per page (max 100)
 */
export async function fetchAllExercises(
  apiKey: string,
  offset: number = 0,
  limit: number = 100
): Promise<ExerciseDBExercise[]> {
  const url = `${EXERCISEDB_API_URL}/exercises?offset=${offset}&limit=${limit}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },
  });

  if (!response.ok) {
    throw new Error(`ExerciseDB API error: ${response.status} ${response.statusText}`);
  }

  const exercises: ExerciseDBExercise[] = await response.json();
  return exercises;
}

/**
 * Download GIF file from URL
 * @param url - GIF URL from ExerciseDB
 * @returns Buffer containing the GIF data
 */
export async function downloadGif(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download GIF: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Upload GIF to Supabase Storage
 * @param gifBuffer - GIF file buffer
 * @param exerciseName - Exercise name (used for file naming)
 * @param externalId - ExerciseDB exercise ID
 * @returns Storage path or null if upload fails
 */
export async function uploadGifToSupabase(
  gifBuffer: Buffer,
  exerciseName: string,
  externalId: string
): Promise<string | null> {
  try {
    // Create a safe filename
    const safeFileName = `${externalId}-${exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.gif`;
    const filePath = `exercise-gifs/${safeFileName}`;

    const { error } = await supabase.storage
      .from('exercises')
      .upload(filePath, gifBuffer, {
        contentType: 'image/gif',
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error(`Failed to upload GIF for ${exerciseName}:`, error);
      return null;
    }

    return filePath;
  } catch (error) {
    console.error(`Error uploading GIF for ${exerciseName}:`, error);
    return null;
  }
}

/**
 * Infer difficulty from equipment type
 * Bodyweight = beginner, free weights = intermediate, machines = beginner/intermediate
 */
export function inferDifficulty(equipment: string): 'beginner' | 'intermediate' | 'advanced' {
  const equipmentLower = equipment.toLowerCase();

  // Bodyweight exercises are beginner-friendly
  if (equipmentLower.includes('body weight') || equipmentLower === 'body weight') {
    return 'beginner';
  }

  // Advanced equipment
  if (
    equipmentLower.includes('barbell') ||
    equipmentLower.includes('olympic') ||
    equipmentLower.includes('kettlebell')
  ) {
    return 'advanced';
  }

  // Intermediate equipment
  if (
    equipmentLower.includes('dumbbell') ||
    equipmentLower.includes('cable') ||
    equipmentLower.includes('resistance')
  ) {
    return 'intermediate';
  }

  // Default to intermediate for everything else
  return 'intermediate';
}

/**
 * Transform ExerciseDB exercise to our schema format
 */
export function transformExercise(exercise: ExerciseDBExercise, gifPath: string | null): ExerciseLibraryRow {
  return {
    external_id: exercise.id,
    name: exercise.name,
    description: exercise.instructions.join(' '), // Join instructions into description
    body_parts: [exercise.bodyPart], // Convert to array
    equipment: [exercise.equipment], // Convert to array
    difficulty: inferDifficulty(exercise.equipment),
    demo_file_path: gifPath,
    instructions: exercise.instructions,
    target_muscles: [exercise.target],
    secondary_muscles: exercise.secondaryMuscles || [],
  };
}

/**
 * Insert exercise into Supabase
 * @param exercise - Transformed exercise data
 * @returns true if successful, false if failed
 */
export async function insertExercise(exercise: ExerciseLibraryRow): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('exercise_library')
      .insert(exercise);

    if (error) {
      // If duplicate, skip silently
      if (error.code === '23505') {
        return true; // Already exists, consider it a success
      }
      console.error(`Failed to insert exercise ${exercise.name}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error inserting exercise ${exercise.name}:`, error);
    return false;
  }
}

/**
 * Check if exercise already exists in database
 */
export async function exerciseExists(externalId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('exercise_library')
    .select('id')
    .eq('external_id', externalId)
    .single();

  return !error && data !== null;
}

/**
 * Delay execution for rate limiting
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
