# Implementation Plan: Date-Based Match Navigation

## Overview

This implementation replaces the existing "All" / "Finished" toggle filter with a date-based navigation system. The approach is fully client-side, computing available dates from already-loaded fixture data. The implementation follows this order:
1. Create date utility functions
2. Build the DateNavigator UI component
3. Update MatchesPage to integrate date navigation
4. Update Matches component to filter by date instead of finished status
5. Manual testing and polish

## Tasks

- [x] 1. Create DateUtils utility module
  - Create `src/utils/DateUtils.ts` with utility functions for date operations
  - Implement `toMidnight(date: Date): Date` to normalize dates to midnight in local timezone
  - Implement `isSameDay(date1: Date, date2: Date): boolean` for date-only comparison
  - Implement `getRelativeDateLabel(date: Date): string` for "Today"/"Yesterday"/"Tomorrow"/DD/MM/YY formatting
  - Implement `findNearestDate(target: Date, availableDates: Date[]): Date | null` to find closest available date
  - _Requirements: 1.3, 3.1, 3.2, 3.3, 3.4_

- [x] 2. Create DateNavigator component
  - [x] 2.1 Create component file and interface
    - Create `src/components/ui/date-navigator/DateNavigator.tsx`
    - Define `DateNavigatorProps` interface with `selectedDate`, `onDateChange`, and `availableDates`
    - Import `ChevronLeft` and `ChevronRight` from `lucide-react`
    - Import `motion` from `motion/react` for animations
    - _Requirements: 2.1, 2.2, 8.2_

  - [x] 2.2 Implement date label display
    - Use `DateUtils.getRelativeDateLabel()` to display the selected date
    - Show "No Matches" when `availableDates` is empty
    - Apply Tailwind CSS classes consistent with TogglePill styling (emerald color scheme)
    - Center the label between navigation arrows
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 8.1, 8.4_

  - [x] 2.3 Implement navigation arrow buttons
    - Add left arrow button that calls `handlePrevious()` on click
    - Add right arrow button that calls `handleNext()` on click
    - Implement `handlePrevious()`: find index of current date in `availableDates`, navigate to previous index if exists
    - Implement `handleNext()`: find index of current date in `availableDates`, navigate to next index if exists
    - Disable left arrow when `selectedDate` is first in `availableDates`
    - Disable right arrow when `selectedDate` is last in `availableDates`
    - Apply disabled styling with reduced opacity for disabled arrows
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 2.4 Add Motion animations
    - Wrap component in `motion.div` with initial/animate variants
    - Add hover effects on arrow buttons using `motion.button`
    - Match animation timing and easing with existing SubjectButtons component
    - _Requirements: 8.3_

- [x] 3. Update MatchesPage to integrate date navigation
  - [x] 3.1 Add date state and computation logic
    - Import `useState` and `useMemo` from React
    - Import `DateUtils` from `src/utils/DateUtils.ts`
    - Add `selectedDate` state initialized to `DateUtils.toMidnight(new Date())`
    - Implement `extractAvailableDates(fixtures: MatchModel[], competition: string): Date[]` function
    - Use `useMemo` to compute `availableDates` from `matchesResponse.fixtures` and `selectedCompetition`
    - Ensure `availableDates` returns sorted array (ascending) of unique dates normalized to midnight
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 6.1, 6.2_

  - [x] 3.2 Implement date synchronization on competition change
    - Add `useEffect` that watches `selectedCompetition` changes
    - When competition changes, check if `selectedDate` exists in new `availableDates`
    - If not, call `DateUtils.findNearestDate()` to find nearest available date
    - Update `selectedDate` to nearest date or keep current if exact match exists
    - Handle edge case where `availableDates` is empty (no fixtures for competition)
    - _Requirements: 4.1, 4.2, 6.4_

  - [x] 3.3 Replace TogglePill with DateNavigator
    - Remove `import` statement for `TogglePill`
    - Remove `filterMode` state and `setFilterMode` function
    - Import `DateNavigator` component
    - Replace `<TogglePill ... />` with `<DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} availableDates={availableDates} />`
    - Maintain visual hierarchy: SubjectButtons, then DateNavigator, then Matches
    - _Requirements: 7.1, 7.2, 7.4_

  - [x] 3.4 Update Matches component props
    - Remove `showFinishedOnly={filterMode === "finished"}` prop
    - Add `selectedDate={selectedDate}` prop
    - Remove `key={selectedCompetition}` (no longer needed since we're not unmounting/remounting)
    - _Requirements: 5.3, 7.3_

- [x] 4. Update Matches component for date filtering
  - [x] 4.1 Update component props interface
    - Update `Props` type to remove `showFinishedOnly: boolean`
    - Add `selectedDate: Date` to `Props` type
    - Import `DateUtils` from `src/utils/DateUtils.ts`
    - _Requirements: 7.3_

  - [x] 4.2 Implement date-based filtering logic
    - Remove `.filter((m) => !showFinishedOnly || m.finished)` filter
    - Add `.filter((m) => DateUtils.isSameDay(new Date(m.matchDateTime), selectedDate))` filter
    - Keep existing competition filter
    - Keep existing sorting by `matchDateTime` descending (latest match first)
    - Ensure all matches (finished and unfinished) for the selected date are shown
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5. Verify build and lint
  - Verify no TypeScript compilation errors with `npm run build`
  - Run `npm run lint` to check for linting issues
  - Fix any build errors or linting issues before proceeding
  - Ask the user if questions arise

## Notes

- All code should use TypeScript with strict mode
- Follow existing project conventions for component structure and styling
- Use Tailwind CSS utility classes matching the existing design system
- Maintain consistency with Motion animation patterns used in SubjectButtons and TogglePill
- All date operations use local timezone (no UTC conversion)
- No additional API calls required - all logic operates on existing loader data
