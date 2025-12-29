import { addWeeks, format } from 'date-fns';

export interface CompressedWeek {
  weekNumber: number; // New week number (1-32)
  originalWeekNumber: number; // Maps to original 36-week plan
  phase: 'Foundation' | 'Durability' | 'Specificity';
  miles: number;
  vert: number;
  theme: string;
  blockType?: string; // For Durability phase
}

/**
 * Compress 36-week plan to 32 weeks
 *
 * Compression strategy:
 * - Foundation: 12 → 10 weeks (skip weeks 11-12)
 * - Durability: 16 → 14 weeks (compress blocks from 4-4-4-4 to 3-3-4-4)
 * - Specificity: 8 → 8 weeks (unchanged)
 */
export function getCompressedPlanStructure(): CompressedWeek[] {
  const weeks: CompressedWeek[] = [];

  // FOUNDATION PHASE: Weeks 1-10 (Original Weeks 1-10, skip 11-12)
  const foundationWeeks = [
    { week: 1, originalWeek: 1, miles: 18, vert: 2200, theme: "Start conservative" },
    { week: 2, originalWeek: 2, miles: 20, vert: 2400, theme: "10% increase" },
    { week: 3, originalWeek: 3, miles: 22, vert: 2700, theme: "Building base" },
    { week: 4, originalWeek: 4, miles: 15, vert: 1800, theme: "DELOAD - 70% of week 3" },
    { week: 5, originalWeek: 5, miles: 24, vert: 3000, theme: "Resume build" },
    { week: 6, originalWeek: 6, miles: 26, vert: 3300, theme: "Progressive vert" },
    { week: 7, originalWeek: 7, miles: 29, vert: 3600, theme: "Approaching 30mpw" },
    { week: 8, originalWeek: 8, miles: 20, vert: 2500, theme: "DELOAD - 70% of week 7" },
    { week: 9, originalWeek: 9, miles: 32, vert: 4000, theme: "Final Foundation push" },
    { week: 10, originalWeek: 10, miles: 35, vert: 4400, theme: "Foundation peak - reach 35mpw" },
  ];

  foundationWeeks.forEach((w) => {
    weeks.push({
      weekNumber: w.week,
      originalWeekNumber: w.originalWeek,
      phase: 'Foundation',
      miles: w.miles,
      vert: w.vert,
      theme: w.theme,
    });
  });

  // DURABILITY PHASE: Weeks 11-24 (14 weeks)
  // Block structure: 3-3-4-4 instead of 4-4-4-4
  //
  // Block 1 (Steady State): Weeks 11-13 (original 13-15), Deload week 14 (original 16)
  // Block 2 (Tempo): Weeks 15-17 (original 17-19), Deload week 18 (original 20)
  // Block 3 (Hill Repeats): Weeks 19-22 (original 21-24) - NO COMPRESSION
  // Block 4 (VO2 Max): Weeks 23-26 (original 25-28) - NO COMPRESSION... wait, that's only 24 weeks total.

  // Let me recalculate:
  // Durability in original plan: Weeks 13-28 (16 weeks)
  // Compressed: Weeks 11-24 (14 weeks)
  // Need to compress 16 → 14 weeks

  const durabilityWeeks = [
    // Block 1: Steady State (3 build + 1 deload = 4 weeks total)
    { week: 11, originalWeek: 13, miles: 38, vert: 4800, theme: "Steady state introduction", block: "Steady State" },
    { week: 12, originalWeek: 14, miles: 40, vert: 5200, theme: "Building aerobic capacity", block: "Steady State" },
    { week: 13, originalWeek: 15, miles: 42, vert: 5600, theme: "Steady state peak", block: "Steady State" },
    { week: 14, originalWeek: 16, miles: 30, vert: 3900, theme: "DELOAD - Block 1 recovery", block: "Steady State" },

    // Block 2: Tempo (3 build + 1 deload = 4 weeks total)
    { week: 15, originalWeek: 17, miles: 44, vert: 5800, theme: "Tempo introduction", block: "Tempo" },
    { week: 16, originalWeek: 18, miles: 46, vert: 6000, theme: "Tempo development", block: "Tempo" },
    { week: 17, originalWeek: 19, miles: 48, vert: 6200, theme: "Tempo peak", block: "Tempo" },
    { week: 18, originalWeek: 20, miles: 34, vert: 4300, theme: "DELOAD - Block 2 recovery", block: "Tempo" },

    // Block 3: Hill Repeats (3 build + 1 deload = 4 weeks) - Use original 21-24
    { week: 19, originalWeek: 21, miles: 45, vert: 6500, theme: "Hill repeat introduction", block: "Hill Repeats" },
    { week: 20, originalWeek: 22, miles: 47, vert: 7000, theme: "Hill repeat development", block: "Hill Repeats" },
    { week: 21, originalWeek: 23, miles: 48, vert: 7200, theme: "Hill repeat peak", block: "Hill Repeats" },
    { week: 22, originalWeek: 24, miles: 34, vert: 4500, theme: "DELOAD - Block 3 recovery", block: "Hill Repeats" },

    // Block 4: VO2 Max (2 weeks only to compress) - Use original 25, 27
    { week: 23, originalWeek: 25, miles: 46, vert: 6800, theme: "VO2 max introduction", block: "VO2 Max" },
    { week: 24, originalWeek: 27, miles: 48, vert: 7200, theme: "VO2 max peak", block: "VO2 Max" },
  ];

  durabilityWeeks.forEach((w) => {
    weeks.push({
      weekNumber: w.week,
      originalWeekNumber: w.originalWeek,
      phase: 'Durability',
      miles: w.miles,
      vert: w.vert,
      theme: w.theme,
      blockType: w.block,
    });
  });

  // SPECIFICITY PHASE: Weeks 25-32 (8 weeks) - Use original 29-36 UNCHANGED
  const specificityWeeks = [
    { week: 25, originalWeek: 29, miles: 50, vert: 7500, theme: "Race-specific volume peak" },
    { week: 26, originalWeek: 30, miles: 48, vert: 7200, theme: "Sustained race pace" },
    { week: 27, originalWeek: 31, miles: 45, vert: 6800, theme: "Quality over quantity" },
    { week: 28, originalWeek: 32, miles: 35, vert: 5000, theme: "DELOAD - Pre-taper recovery" },
    { week: 29, originalWeek: 33, miles: 40, vert: 6000, theme: "Final race simulation" },
    { week: 30, originalWeek: 34, miles: 30, vert: 4500, theme: "Taper begins - 60% volume" },
    { week: 31, originalWeek: 35, miles: 20, vert: 3000, theme: "Deep taper - 40% volume" },
    { week: 32, originalWeek: 36, miles: 10, vert: 1500, theme: "RACE WEEK - Final prep" },
  ];

  specificityWeeks.forEach((w) => {
    weeks.push({
      weekNumber: w.week,
      originalWeekNumber: w.originalWeek,
      phase: 'Specificity',
      miles: w.miles,
      vert: w.vert,
      theme: w.theme,
    });
  });

  return weeks;
}

/**
 * Calculate phase date ranges based on start date
 */
export function calculatePhaseDates(startDate: Date) {
  const foundationStart = startDate;
  const foundationEnd = addWeeks(foundationStart, 10);

  const durabilityStart = foundationEnd;
  const durabilityEnd = addWeeks(durabilityStart, 14);

  const specificityStart = durabilityEnd;
  const specificityEnd = addWeeks(specificityStart, 8);

  return {
    foundation: {
      start_date: format(foundationStart, 'yyyy-MM-dd'),
      end_date: format(addWeeks(foundationEnd, -1).setDate(addWeeks(foundationEnd, -1).getDate() + 6), 'yyyy-MM-dd'), // End of week 10
      weeks: 10,
    },
    durability: {
      start_date: format(durabilityStart, 'yyyy-MM-dd'),
      end_date: format(addWeeks(durabilityEnd, -1).setDate(addWeeks(durabilityEnd, -1).getDate() + 6), 'yyyy-MM-dd'), // End of week 24
      weeks: 14,
    },
    specificity: {
      start_date: format(specificityStart, 'yyyy-MM-dd'),
      end_date: format(addWeeks(specificityEnd, -1).setDate(addWeeks(specificityEnd, -1).getDate() + 6), 'yyyy-MM-dd'), // End of week 32
      weeks: 8,
    },
    totalWeeks: 32,
    planStart: format(startDate, 'yyyy-MM-dd'),
    planEnd: format(specificityEnd, 'yyyy-MM-dd'),
  };
}

/**
 * Get week dates for a specific week number
 */
export function getWeekDates(startDate: Date, weekNumber: number) {
  const weekStart = addWeeks(startDate, weekNumber - 1);
  const weekEnd = addWeeks(weekStart, 1);

  return {
    start_date: format(weekStart, 'yyyy-MM-dd'),
    end_date: format(addWeeks(weekEnd, -1).setDate(addWeeks(weekEnd, -1).getDate() - 1), 'yyyy-MM-dd'), // Last day of week
  };
}

/**
 * Map compressed week to original week for workout content lookup
 * Returns the original week number to use for workout templates
 */
export function mapToOriginalWeek(compressedWeekNumber: number): number {
  const structure = getCompressedPlanStructure();
  const week = structure.find(w => w.weekNumber === compressedWeekNumber);
  return week?.originalWeekNumber || compressedWeekNumber;
}
