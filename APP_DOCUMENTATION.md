# Protocol - Training Plan Application Documentation

## Overview

Protocol is a Next.js-based web application for viewing and managing a structured training plan. It provides a visual interface for organizing training phases, weeks, days, and exercises with detailed workout information. The application is designed with a mobile-first approach, featuring a dark theme and a clean, card-based UI.

## Application Purpose

This application serves as a digital training protocol viewer that allows users to:
- View training phases (Foundation, Durability, Specificity) spanning 36 weeks
- Navigate through weekly and daily workout plans
- View detailed exercise information with sets, reps, weights, cues, and notes
- Track running workouts with metrics (miles, vertical gain, RPE, zones)
- View calendar-based monthly views of training activities
- Log exercises and track completion status

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Modules, Inline Styles
- **UI Library**: React 18
- **Animation**: Framer Motion
- **Build Tool**: Next.js built-in bundler

## Project Structure

```
protocol/
├── app/                          # Next.js App Router directory
│   ├── components/              # Reusable React components (45 files)
│   │   ├── *.tsx               # Component files (33 files)
│   │   ├── *.module.css        # CSS Modules (6 files)
│   │   └── *.svg               # SVG icons (5 files)
│   ├── data/                    # Static data files
│   │   └── dayData.ts          # Day-specific exercise data
│   ├── exercises/               # Exercise-related components/pages
│   │   ├── dayView.tsx         # Day view component
│   │   ├── exerciseCard.tsx    # Exercise detail card component
│   │   └── [exerciseName]/     # Dynamic exercise pages
│   ├── phases/                  # Phase-related data and pages
│   │   ├── phaseData.ts        # Phase definitions and week data
│   │   └── page.tsx            # Phases overview page
│   ├── day/                     # Day-related pages
│   │   ├── page.tsx            # Day page (sample)
│   │   └── [dayName]/          # Dynamic day pages
│   ├── week/                    # Week-related pages
│   │   └── page.tsx            # Week view page
│   ├── overview/                # Component overview/playground
│   │   └── page.tsx            # Comprehensive component showcase
│   ├── headers/                 # Header component testing
│   │   └── page.tsx            # Header variations page
│   ├── many-month-view/         # Calendar view
│   │   └── page.tsx            # Multi-month calendar page
│   ├── temp/                    # Temporary/testing page
│   │   └── page.tsx            # Temporary component testing
│   ├── page.tsx                 # Home page (Phase Overview)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── protocol-archive/            # Archived old version (not used)
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
└── README.md                    # Basic setup instructions
```

## Key Files and Their Purposes

### Core Application Files

- **`app/page.tsx`**: Home page displaying the Phase Overview component
- **`app/layout.tsx`**: Root layout with metadata and global styles
- **`app/globals.css`**: Global CSS with font imports and base styles

### Data Files

- **`app/phases/phaseData.ts`**: 
  - Defines 3 training phases (Foundation, Durability, Specificity)
  - Generates 36 weeks of training data with dates, miles, and vertical gain
  - Contains phase colors and date ranges
  - Foundation: Weeks 1-12 (Dec 29, 2025 - Mar 22, 2026), Red (#FF474A)
  - Durability: Weeks 13-28 (Mar 23 - Jul 12, 2026), Blue (#165DFC)
  - Specificity: Weeks 29-36 (Jul 13 - Aug 15, 2026), Purple (#AC47FF)

- **`app/data/dayData.ts`**: 
  - Contains sample day data for all 7 days of the week
  - Includes run data (miles, vert, RPE, zones, routes, pace, SPM)
  - Contains exercise data (name, sets, reps, weight, notes, cues, rest notes)
  - Used by dynamic day pages

### Component Architecture

The application uses a hierarchical component structure:

#### Layout Components
- **`PhaseOverview`**: Main container showing all training phases with expand/collapse
- **`WeekView`**: Displays a single week with header, run stats, and day cards
- **`DayView`**: Shows a single day's workout with run data and exercise list
- **`ExerciseCard`**: Detailed exercise view with sets, logging, and notes
- **`MonthCalendarView`**: Multi-month calendar view showing activity patterns

#### Header Components
- **`PhaseHeader`**: Phase name and week range header
- **`WeekHeader`**: Week number and category header with phase color
- **`DayHeader`**: Day date, number, and category header
- **`ExerciseHeader`**: Exercise name, rest notes, and cues
- **`RunHeader`**: Running workout details (miles, vert, RPE, zones, pace, SPM)
- **`WeekRunHeader`**: Weekly running summary with miles progress and vert

#### Card Components
- **`WeekSummaryCard`**: Compact week card in phase overview
- **`DayCard`**: Day representation with tags and completion status
- **`DayExerciseCard`**: Exercise card in day view
- **`WeekDayCard`**: Day card in week view

#### List Components
- **`ExerciseList`**: List of exercises for a day with logging button
- **`WeekExerciseList`**: List of days in a week view

#### UI Components
- **`StatBox`**: Statistic display box (used in various contexts)
- **`SetRow`**: Individual set row with reps/weight inputs
- **`Notes`**: Editable notes field
- **`CuesContent`**: Display-only cues content
- **`RunNutrition`**: Nutrition section for runs
- **`WeekNotes`**: Week-level notes display
- **`NutritionSection`**: Nutrition information section
- **`BaseLabeledContent`**: Base component for labeled content sections
- **`BackButton`**: Navigation back button
- **`LogButton`**: Exercise logging button
- **`AddSetButton`**: Button to add new sets
- **`ExerciseListLogButton`**: Log button for exercise lists
- **`CloseButtonWithGradient`**: Close button with gradient overlay
- **`BaseButton`**: Base button component
- **`BaseHeader`**: Base header component

## Routes and Pages

### Static Routes

1. **`/`** (Home) - Phase Overview
   - Displays all 3 training phases
   - Expandable/collapsible phase cards
   - Clickable week cards navigate to week view

2. **`/phases`** - Phases Page
   - Same as home page (alternative route)

3. **`/week`** - Week View
   - Shows a single week with hardcoded sample data
   - Week header, run stats, and day cards

4. **`/day`** - Day View (Sample)
   - Sample day view with hardcoded data

5. **`/overview`** - Component Overview/Playground
   - Comprehensive showcase of all components
   - Theme switching (light/dark)
   - Individual vs compiled component views
   - Useful for component development and testing

6. **`/headers`** - Header Testing
   - Displays all three phase header variants
   - Random date generator for testing

7. **`/many-month-view`** - Calendar View
   - Multi-month calendar showing training activities
   - Activity type filtering (all/run/strength)
   - Phase color coding

8. **`/temp`** - Temporary Testing Page
   - Component testing/development page
   - Sample exercise detail view

### Dynamic Routes

1. **`/day/[dayName]`** - Dynamic Day Page
   - Displays day data based on URL parameter
   - Uses `dayData.ts` for data
   - Examples: `/day/monday`, `/day/tuesday`, etc.
   - Shows DayView component with run data and exercises

2. **`/exercises/[exerciseName]`** - Dynamic Exercise Page
   - Displays detailed exercise view
   - Can show single exercise or all exercises from a day
   - Supports `?day=dayName` query parameter
   - Exercise name is encoded in URL (spaces to hyphens, lowercase)
   - Shows ExerciseCard component with sets, logging, notes

## Data Models

### Phase Data
```typescript
interface PhaseData {
  id: 'foundation' | 'durability' | 'specificity';
  name: string;
  color: string;
  startDate: Date;
  endDate: Date;
  weekStart: number;
  weekEnd: number;
  weeks: WeekData[];
}
```

### Week Data
```typescript
interface WeekData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  totalMiles: number;
  totalVert: number;
}
```

### Day Data
```typescript
interface DayData {
  date: string;
  dayNumber: number;
  category: string;
  runData?: {
    variant?: 'run' | 'row';
    helper?: string;
    miles: number | string;
    vert?: number | string;
    zone?: number | string;
    rpe?: string;
    route?: string;
    pace?: number | string;
    spm?: number | string;
    cues?: string;
  };
  exercises: Array<{
    id: string;
    exerciseName: string;
    sets?: number;
    reps?: number | string;
    weight?: string;
    exerciseNote?: string;
    restNote?: string;
    cues?: string;
  }>;
}
```

### Exercise Data
```typescript
interface ExerciseData {
  id: string;
  exerciseName: string;
  restNote: string;
  cues: string;
  sets: Set[];
  isLogged: boolean;
  onDelete: (id: number) => void;
  onAddSet: () => void;
  onLog: () => void;
  onRepsChange: (id: number, value: string) => void;
  onWeightChange: (id: number, value: string) => void;
  onNotesSave?: (value: string) => void;
}
```

### Set Data
```typescript
interface Set {
  id: number;
  setNumber: number;
  reps: string;
  weight: string;
  isTimed: boolean;
}
```

## Features and Functionality

### What the App CAN Do

1. **View Training Plan Structure**
   - Browse 3 training phases with 36 total weeks
   - See phase date ranges and week numbers
   - Navigate through phase → week → day hierarchy

2. **View Weekly Plans**
   - See weekly running totals (miles, vertical gain)
   - View all 7 days of the week
   - See day summaries with run info and PT indicators
   - View weekly notes

3. **View Daily Workouts**
   - See daily run details (miles, vert, RPE, zones, routes)
   - View run nutrition information
   - See list of exercises for the day
   - Navigate to exercise details

4. **View Exercise Details**
   - See exercise name, rest notes, and cues
   - View sets with reps and weights
   - Add/remove sets dynamically
   - Edit reps and weights per set
   - Mark exercises as logged/completed
   - Add notes per exercise
   - Scroll to specific exercises
   - Support timed exercises (e.g., "45 sec")

5. **Calendar View**
   - Multi-month calendar display
   - Activity type filtering (runs, strength, all)
   - Phase color coding
   - Visual indicators for training days

6. **Component Showcase**
   - Comprehensive component overview page
   - Theme switching capability
   - Component relationship documentation

7. **Responsive Design**
   - Mobile-first approach
   - Max width of 402px for main content
   - Centered card-based layout
   - Dark theme optimized

8. **Navigation**
   - Back button navigation
   - Sticky header buttons
   - Smooth scrolling to exercises
   - URL-based routing for deep linking

### What the App CANNOT Do (Current Limitations)

1. **No Data Persistence**
   - All data is static/hardcoded
   - No database integration
   - No API endpoints
   - Exercise logging is only in-memory state
   - No user authentication

2. **No Workout Logging Backend**
   - Exercise logging is UI-only (doesn't persist)
   - No workout history tracking
   - No progress tracking over time
   - No data export functionality

3. **Limited Data Management**
   - Cannot edit phase/week/day data through UI
   - Data changes require code edits
   - No admin/editing interface

4. **No Personalization**
   - No user profiles
   - No customization options
   - Fixed training plan (not dynamic)

5. **No Integration**
   - No integration with fitness trackers
   - No Garmin/Strava/etc. sync
   - No external data sources

6. **No Notifications**
   - No workout reminders
   - No progress notifications

7. **Limited Exercise Search**
   - No search functionality
   - No filtering capabilities
   - Must navigate through hierarchy

8. **Static Content**
   - Nutrition info is static/placeholder
   - No dynamic calculations
   - No workout recommendations

## UI/UX Design

### Design System

- **Color Palette**:
  - Background: Black (#000000)
  - Card Background: Dark Gray (#272727)
  - Accent Background: Darker Gray (#1E1E1E)
  - Text: White with opacity variations
  - Phase Colors:
    - Foundation: Red (#FF474A)
    - Durability: Blue (#165DFC)
    - Specificity: Purple (#AC47FF)
  - Success: Green (#059F00)

- **Typography**:
  - Primary: Instrument Sans (weights: 400, 500)
  - Secondary: Inter (weight: 400)
  - Monospace: IBM Plex Mono (weight: 400)
  - Tight: Inter Tight (weights: 400, 500)

- **Spacing**:
  - Consistent 20px padding
  - 10-60px gaps between components
  - 30px border radius for cards

- **Layout**:
  - Max width: 402px (mobile-first)
  - Centered content
  - Card-based design
  - Sticky headers where appropriate

### Interaction Patterns

1. **Phase Overview**:
   - Click phase header to expand/collapse
   - Click week card to navigate to week view
   - Sticky phase headers when expanded

2. **Exercise Logging**:
   - Click exercise card to view details
   - Edit reps/weights inline
   - Add/remove sets dynamically
   - Log button toggles completion state
   - Notes field for exercise-specific notes

3. **Navigation**:
   - Back buttons for hierarchical navigation
   - Deep linking via URLs
   - Smooth scrolling to specific exercises

4. **Animations**:
   - Respects `prefers-reduced-motion`
   - Smooth transitions for card dismissals
   - Expand/collapse animations

## Development

### Setup

```bash
npm install
npm run dev    # Development server (runs on 0.0.0.0)
npm run build  # Production build
npm run start  # Production server
npm run lint   # Lint code
```

### Key Configuration Files

- **`tsconfig.json`**: TypeScript strict mode, ES2017 target, path aliases
- **`tailwind.config.js`**: Tailwind CSS with custom font families
- **`next.config.js`**: React strict mode enabled
- **`package.json`**: Dependencies and scripts

### Development Patterns

- **Component Structure**: Functional components with TypeScript
- **Styling**: Mix of inline styles, CSS Modules, and Tailwind
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js App Router with dynamic routes
- **Data Flow**: Props-based component communication

### Notable Implementation Details

1. **Exercise State Management**:
   - Each exercise maintains its own sets array
   - State is initialized from dayData structure
   - Handlers for add/delete/edit operations

2. **URL Encoding**:
   - Exercise names are encoded (spaces → hyphens, lowercase)
   - Day names are passed as query parameters
   - Supports deep linking to specific exercises

3. **Component Reusability**:
   - Base components (BaseButton, BaseHeader, BaseLabeledContent)
   - Composed components build on base components
   - Consistent prop interfaces

4. **Responsive Design**:
   - Mobile-first approach
   - Fixed max-width for consistency
   - Sticky elements for navigation

## Dependencies

### Production Dependencies
- `next`: ^14.2.0 - React framework
- `react`: ^18.2.0 - UI library
- `react-dom`: ^18.2.0 - React DOM bindings
- `framer-motion`: ^12.23.26 - Animation library

### Development Dependencies
- `typescript`: ^5.3.0 - Type safety
- `@types/node`: ^20.0.0 - Node.js types
- `@types/react`: ^18.2.0 - React types
- `@types/react-dom`: ^18.2.0 - React DOM types
- `tailwindcss`: ^3.4.0 - Utility-first CSS
- `postcss`: ^8.4.32 - CSS processing
- `autoprefixer`: ^10.4.16 - CSS vendor prefixes

## File Count Summary

- **Components**: 45 files (33 TSX, 6 CSS Modules, 5 SVG, 1 MD)
- **Pages**: 9 routes (including dynamic routes)
- **Data Files**: 2 (phaseData.ts, dayData.ts)
- **Configuration**: 4 files (package.json, tsconfig.json, tailwind.config.js, next.config.js)

## Archive Directory

The `protocol-archive/` directory contains an older version of the application with:
- Different architecture (likely different routing)
- Supabase integration (database)
- Different component structure
- This archive is excluded from TypeScript compilation and is not actively used

## Known Issues / Notes

1. **Static Data**: All workout data is hardcoded - no dynamic loading
2. **No Persistence**: Exercise logging doesn't persist across page refreshes
3. **Limited Error Handling**: Minimal error boundaries or error states
4. **Temp Page**: `/temp` route exists for development/testing
5. **Overview Page**: Very large file (3670+ lines) - component showcase/playground
6. **No Tests**: No test files present in the codebase

## Future Enhancement Possibilities

Based on the codebase structure, potential enhancements could include:
- Database integration for data persistence
- User authentication and personalization
- Workout history tracking
- Progress analytics and visualizations
- Integration with fitness tracking services
- Workout plan customization
- Exercise library/search
- Workout sharing capabilities
- Mobile app version
- Offline functionality with service workers

---

**Last Updated**: Based on current codebase state
**Version**: 1.0.0 (per package.json)
**Framework**: Next.js 14 with App Router
**Primary Use Case**: Training plan visualization and workout viewing
