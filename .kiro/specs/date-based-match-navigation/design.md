# Design Document: Date-Based Match Navigation

## Overview

This feature implements a date-based navigation system for the MatchesPage, replacing the existing "All" / "Finished" toggle with a SofaScore-style date selector. The design emphasizes client-side performance by computing available dates from already-loaded fixture data, eliminating the need for additional API calls.

### Key Design Decisions

1. **Client-Side Date Computation**: All date extraction and filtering will be performed on the fixtures array already loaded by the MatchesLoader, avoiding additional network requests
2. **Timezone Handling**: All date comparisons will use the client's local timezone (`Date` objects without UTC conversion) to ensure intuitive behavior for users
3. **Component Architecture**: A new `DateNavigator` component will encapsulate all date navigation logic, keeping concerns separated from the page-level component
4. **Available Dates Only**: Navigation arrows will skip dates with no fixtures for the selected competition, providing a seamless browsing experience

### Research Summary

**JavaScript Date Handling:**
- `Date` objects in JavaScript are timezone-aware and represent moments in time
- For date-only comparisons, we'll normalize to midnight in the local timezone using `setHours(0, 0, 0, 0)`
- The `.toLocaleDateString()` method provides locale-aware date formatting

**React State Management:**
- Date state will be managed using `useState` at the MatchesPage level
- Date changes will trigger re-renders of the Matches component with filtered data
- The selected date will reset to "today" or the nearest available date when the competition changes

**Performance Considerations:**
- Pre-computing the sorted array of available dates on competition change ensures O(log n) navigation
- Memoizing filtered matches prevents unnecessary re-renders

## Architecture

### Component Hierarchy

```
MatchesPage (page component)
├── SubjectButtons (existing - competition filter)
├── DateNavigator (new component)
│   ├── ChevronLeft icon (from lucide-react)
│   ├── Date label (relative or formatted)
│   └── ChevronRight icon (from lucide-react)
└── Matches (existing - updated to filter by date)
```

### Data Flow

```mermaid
graph TD
    A[MatchesLoader] -->|FixturesResponse| B[MatchesPage]
    B -->|competitions[]| C[SubjectButtons]
    B -->|selectedCompetition| D[DateNavigator]
    B -->|fixtures[]| D
    D -->|selectedDate| B
    B -->|filtered matches| E[Matches]
    C -->|competition change| B
    D -->|date change| B
```

### State Management

**MatchesPage State:**
- `selectedCompetition: string` (existing)
- `selectedDate: Date` (new - defaults to current date at midnight)

**Derived State:**
- `availableDates: Date[]` - computed from fixtures for the selected competition
- `filteredMatches: MatchModel[]` - matches for selected competition and date

## Components and Interfaces

### DateNavigator Component

**Purpose:** Provides UI controls for navigating between dates with available fixtures.

**Props Interface:**
```typescript
interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  availableDates: Date[]; // sorted ascending
}
```

**Responsibilities:**
- Display the current selected date with relative labels ("Yesterday", "Today", "Tomorrow") or DD/MM/YY format
- Render left/right arrow buttons for navigation
- Disable arrows when no previous/next dates are available
- Apply Motion animations consistent with existing UI

**Key Methods:**
- `getRelativeDateLabel(date: Date): string` - returns relative label or formatted date
- `handlePrevious()` - navigates to the closest previous available date
- `handleNext()` - navigates to the closest next available date

### MatchesPage Updates

**New Utility Functions:**
```typescript
/**
 * Extracts unique dates from fixtures for a given competition.
 * Normalizes each matchDateTime to midnight in local timezone.
 * Returns sorted array (ascending).
 */
function extractAvailableDates(
  fixtures: MatchModel[],
  competition: string
): Date[]

/**
 * Finds the nearest available date to the target date.
 * Prefers exact match, then future dates, then past dates.
 */
function findNearestAvailableDate(
  targetDate: Date,
  availableDates: Date[]
): Date | null

/**
 * Compares two dates by year/month/day only (ignores time).
 */
function isSameDay(date1: Date, date2: Date): boolean
```

**State Updates:**
- Add `selectedDate` state (initialized to current date at midnight)
- Compute `availableDates` using `useMemo` when competition or fixtures change
- Reset `selectedDate` to nearest available date when competition changes

### Matches Component Updates

**Prop Changes:**
- Remove `showFinishedOnly: boolean`
- Add `selectedDate: Date`

**Filtering Logic Updates:**
```typescript
const filteredMatches = matches
  .filter(m => m.competition.toLowerCase() === selectedCompetition.toLowerCase())
  .filter(m => isSameDay(new Date(m.matchDateTime), selectedDate))
  .map(m => ({ ...m, matchDateTime: new Date(m.matchDateTime) }))
  .sort((a, b) => b.matchDateTime.getTime() - a.matchDateTime.getTime());
```

## Data Models

### Existing Models (No Changes)

**MatchModel:**
```typescript
interface MatchModel {
  id: string;
  venue: string;
  competition: string;
  matchDateTime: Date; // ISO string from API, converted to Date
  finished: boolean;
  // ... other fields
}
```

**FixturesResponse:**
```typescript
interface FixturesResponse {
  competitions: string[];
  fixtures: MatchModel[];
}
```

### Date Utilities

**DateComparisonUtils:**
```typescript
export const DateUtils = {
  /**
   * Normalizes a date to midnight in local timezone
   */
  toMidnight(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  },

  /**
   * Checks if two dates represent the same calendar day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },

  /**
   * Returns relative label or formatted date string
   */
  getRelativeDateLabel(date: Date): string {
    const today = DateUtils.toMidnight(new Date());
    const targetMidnight = DateUtils.toMidnight(date);
    const diffDays = Math.round(
      (targetMidnight.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays === 1) return "Tomorrow";

    // Format as DD/MM/YY
    const day = String(targetMidnight.getDate()).padStart(2, '0');
    const month = String(targetMidnight.getMonth() + 1).padStart(2, '0');
    const year = String(targetMidnight.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  },

  /**
   * Finds the nearest available date to the target
   */
  findNearestDate(target: Date, availableDates: Date[]): Date | null {
    if (availableDates.length === 0) return null;

    const targetMidnight = DateUtils.toMidnight(target);

    // Check for exact match
    const exactMatch = availableDates.find(d =>
      DateUtils.isSameDay(d, targetMidnight)
    );
    if (exactMatch) return exactMatch;

    // Find nearest future date
    const futureDates = availableDates
      .filter(d => d.getTime() > targetMidnight.getTime())
      .sort((a, b) => a.getTime() - b.getTime());

    if (futureDates.length > 0) return futureDates[0];

    // Fall back to most recent past date
    return availableDates[availableDates.length - 1];
  }
};
```



## Error Handling

### Invalid State Recovery

**No Available Dates:**
- If `extractAvailableDates()` returns an empty array (no fixtures for selected competition), the DateNavigator should display a disabled state with "No Matches" label
- Both arrow buttons should be disabled
- The Matches component should render an empty state message

**Date Synchronization:**
- When competition changes, if the current `selectedDate` has no fixtures in the new competition, automatically navigate to the nearest available date
- If no dates are available at all, set `selectedDate` to current date (even if no matches exist) and show empty state

**Invalid Date Objects:**
- All date parsing from `matchDateTime` should validate using `isNaN(date.getTime())` to catch invalid dates
- Invalid dates should be filtered out during `extractAvailableDates()` computation and logged as warnings

### User Experience

**Loading States:**
- While the MatchesLoader is fetching data, show a spinner (existing behavior)
- Date navigation controls remain interactive during re-renders to avoid perceived lag

**Timezone Edge Cases:**
- All date operations use local timezone consistently
- Users traveling across timezones will see dates relative to their current timezone
- No UTC conversion is performed to avoid confusion

## Testing Strategy

### Property-Based Testing Assessment

This feature is **NOT suitable** for property-based testing because:

1. **UI Rendering Focus**: The primary functionality involves React component rendering and user interactions (button clicks, conditional styling)
2. **Date Navigation is UI State**: The date navigation logic is tightly coupled to UI state management and event handlers
3. **No Pure Functions with Complex Input Space**: While there are date utility functions, they have limited input variation (dates within a constrained range)
4. **Integration Testing More Valuable**: Testing the interaction between DateNavigator, MatchesPage state, and the Matches component requires component integration tests, not property tests

**Alternative Testing Strategies:**
- **Unit tests** for date utility functions (`DateUtils`)
- **Component tests** using React Testing Library for DateNavigator interactions
- **Integration tests** for the full date navigation workflow

### Unit Testing Strategy

**Date Utility Functions** (`src/utils/DateUtils.ts`):

Test cases for `toMidnight()`:
- Returns date with hours/minutes/seconds/milliseconds set to 0
- Does not mutate the input date
- Preserves the date portion (year, month, day)

Test cases for `isSameDay()`:
- Returns true for dates on the same calendar day with different times
- Returns false for dates on different days
- Handles month/year boundaries correctly

Test cases for `getRelativeDateLabel()`:
- Returns "Today" for current date
- Returns "Yesterday" for date one day in the past
- Returns "Tomorrow" for date one day in the future
- Returns DD/MM/YY format for dates more than one day away
- Correctly formats single-digit days and months with leading zeros

Test cases for `findNearestDate()`:
- Returns exact match when available
- Returns nearest future date when no exact match
- Returns most recent past date when no future dates available
- Returns null for empty availableDates array

**Date Extraction** (`extractAvailableDates` function):
- Extracts unique dates from fixtures for a specific competition
- Filters out fixtures from other competitions
- Normalizes all dates to midnight
- Returns dates sorted in ascending order
- Handles empty fixtures array
- Handles fixtures with invalid matchDateTime values

**Match Filtering** (integration with Matches component):
- Filters matches by both competition and selected date
- Sorts filtered matches by kickoff time descending
- Shows all matches (finished and unfinished) for the selected date
- Handles edge case where selectedDate has no matches

### Component Testing Strategy

**DateNavigator Component:**

Test cases:
- Renders selected date with correct relative label ("Today", "Yesterday", "Tomorrow")
- Renders selected date with DD/MM/YY format for distant dates
- Disables left arrow when selectedDate is the first available date
- Disables right arrow when selectedDate is the last available date
- Calls onDateChange with previous date when left arrow clicked
- Calls onDateChange with next date when right arrow clicked
- Does not call onDateChange when disabled arrow is clicked
- Renders "No Matches" when availableDates is empty
- Applies correct CSS classes for disabled state

**MatchesPage Integration:**

Test cases:
- Initializes selectedDate to current date on mount
- Computes availableDates from fixtures for selected competition
- Updates availableDates when competition changes
- Resets selectedDate to nearest available when competition changes and current date is unavailable
- Passes filtered matches to Matches component
- Does not re-render DateNavigator unnecessarily when unrelated state changes

### Manual Testing Checklist

- [ ] Default view shows "Today" with today's matches
- [ ] Clicking left arrow navigates to previous available date
- [ ] Clicking right arrow navigates to next available date
- [ ] Arrow buttons disable correctly at boundaries
- [ ] Changing competition updates available dates and resets date if needed
- [ ] Relative labels display correctly for Yesterday/Today/Tomorrow
- [ ] DD/MM/YY format displays correctly for distant dates
- [ ] Matches are sorted by kickoff time descending
- [ ] Empty state displays when no matches for selected date
- [ ] Animations match existing UI (consistent with SubjectButtons and TogglePill)
- [ ] Mobile responsive (buttons and labels fit on small screens)
- [ ] No console errors or warnings

## Implementation Plan

### Phase 1: Date Utilities
1. Create `src/utils/DateUtils.ts` with utility functions
2. Write unit tests for all utility functions
3. Verify edge cases (month boundaries, year boundaries, timezone consistency)

### Phase 2: DateNavigator Component
1. Create `src/components/ui/date-navigator/DateNavigator.tsx`
2. Implement UI with ChevronLeft, date label, ChevronRight
3. Add Motion animations consistent with existing components
4. Add component tests for interaction behavior

### Phase 3: MatchesPage Integration
1. Update MatchesPage to add `selectedDate` state
2. Implement `extractAvailableDates` function with memoization
3. Implement logic to reset date when competition changes
4. Remove TogglePill component
5. Add DateNavigator component between SubjectButtons and Matches

### Phase 4: Matches Component Update
1. Update Matches component props (remove `showFinishedOnly`, add `selectedDate`)
2. Update filtering logic to filter by date instead of finished status
3. Ensure sorting remains descending by kickoff time

### Phase 5: Testing & Polish
1. Run all unit and component tests
2. Perform manual testing on all test cases
3. Test responsive behavior on mobile devices
4. Verify animations and transitions
5. Check accessibility (keyboard navigation, ARIA labels)

## Acceptance Criteria Validation

This design addresses all requirements from the requirements document:

- **Requirement 1 (Default Date View)**: MatchesPage initializes `selectedDate` to `DateUtils.toMidnight(new Date())`
- **Requirement 2 (Date Navigation Controls)**: DateNavigator implements left/right arrows with skip-to-available-date logic
- **Requirement 3 (Relative Date Labels)**: `DateUtils.getRelativeDateLabel()` implements Yesterday/Today/Tomorrow/DD/MM/YY logic
- **Requirement 4 (Integration with Competition Filter)**: `availableDates` recomputes on competition change; date resets to nearest available
- **Requirement 5 (Match Filtering and Sorting)**: Matches component filters by date using `isSameDay()` and sorts descending by kickoff time
- **Requirement 6 (Client-Side Implementation)**: All logic operates on the FixturesResponse data; no additional API calls
- **Requirement 7 (Replace Existing Filter UI)**: TogglePill removed; DateNavigator replaces it; `showFinishedOnly` prop removed
- **Requirement 8 (Visual Consistency)**: DateNavigator uses Tailwind, lucide-react icons, Motion animations, and emerald color scheme
