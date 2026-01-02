# DayCard Component Usage

The `DayCard` component is a shared base component for displaying day/exercise cards with tags, completion state, and labels.

## Base Component: DayCard

### Props

```typescript
interface DayCardProps {
  dayName: string;           // Main title (e.g., "Monday", "Trap Bar Deadlift")
  dayLabel?: string;         // Optional label in header (e.g., "Rest", "60% RPE")
  tags: Tag[];               // Array of tag objects
  isCompleted: boolean;      // Completion state
  onToggleComplete: () => void; // Handler for toggling completion
}

interface Tag {
  text: string;
  variant: 'outlined' | 'filled';
}
```

### Features

- **Completion States**: 
  - Default: Black background (#000), white text
  - Completed: Bright green background (#00FF00), white text
  - Smooth 200ms transition between states

- **Layout**:
  - Header row with dayName (left) and dayLabel (right, space-between)
  - Tags row below with 4px gap
  - Checkmark icon (absolute positioned top-right) when completed
  - Clickable card to toggle completion

## Usage Examples

### Example 1: DayExerciseCard

```tsx
import DayExerciseCard from './components/DayExerciseCard';
import { useState } from 'react';

function ExerciseList() {
  const [completed, setCompleted] = useState(false);

  return (
    <DayExerciseCard
      exerciseName="Trap Bar Deadlift"
      sets={3}
      reps={8}
      weight="#165"
      exerciseNote="60%"
      isCompleted={completed}
      onToggleComplete={() => setCompleted(!completed)}
    />
  );
}
```

This renders:
- **dayName**: "Trap Bar Deadlift"
- **dayLabel**: "60% RPE" (top right)
- **tags**: 
  - "3" (outlined)
  - "8" (outlined)
  - "#165" (outlined)

### Example 2: WeekDayCard

```tsx
import WeekDayCard from './components/WeekDayCard';
import { useState } from 'react';

function WeekView() {
  const [completed, setCompleted] = useState(false);

  return (
    <WeekDayCard
      dayName="Monday"
      runInfo="3 miles"
      vert="1500"
      zone="Z3"
      hasPT={true}
      ptType="PT"
      intensity="Rest"
      isCompleted={completed}
      onToggleComplete={() => setCompleted(!completed)}
    />
  );
}
```

This renders:
- **dayName**: "Monday"
- **dayLabel**: "Rest" (top right)
- **tags**:
  - "3 miles" (outlined)
  - "1500" (outlined)
  - "Z3" (outlined)
  - "PT" (filled - white background)

## Direct DayCard Usage

You can also use `DayCard` directly:

```tsx
import DayCard from './components/DayCard';
import { useState } from 'react';

function CustomCard() {
  const [completed, setCompleted] = useState(false);

  return (
    <DayCard
      dayName="Tuesday"
      dayLabel="TTT"
      tags={[
        { text: "6 miles", variant: 'outlined' },
        { text: "PT", variant: 'filled' }
      ]}
      isCompleted={completed}
      onToggleComplete={() => setCompleted(!completed)}
    />
  );
}
```

## Migration Notes

The refactored components (`DayExerciseCard` and `WeekDayCard`) now:
- Use the shared `DayCard` base component
- Support completion states with green background and checkmark
- Are clickable to toggle completion
- Maintain backward compatibility with existing props (with optional `isCompleted` and `onToggleComplete`)

**Breaking Changes:**
- X icon separators between tags have been removed for simplicity
- Background color changed from #080808 to #000 (black)
- Components now require `isCompleted` and `onToggleComplete` props (default to false/empty function if not provided)

