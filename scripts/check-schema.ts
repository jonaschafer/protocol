#!/usr/bin/env tsx

/**
 * Check Database Schema
 *
 * Queries Supabase to see actual column names in tables
 * Usage: npm run check:schema
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local from project root
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableSchema(tableName: string) {
  console.log(`\n📋 Checking schema for: ${tableName}`);
  console.log('='.repeat(80));

  try {
    // First, get one row to see the structure
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ Error querying table: ${error.message}`);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Table exists with columns:`);
      const columns = Object.keys(data[0]);
      console.log(columns.join(', '));
      console.log(`\nTotal columns: ${columns.length}`);
      console.log('\nSample row:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log(`⚠️  Table exists but is empty`);

      // Query information_schema to get column details
      const { data: schemaData, error: schemaError } = await supabase.rpc('exec_sql', {
        sql: `SELECT column_name, data_type, is_nullable, column_default
              FROM information_schema.columns
              WHERE table_name = '${tableName}'
              ORDER BY ordinal_position`
      });

      if (schemaError) {
        console.log(`\n⚠️  Cannot query schema directly. Trying SELECT * to infer columns...`);

        // Alternative: Try to select with limit 0 to get column names
        const { error: selectError } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);

        if (!selectError) {
          console.log(`✅ Table accessible, columns will be visible when data is inserted`);
        }
      } else {
        console.log(`\n✅ Column information:`);
        console.log(schemaData);
      }
    }
  } catch (error) {
    console.error(`❌ Failed to check ${tableName}:`, error);
  }
}

async function main() {
  console.log('\n🔍 Inspecting Database Schema\n');

  const tables = [
    'training_plans',
    'training_phases',
    'weekly_plans',
    'daily_workouts'
  ];

  for (const table of tables) {
    await checkTableSchema(table);
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main();
