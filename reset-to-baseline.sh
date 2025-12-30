#!/bin/bash

# Reset to Baseline Script
# This script resets the codebase and database to the working-sept-7-baseline state

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║           RESET TO BASELINE - WARNING                          ║${NC}"
echo -e "${YELLOW}╔════════════════════════════════════════════════════════════════╗${NC}"
echo ""
echo -e "${RED}This will:${NC}"
echo "  1. Reset git to the working-sept-7-baseline branch"
echo "  2. Delete ALL data from the database:"
echo "     - daily_workouts"
echo "     - weekly_plans"
echo "     - training_phases"
echo "     - training_plans"
echo "  3. Re-seed the database with fresh data"
echo ""
echo -e "${YELLOW}This action cannot be undone!${NC}"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${GREEN}Cancelled. No changes made.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}Starting reset process...${NC}"
echo ""

# Step 1: Reset git to baseline branch
echo -e "${GREEN}[1/5] Resetting git to working-sept-7-baseline...${NC}"
git fetch origin
git checkout working-sept-7-baseline
git reset --hard origin/working-sept-7-baseline
echo -e "${GREEN}✓ Git reset complete${NC}"
echo ""

# Step 2: Delete database data using a temporary TypeScript script
echo -e "${GREEN}[2/5] Clearing database...${NC}"

# Create a temporary cleanup script
cat > /tmp/cleanup-db.ts << 'EOF'
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function clearDatabase() {
  console.log('Deleting all data...');

  // Delete in correct order (respecting foreign keys)
  const { error: logsError } = await supabase.from('daily_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (logsError && logsError.code !== 'PGRST116') console.error('Error deleting daily_logs:', logsError);

  const { error: workoutsError } = await supabase.from('daily_workouts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (workoutsError && workoutsError.code !== 'PGRST116') console.error('Error deleting daily_workouts:', workoutsError);

  const { error: plansError } = await supabase.from('weekly_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (plansError && plansError.code !== 'PGRST116') console.error('Error deleting weekly_plans:', plansError);

  const { error: phasesError } = await supabase.from('training_phases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (phasesError && phasesError.code !== 'PGRST116') console.error('Error deleting training_phases:', phasesError);

  const { error: trainingError } = await supabase.from('training_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (trainingError && trainingError.code !== 'PGRST116') console.error('Error deleting training_plans:', trainingError);

  console.log('✓ Database cleared');
}

clearDatabase();
EOF

npx tsx /tmp/cleanup-db.ts
rm /tmp/cleanup-db.ts
echo -e "${GREEN}✓ Database cleared${NC}"
echo ""

# Step 3: Seed training plan
echo -e "${GREEN}[3/5] Seeding training plan...${NC}"
npm run seed:plan
echo -e "${GREEN}✓ Training plan seeded${NC}"
echo ""

# Step 4: Seed all weeks
echo -e "${GREEN}[4/5] Seeding all 36 weeks...${NC}"
npm run seed:all
echo -e "${GREEN}✓ All weeks seeded${NC}"
echo ""

# Step 5: Add Week 0
echo -e "${GREEN}[5/5] Adding Week 0 (Recovery week)...${NC}"
npx tsx scripts/add-week-zero.ts
echo -e "${GREEN}✓ Week 0 added${NC}"
echo ""

# Success message
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                   RESET COMPLETE!                              ║${NC}"
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo ""
echo -e "${GREEN}✓ Code reset to working-sept-7-baseline branch${NC}"
echo -e "${GREEN}✓ Database cleared and re-seeded${NC}"
echo ""
echo "Database now contains:"
echo "  - 1 training plan (Wy'East Wonder 50M)"
echo "  - 3 training phases (Foundation, Durability, Specificity)"
echo "  - 37 weekly plans (Week 0 + Weeks 1-36)"
echo "  - 246+ daily workouts"
echo ""
echo -e "${YELLOW}Current branch: working-sept-7-baseline${NC}"
echo ""
echo "To return to main branch, run: git checkout main"
echo ""
