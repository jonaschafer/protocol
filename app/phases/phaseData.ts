export interface WeekData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  totalMiles: number;
  totalVert: number;
}

export interface PhaseData {
  id: 'foundation' | 'durability' | 'specificity';
  name: string;
  color: string;
  startDate: Date;
  endDate: Date;
  weekStart: number;
  weekEnd: number;
  weeks: WeekData[];
}

// Helper function to add weeks to a date
function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

// Helper function to format date for display
export function formatDateRange(start: Date, end: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} — ${end.toLocaleDateString('en-US', options)}`;
}

// Helper function to format date range without year (for week cards) - using en dash
export function formatDateRangeNoYear(start: Date, end: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`;
}

// Phase 1: Foundation (Weeks 1-12) - Dec 29, 2025 to Mar 22, 2026
const foundationStartDate = new Date(2025, 11, 29); // Dec 29, 2025
const foundationEndDate = new Date(2026, 2, 22); // Mar 22, 2026

// Phase 2: Durability (Weeks 13-28) - Mar 23 to Jul 12, 2026
const durabilityStartDate = new Date(2026, 2, 23); // Mar 23, 2026
const durabilityEndDate = new Date(2026, 6, 12); // Jul 12, 2026

// Phase 3: Specificity (Weeks 29-36) - Jul 13 to Aug 15, 2026
const specificityStartDate = new Date(2026, 6, 13); // Jul 13, 2026
const specificityEndDate = new Date(2026, 7, 15); // Aug 15, 2026

// Generate weeks for Foundation phase (Weeks 1-12)
// Starting at 18mpw, building to 40mpw at 10%/week with deloads every 4th week
const foundationWeeks: WeekData[] = [];
for (let i = 0; i < 12; i++) {
  const weekNum = i + 1;
  const startDate = addWeeks(foundationStartDate, i);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6); // End date is 6 days after start (7-day week)
  
  // Calculate miles: start at 18, increase 10% per week (except deload weeks)
  const isDeloadWeek = weekNum % 4 === 0;
  const baseMiles = 18 * Math.pow(1.1, i);
  const miles = isDeloadWeek ? Math.round(baseMiles * 0.7) : Math.round(baseMiles);
  
  foundationWeeks.push({
    weekNumber: weekNum,
    startDate,
    endDate,
    totalMiles: Math.min(miles, 40), // Cap at 40mpw
    totalVert: 0 // Foundation phase starts with minimal vert
  });
}

// Generate weeks for Durability phase (Weeks 13-28)
// Hold 40-50mpw with progressive vert (6k → 9k/week)
const durabilityWeeks: WeekData[] = [];
for (let i = 0; i < 16; i++) {
  const weekNum = i + 13;
  const startDate = addWeeks(durabilityStartDate, i);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6); // End date is 6 days after start (7-day week)
  
  // Hold 40-50mpw range
  const miles = 42 + (i % 3); // Vary between 42-44
  // Progressive vert: 6k → 9k over 16 weeks
  const vert = Math.round(6000 + (i / 15) * 3000);
  
  durabilityWeeks.push({
    weekNumber: weekNum,
    startDate,
    endDate,
    totalMiles: miles,
    totalVert: vert
  });
}

// Generate weeks for Specificity phase (Weeks 29-36)
// 45-50mpw sustained with 8-10k vert/week, taper final 2 weeks
const specificityWeeks: WeekData[] = [];
for (let i = 0; i < 8; i++) {
  const weekNum = i + 29;
  const startDate = addWeeks(specificityStartDate, i);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6); // End date is 6 days after start (7-day week)
  
  // Taper final 2 weeks (weeks 35-36)
  const isTaper = weekNum >= 35;
  const miles = isTaper ? Math.round(35 * (weekNum === 35 ? 0.7 : 0.5)) : 47;
  const vert = isTaper ? Math.round(8000 * (weekNum === 35 ? 0.5 : 0.3)) : 9000;
  
  specificityWeeks.push({
    weekNumber: weekNum,
    startDate,
    endDate,
    totalMiles: miles,
    totalVert: vert
  });
}

export const phases: PhaseData[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    color: '#FF474A',
    startDate: foundationStartDate,
    endDate: foundationEndDate,
    weekStart: 1,
    weekEnd: 12,
    weeks: foundationWeeks
  },
  {
    id: 'durability',
    name: 'Durability',
    color: '#165DFC',
    startDate: durabilityStartDate,
    endDate: durabilityEndDate,
    weekStart: 13,
    weekEnd: 28,
    weeks: durabilityWeeks
  },
  {
    id: 'specificity',
    name: 'Specificity',
    color: '#AC47FF',
    startDate: specificityStartDate,
    endDate: specificityEndDate,
    weekStart: 29,
    weekEnd: 36,
    weeks: specificityWeeks
  }
];

