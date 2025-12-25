# ExerciseDB Import System

This directory contains scripts for importing exercises from the ExerciseDB API into your Supabase database.

## Overview

The import system fetches 1,300+ exercises from ExerciseDB, including:
- Exercise names and descriptions
- Body parts targeted
- Equipment required
- Difficulty levels
- Animated GIF demonstrations
- Step-by-step instructions

This is a **ONE-TIME** import that populates your exercise library. After import, your app works completely offline with all exercise data stored in Supabase.

## Prerequisites

### 1. Get an ExerciseDB API Key

1. Go to [RapidAPI ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
2. Sign up or log in
3. Subscribe to the API (free tier available)
4. Copy your API key from the dashboard

### 2. Set Up Supabase Storage

1. Go to your Supabase project dashboard
2. Navigate to **Storage**
3. Create a new bucket called `exercises`
4. Set the bucket to **Public** (for GIF access)
5. Add a policy to allow public read access:
   ```sql
   CREATE POLICY "Public Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'exercises');
   ```

### 3. Run the Schema Migration

Ensure the `exercise_library` table exists in your database:

```bash
# Copy the contents of supabase/schema.sql
# Paste into Supabase SQL Editor and run
```

The table includes:
- Full-text search indexes
- GIN indexes for array columns (body_parts, equipment)
- RLS policies for read/insert access

## Configuration

### Add API Key to Environment

Add your ExerciseDB API key to `.env.local`:

```bash
EXERCISEDB_API_KEY=your_api_key_here
```

**Note:** You can remove this after the import completes.

## Running the Import

### Basic Usage

```bash
npm run import:exercises
```

The script will:
1. Fetch exercises in batches of 100
2. Download GIF demonstrations
3. Upload GIFs to Supabase Storage
4. Insert exercise data into the database
5. Show progress after each batch
6. Save progress for resume capability

### Expected Output

```
🏋️  ExerciseDB Import Script

📦 Fetching batch 1 (offset 0)...
   Retrieved 100 exercises

  📥 Downloading GIF for 3/4 sit-up...
  ☁️  Uploading GIF to storage...
  ✅ Imported: 3/4 sit-up

  📥 Downloading GIF for 45° side bend...
  ☁️  Uploading GIF to storage...
  ✅ Imported: 45° side bend

...

📊 Progress: 100/100 imported

⏱️  Waiting 1000ms before next batch...

...

============================================================
🎉 Import Complete!
============================================================
Total exercises imported: 1324
Total exercises fetched: 1324
Started: 12/25/2024, 2:30:00 PM
Completed: 12/25/2024, 3:15:00 PM
============================================================
```

### Import Duration

Expected import time: **30-45 minutes** (depending on network speed and API rate limits)

## Features

### Batch Processing

- Fetches 100 exercises at a time
- 1-second delay between batches (rate limiting)
- Automatic pagination through all exercises

### Error Handling

- **Retry Logic**: Failed operations retry 3 times
- **Error Logging**: Failed imports logged to `scripts/import-errors.json`
- **Graceful Degradation**: Continues if GIF download fails
- **Duplicate Prevention**: Skips exercises that already exist

### Resume Capability

If the import fails or is interrupted:

1. Progress is saved to `scripts/.import-progress.json`
2. Simply run `npm run import:exercises` again
3. Import resumes from the last successful batch

Example:
```
📂 Resuming from previous import...
   Last offset: 500
   Imported so far: 500
```

### Progress Tracking

The script shows real-time progress:
- Current batch number and offset
- Exercises imported in current batch
- Total progress (imported/fetched)
- Failed imports count

## Troubleshooting

### "EXERCISEDB_API_KEY not found"

**Solution:** Add the API key to `.env.local`:
```bash
EXERCISEDB_API_KEY=your_actual_key_here
```

### "Failed to upload GIF"

**Causes:**
- Supabase storage bucket doesn't exist
- Bucket permissions not set correctly
- Network timeout

**Solution:**
1. Create `exercises` bucket in Supabase Storage
2. Set bucket to Public
3. Add public read policy (see Prerequisites)

### "Rate limit exceeded"

**Causes:**
- Too many requests to ExerciseDB API
- Free tier limits exceeded

**Solution:**
1. Wait 1 hour and resume import
2. Upgrade to paid tier on RapidAPI
3. Increase `RATE_LIMIT_DELAY` in the script

### Import stuck or slow

**Causes:**
- Network issues
- Slow GIF downloads
- Supabase Storage throttling

**Solution:**
1. Check your internet connection
2. The script will retry automatically
3. If it fails, resume will pick up where it left off

## Files Generated

### During Import

- `scripts/.import-progress.json` - Progress tracking (deleted on completion)
- `scripts/import-errors.json` - Failed imports log

### In Supabase Storage

- `exercises/exercise-gifs/{id}-{name}.gif` - GIF demonstrations
- Example: `exercises/exercise-gifs/0001-3-4-sit-up.gif`

## Post-Import

### Verify Import

Check the import was successful:

```sql
-- Count total exercises
SELECT COUNT(*) FROM exercise_library;

-- Check exercises with GIFs
SELECT COUNT(*) FROM exercise_library WHERE demo_file_path IS NOT NULL;

-- View sample exercises
SELECT name, difficulty, body_parts, equipment
FROM exercise_library
LIMIT 10;
```

### Clean Up

After successful import:

1. **Remove API key** from `.env.local` (no longer needed)
2. **Delete progress file**: `rm scripts/.import-progress.json`
3. **Review errors**: Check `scripts/import-errors.json` for failed imports

### Re-Import Specific Exercises

If some exercises failed, you can re-import them:

1. Check `scripts/import-errors.json` for failed exercise IDs
2. The script automatically skips existing exercises
3. Run `npm run import:exercises` again - it will only import missing exercises

## Database Schema

The `exercise_library` table:

```sql
CREATE TABLE exercise_library (
  id UUID PRIMARY KEY,
  external_id TEXT UNIQUE,          -- ExerciseDB ID
  name TEXT NOT NULL,
  description TEXT,
  body_parts TEXT[] NOT NULL,       -- e.g., ['chest', 'shoulders']
  equipment TEXT[] NOT NULL,        -- e.g., ['barbell', 'bench']
  difficulty TEXT,                  -- 'beginner', 'intermediate', 'advanced'
  demo_file_path TEXT,              -- Supabase Storage path
  instructions TEXT[],              -- Step-by-step instructions
  target_muscles TEXT[],            -- Primary muscles
  secondary_muscles TEXT[],         -- Secondary muscles
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Indexes

- **GIN indexes** on `body_parts`, `equipment`, `target_muscles` (fast array searches)
- **Full-text search** on `name` and `description`
- **B-tree index** on `difficulty`

## Usage in Your App

After import, query exercises:

```typescript
// Search by name
const { data } = await supabase
  .from('exercise_library')
  .select('*')
  .textSearch('name', 'squat');

// Filter by body part
const { data } = await supabase
  .from('exercise_library')
  .select('*')
  .contains('body_parts', ['chest']);

// Filter by difficulty
const { data } = await supabase
  .from('exercise_library')
  .select('*')
  .eq('difficulty', 'beginner');

// Get GIF URL
const gifUrl = supabase.storage
  .from('exercises')
  .getPublicUrl(exercise.demo_file_path).data.publicUrl;
```

## Support

For issues or questions:
1. Check `scripts/import-errors.json` for error details
2. Verify Supabase Storage configuration
3. Ensure API key is valid and has remaining quota
4. Check network connectivity

## License

Exercise data from [ExerciseDB](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb) via RapidAPI.
