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

// Re-export from supabase-data
export { fetchPhases } from '../../lib/supabase-data'

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

// Legacy static data - kept for fallback or reference
// Note: This is now replaced by Supabase data via fetchPhases()

