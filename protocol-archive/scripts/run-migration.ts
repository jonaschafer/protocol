#!/usr/bin/env tsx

/**
 * Display Database Migration SQL
 *
 * Prints migration SQL to run in Supabase SQL editor
 * Usage: npm run migrate
 */

import { resolve } from 'path';
import { readFileSync } from 'fs';

function displayMigration(filename: string) {
  console.log('\n📋 Database Migration Required\n');
  console.log('='.repeat(80));

  try {
    const migrationPath = resolve(process.cwd(), 'supabase', 'migrations', filename);
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('\n💡 To apply this migration:\n');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL below');
    console.log('4. Click "Run"\n');
    console.log('='.repeat(80));
    console.log('\n' + sql + '\n');
    console.log('='.repeat(80));
    console.log(`\n📁 Or copy from: ${migrationPath}\n`);
  } catch (error) {
    console.error('❌ Failed to read migration file:', error);
    process.exit(1);
  }
}

displayMigration('001_add_training_plan_tables.sql');
