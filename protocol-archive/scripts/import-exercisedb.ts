#!/usr/bin/env tsx

/**
 * ExerciseDB Import Script
 *
 * This script imports exercises from the ExerciseDB API into your Supabase database.
 * It handles:
 * - Fetching all exercises from ExerciseDB (1,300+)
 * - Downloading GIF demonstrations
 * - Uploading to Supabase Storage
 * - Batch processing with rate limiting
 * - Error handling and retry logic
 * - Progress tracking and resume capability
 *
 * Usage: npm run import:exercises
 *
 * Environment variables required:
 * - EXERCISEDB_API_KEY: Your RapidAPI key for ExerciseDB
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local from project root using absolute path
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

// Verify critical env vars are loaded
const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'EXERCISEDB_API_KEY': process.env.EXERCISEDB_API_KEY,
};

const missingVars = Object.entries(requiredVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nMake sure .env.local exists in project root with all required variables.');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully\n');

// NOW import Node.js built-ins (safe to import before env vars)
import * as fs from 'fs';
import * as path from 'path';

// Import type only (no runtime code)
import type { ExerciseDBExercise } from '../lib/exercisedb';

// Configuration
const BATCH_SIZE = 100; // Fetch 100 exercises at a time
const RATE_LIMIT_DELAY = 1000; // 1 second between batches
const RETRY_ATTEMPTS = 3; // Retry failed operations
const PROGRESS_FILE = './scripts/.import-progress.json';
const ERRORS_FILE = './scripts/import-errors.json';

// Progress tracking
interface ImportProgress {
  totalFetched: number;
  totalImported: number;
  lastOffset: number;
  failedExercises: string[];
  startedAt: string;
  lastUpdatedAt: string;
}

// Error tracking
interface ImportError {
  exerciseId: string;
  exerciseName: string;
  error: string;
  timestamp: string;
}

/**
 * Load progress from file
 */
function loadProgress(): ImportProgress | null {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load progress file:', error);
  }
  return null;
}

/**
 * Save progress to file
 */
function saveProgress(progress: ImportProgress): void {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

/**
 * Log error to file
 */
function logError(error: ImportError): void {
  try {
    let errors: ImportError[] = [];
    if (fs.existsSync(ERRORS_FILE)) {
      const data = fs.readFileSync(ERRORS_FILE, 'utf-8');
      errors = JSON.parse(data);
    }
    errors.push(error);
    fs.writeFileSync(ERRORS_FILE, JSON.stringify(errors, null, 2));
  } catch (err) {
    console.error('Failed to log error:', err);
  }
}

/**
 * Main import function
 */
async function main() {
  console.log('🏋️  ExerciseDB Import Script\n');

  // Dynamically import exercisedb module AFTER env vars are loaded
  const {
    fetchAllExercises,
    transformExercise,
    insertExercise,
    exerciseExists,
    delay,
  } = await import('../lib/exercisedb.js');

  // Check for API key
  const apiKey = process.env.EXERCISEDB_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: EXERCISEDB_API_KEY not found in .env.local');
    console.error('Please add: EXERCISEDB_API_KEY=your_api_key_here');
    process.exit(1);
  }

  /**
   * Import a single exercise with retry logic
   */
  async function importExercise(
    exercise: ExerciseDBExercise,
    apiKey: string,
    retries: number = RETRY_ATTEMPTS
  ): Promise<boolean> {
    try {
      // Check if already exists
      if (await exerciseExists(exercise.id)) {
        console.log(`  ⏭️  ${exercise.name} (already exists)`);
        return true;
      }

      // Skip GIF download for now - will add later
      const gifPath = null;

      // Transform and insert
      const transformed = transformExercise(exercise, gifPath);
      const success = await insertExercise(transformed);

      if (success) {
        console.log(`  ✅ Imported: ${exercise.name}`);
        return true;
      } else {
        throw new Error('Failed to insert exercise');
      }
    } catch (error) {
      if (retries > 0) {
        console.log(`  🔄 Retrying ${exercise.name} (${retries} attempts left)...`);
        await delay(2000); // Wait 2 seconds before retry
        return importExercise(exercise, apiKey, retries - 1);
      }

      // Log error
      logError({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });

      console.error(`  ❌ Failed to import ${exercise.name}:`, error instanceof Error ? error.message : error);
      return false;
    }
  }

  // Load or initialize progress
  let progress = loadProgress();
  const isResume = progress !== null;

  if (!progress) {
    progress = {
      totalFetched: 0,
      totalImported: 0,
      lastOffset: 0,
      failedExercises: [],
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };
  } else {
    console.log(`\n📂 Resuming from previous import...`);
    console.log(`   Last offset: ${progress.lastOffset}`);
    console.log(`   Imported so far: ${progress.totalImported}`);
    console.log(`\n`);
  }

  let hasMore = true;
  let currentOffset = progress.lastOffset;
  let batchNumber = Math.floor(currentOffset / BATCH_SIZE) + 1;

  while (hasMore) {
    try {
      console.log(`\n📦 Fetching batch ${batchNumber} (offset ${currentOffset})...`);

      // Fetch batch from API
      const exercises = await fetchAllExercises(apiKey, currentOffset, BATCH_SIZE);

      if (exercises.length === 0) {
        console.log('\n✅ No more exercises to fetch. Import complete!');
        hasMore = false;
        break;
      }

      progress.totalFetched += exercises.length;
      console.log(`   Retrieved ${exercises.length} exercises`);
      console.log('');

      // Import each exercise in the batch
      for (const exercise of exercises) {
        const success = await importExercise(exercise, apiKey);
        if (success) {
          progress.totalImported++;
        } else {
          progress.failedExercises.push(exercise.id);
        }
      }

      // Update progress
      currentOffset += BATCH_SIZE;
      progress.lastOffset = currentOffset;
      progress.lastUpdatedAt = new Date().toISOString();
      saveProgress(progress);

      console.log(`\n📊 Progress: ${progress.totalImported}/${progress.totalFetched} imported`);
      if (progress.failedExercises.length > 0) {
        console.log(`   ⚠️  ${progress.failedExercises.length} failed`);
      }

      // Check if we got less than BATCH_SIZE (last batch)
      if (exercises.length < BATCH_SIZE) {
        console.log('\n✅ Reached last batch. Import complete!');
        hasMore = false;
        break;
      }

      // Rate limiting delay between batches
      console.log(`\n⏱️  Waiting ${RATE_LIMIT_DELAY}ms before next batch...`);
      await delay(RATE_LIMIT_DELAY);
      batchNumber++;

    } catch (error) {
      console.error('\n❌ Error fetching batch:', error instanceof Error ? error.message : error);
      console.log('Progress has been saved. You can resume by running the script again.');
      process.exit(1);
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Import Complete!');
  console.log('='.repeat(60));
  console.log(`Total exercises imported: ${progress.totalImported}`);
  console.log(`Total exercises fetched: ${progress.totalFetched}`);
  if (progress.failedExercises.length > 0) {
    console.log(`Failed imports: ${progress.failedExercises.length}`);
    console.log(`Check ${ERRORS_FILE} for details`);
  }
  console.log(`Started: ${new Date(progress.startedAt).toLocaleString()}`);
  console.log(`Completed: ${new Date().toLocaleString()}`);
  console.log('='.repeat(60));

  // Clean up progress file on successful completion
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
  }
}

// Run the import
main().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
