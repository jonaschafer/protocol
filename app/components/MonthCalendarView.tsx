'use client'

import { useState, useMemo } from "react";
import { phases, PhaseData } from "../phases/phaseData";

type ActivityType = "all" | "run" | "strength";

interface DayActivity {
  date: number;
  hasRun: boolean;
  hasStrength: boolean;
  phaseColor: string;
}

interface MonthData {
  name: string;
  year: number;
  days: DayActivity[];
  phase: string;
  weeks: string;
  phaseColor: string;
  startDay: number; // Day of week the month starts (0 = Sunday)
}

// Seeded random number generator for consistent results
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Helper function to get phase for a given date
const getPhaseForDate = (date: Date): PhaseData | null => {
  for (const phase of phases) {
    if (date >= phase.startDate && date <= phase.endDate) {
      return phase;
    }
  }
  return null;
};

// Helper function to get week range for a month
const getWeekRangeForMonth = (monthStart: Date, monthEnd: Date): string => {
  const weeksInRange: number[] = [];
  
  for (const phase of phases) {
    for (const week of phase.weeks) {
      const weekStart = new Date(week.startDate);
      const weekEnd = new Date(week.endDate);
      
      // Check if week overlaps with month (week starts before or during month, and ends during or after month)
      if (weekStart <= monthEnd && weekEnd >= monthStart) {
        weeksInRange.push(week.weekNumber);
      }
    }
  }
  
  if (weeksInRange.length === 0) return "";
  
  // Sort and get unique weeks
  const uniqueWeeks = [...new Set(weeksInRange)].sort((a, b) => a - b);
  
  if (uniqueWeeks.length === 1) {
    return `Week ${uniqueWeeks[0]}`;
  }
  
  const minWeek = uniqueWeeks[0];
  const maxWeek = uniqueWeeks[uniqueWeeks.length - 1];
  
  // If weeks are consecutive, show range; otherwise show first and last
  if (maxWeek - minWeek === uniqueWeeks.length - 1) {
    return `Week ${minWeek}-${maxWeek}`;
  } else {
    return `Week ${minWeek}-${maxWeek}`;
  }
};

// Generate month data based on phase data
const generateMonthData = (
  monthIndex: number, // 0-11 (January = 0)
  year: number,
): MonthData | null => {
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0); // Last day of month
  const totalDays = monthEnd.getDate();
  const startDay = monthStart.getDay(); // 0 = Sunday
  
  // Get the primary phase for this month (use the first day)
  const primaryPhase = getPhaseForDate(monthStart);
  if (!primaryPhase) return null;
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const days: DayActivity[] = [];
  
  for (let i = 1; i <= totalDays; i++) {
    const currentDate = new Date(year, monthIndex, i);
    const dayPhase = getPhaseForDate(currentDate) || primaryPhase;
    
    // Use seeded random based on date for consistent server/client rendering
    // Create a unique seed from the date
    const dateSeed = year * 10000 + (monthIndex + 1) * 100 + i;
    const runSeed = dateSeed * 2;
    const strengthSeed = dateSeed * 3;
    
    // Simulate some completed activities (mock data for now)
    // Using seeded random ensures same date always produces same result
    const hasRun = seededRandom(runSeed) > 0.4; // 60% chance of run
    const hasStrength = seededRandom(strengthSeed) > 0.6; // 40% chance of strength
    
    days.push({
      date: i,
      hasRun,
      hasStrength,
      phaseColor: dayPhase.color,
    });
  }
  
  const weekRange = getWeekRangeForMonth(monthStart, monthEnd);
  
  return {
    name: monthNames[monthIndex],
    year,
    days,
    phase: primaryPhase.name,
    weeks: weekRange,
    phaseColor: primaryPhase.color,
    startDay,
  };
};

// Generate 9 months of data (January - September 2026)
const generateNineMonthsData = (): MonthData[] => {
  const months: MonthData[] = [];
  const year = 2026;
  
  // January through September (monthIndex 0-8)
  for (let i = 0; i < 9; i++) {
    const monthData = generateMonthData(i, year);
    if (monthData) {
      months.push(monthData);
    }
  }
  
  return months;
};

export function MonthCalendarView() {
  const [filter, setFilter] = useState<ActivityType>("all");
  const [view, setView] = useState<"month" | "sixMonths">("month");
  
  const monthsData = useMemo(() => generateNineMonthsData(), []);

  const renderSingleMonth = (
    monthData: MonthData,
    isCompact: boolean = false,
  ) => {
    return (
      <div
        className={
          isCompact ? "" : "bg-[#1a1a1a] rounded-2xl p-6"
        }
      >
        {/* Days grid */}
        <div
          className={`grid grid-cols-7 ${isCompact ? "gap-2" : "gap-4"}`}
        >
          {/* Empty cells for days before month starts */}
          {[...Array(monthData.startDay)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Actual days */}
          {monthData.days.map((day) => (
            <button
              key={day.date}
              className={`aspect-square flex flex-col items-center justify-center ${
                isCompact
                  ? "gap-1 rounded-lg p-1"
                  : "gap-2 rounded-2xl p-3"
              } bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all group`}
            >
              {/* Date number */}
              {!isCompact && (
                <span className="text-white text-sm mb-1">
                  {day.date}
                </span>
              )}

              {/* Activity indicators */}
              <div
                className={`flex items-center ${isCompact ? "gap-0.5 flex-row" : "gap-1 flex-col"}`}
              >
                {/* Run indicator (circle) */}
                {(filter === "all" || filter === "run") && (
                  <div
                    className={`${isCompact ? "w-2 h-2" : "w-3 h-3"} rounded-full transition-all`}
                    style={{
                      backgroundColor: day.hasRun
                        ? day.phaseColor
                        : "#2a2a2a",
                    }}
                  />
                )}

                {/* Strength indicator (square with 50% opacity) */}
                {(filter === "all" ||
                  filter === "strength") && (
                  <div
                    className={`${isCompact ? "w-2 h-2" : "w-3 h-3"} rounded transition-all`}
                    style={{
                      backgroundColor: day.hasStrength
                        ? day.phaseColor
                        : "#2a2a2a",
                      opacity: day.hasStrength ? 0.5 : 1,
                    }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a0a] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-baseline justify-between">
          <div>
            <h1 className="text-white mb-2">Jan - Sep</h1>
          </div>

          {/* View Toggle Switch */}
          <div className="flex items-center gap-3">
            <span
              className={`text-sm ${view === "month" ? "text-white" : "text-[#6b6b7b]"}`}
            >
              1
            </span>
            <button
              onClick={() =>
                setView(
                  view === "month" ? "sixMonths" : "month",
                )
              }
              className="relative w-11 h-6 bg-[#1a1a1a] rounded-full transition-all hover:bg-[#222222]"
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  view === "sixMonths" ? "left-6" : "left-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${view === "sixMonths" ? "text-white" : "text-[#6b6b7b]"}`}
            >
              6
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              filter === "all"
                ? "bg-white text-black"
                : "bg-[#1a1a1a] text-[#9b9ba5] hover:bg-[#222222]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("run")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              filter === "run"
                ? "bg-white text-black"
                : "bg-[#1a1a1a] text-[#9b9ba5] hover:bg-[#222222]"
            }`}
          >
            Run
          </button>
          <button
            onClick={() => setFilter("strength")}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              filter === "strength"
                ? "bg-white text-black"
                : "bg-[#1a1a1a] text-[#9b9ba5] hover:bg-[#222222]"
            }`}
          >
            Strength
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-6 text-sm">
          {(filter === "all" || filter === "run") && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF474A]" />
              <span className="text-[#9b9ba5]">Run</span>
            </div>
          )}
          {(filter === "all" || filter === "strength") && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#FF474A] opacity-50" />
              <span className="text-[#9b9ba5]">Strength</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2a2a2a]" />
            <span className="text-[#9b9ba5]">Incomplete</span>
          </div>
        </div>

        {/* Calendar View */}
        {view === "month" ? (
          <div className="space-y-8">
            {monthsData.map((month) => (
              <div key={month.name}>
                {/* Month Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-white text-xl">
                      {month.name}
                    </h2>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: month.phaseColor,
                      }}
                    />
                  </div>
                  <p className="text-[#6b6b7b] text-sm">
                    {month.phase} • {month.weeks}
                  </p>
                </div>

                {/* Calendar */}
                {renderSingleMonth(month, false)}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthsData.map((month) => (
              <div
                key={month.name}
                className="bg-[#1a1a1a] rounded-2xl p-4"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white">{month.name}</h3>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: month.phaseColor,
                      }}
                    />
                  </div>
                  <p className="text-[#6b6b7b] text-xs">
                    {month.phase} • {month.weeks}
                  </p>
                </div>
                {renderSingleMonth(month, true)}
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {view === "month" && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-[#6b6b7b] text-sm mb-1">
                Total Runs
              </div>
              <div className="text-white text-2xl">
                {monthsData.reduce(
                  (sum, month) =>
                    sum +
                    month.days.filter((d) => d.hasRun).length,
                  0,
                )}
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-[#6b6b7b] text-sm mb-1">
                Total Strength
              </div>
              <div className="text-white text-2xl">
                {monthsData.reduce(
                  (sum, month) =>
                    sum +
                    month.days.filter((d) => d.hasStrength)
                      .length,
                  0,
                )}
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-[#6b6b7b] text-sm mb-1">
                Both
              </div>
              <div className="text-white text-2xl">
                {monthsData.reduce(
                  (sum, month) =>
                    sum +
                    month.days.filter(
                      (d) => d.hasRun && d.hasStrength,
                    ).length,
                  0,
                )}
              </div>
            </div>
          </div>
        )}

        {view === "sixMonths" && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-[#6b6b7b] text-sm mb-1">
                Total Runs
              </div>
              <div className="text-white text-2xl">
                {monthsData.reduce(
                  (sum, month) =>
                    sum +
                    month.days.filter((d) => d.hasRun).length,
                  0,
                )}
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-4">
              <div className="text-[#6b6b7b] text-sm mb-1">
                Total Strength
              </div>
              <div className="text-white text-2xl">
                {monthsData.reduce(
                  (sum, month) =>
                    sum +
                    month.days.filter((d) => d.hasStrength)
                      .length,
                  0,
                )}
              </div>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl p-4 md:col-span-1 col-span-2">
              <div className="text-[#6b6b7b] text-sm mb-1">
                Both
              </div>
              <div className="text-white text-2xl">
                {monthsData.reduce(
                  (sum, month) =>
                    sum +
                    month.days.filter(
                      (d) => d.hasRun && d.hasStrength,
                    ).length,
                  0,
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

