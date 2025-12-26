#!/usr/bin/env tsx

/**
 * Add Images from free-exercise-db
 *
 * This script matches our exercises with the free-exercise-db repository
 * and adds GitHub-hosted image URLs to our database.
 *
 * Repository: https://github.com/yuhonas/free-exercise-db
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

import axios from 'axios';
import { supabase } from '../lib/supabase';

const GITHUB_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

/**
 * Fetch exercises.json from free-exercise-db repository
 */
async function fetchFreeExercises() {
  const url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
  console.log('📥 Fetching exercises from free-exercise-db...\n');
  const response = await axios.get(url);
  return response.data;
}

/**
 * Normalize exercise name for matching
 * Removes special characters, common words, and units
 */
function normalizeExerciseName(name: string): string {
  return name
    .toLowerCase()
    // Remove all special characters and punctuation
    .replace(/[^a-z0-9\s]/g, '')
    // Remove common variations that don't affect matching
    .replace(/\b(the|a|an|with|and|v\s*\d+)\b/g, '')
    // Remove measurement units
    .replace(/\d+\s*(lb|kg|inch|cm|degree|°)/g, '')
    // Normalize spacing
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity between two strings (0-1, 1 = identical)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

async function main() {
  console.log('🖼️  Adding images from free-exercise-db\n');

  try {
    // Fetch free exercises
    const freeExercises = await fetchFreeExercises();
    console.log(`✅ Loaded ${freeExercises.length} exercises from free-exercise-db\n`);

    // Create lookup map by normalized name
    const freeExerciseMap = new Map();
    freeExercises.forEach((ex: any) => {
      const normalized = normalizeExerciseName(ex.name);
      freeExerciseMap.set(normalized, ex);
    });

    // Get our exercises
    const { data: ourExercises, error } = await supabase
      .from('exercise_library')
      .select('id, name, external_video_url')
      .order('name');

    if (error || !ourExercises) {
      console.error('❌ Failed to fetch exercises:', error);
      return;
    }

    console.log(`📊 Processing ${ourExercises.length} exercises from our database\n`);

    let matched = 0;
    let notMatched = 0;
    let alreadyHasImage = 0;

    for (const ourEx of ourExercises) {
      // Skip if already has image
      if (ourEx.external_video_url) {
        alreadyHasImage++;
        continue;
      }

      const normalized = normalizeExerciseName(ourEx.name);

      // Try exact match first
      let freeEx = freeExerciseMap.get(normalized);

      // If no exact match, try fuzzy matching (>0.85 similarity)
      if (!freeEx) {
        let bestMatch = null;
        let bestScore = 0;

        for (const [freeNormalized, freeExercise] of freeExerciseMap.entries()) {
          const similarity = calculateSimilarity(normalized, freeNormalized);
          if (similarity > bestScore && similarity > 0.85) {
            bestScore = similarity;
            bestMatch = freeExercise;
          }
        }

        if (bestMatch) {
          freeEx = bestMatch;
          console.log(`🔍 Fuzzy matched: "${ourEx.name}" → "${bestMatch.name}" (${(bestScore * 100).toFixed(0)}%)`);
        }
      }

      if (freeEx && freeEx.images && freeEx.images.length > 0) {
        // Construct image URL
        const imageUrl = `${GITHUB_BASE}/${freeEx.images[0]}`;

        // Update our database
        const { error: updateError } = await supabase
          .from('exercise_library')
          .update({ external_video_url: imageUrl })
          .eq('id', ourEx.id);

        if (updateError) {
          console.log(`❌ ${ourEx.name}: ${updateError.message}`);
        } else {
          console.log(`✅ ${ourEx.name}`);
          matched++;
        }
      } else {
        notMatched++;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('🎉 Image Matching Complete!');
    console.log('='.repeat(60));
    console.log(`✅ Matched and added images: ${matched}`);
    console.log(`📸 Already had images: ${alreadyHasImage}`);
    console.log(`⚠️  No match found: ${notMatched}`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n💥 Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
