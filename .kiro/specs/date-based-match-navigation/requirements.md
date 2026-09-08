# Requirements Document

## Introduction

This feature replaces the current "All" / "Finished" filter on the MatchesPage with a SofaScore-style date-based navigation system. Users will be able to navigate through different dates to view matches that occurred on specific days, with intuitive relative date labels and arrow-based navigation.

## Glossary

- **Date_Navigator**: The UI component that allows users to navigate between dates with available fixtures
- **Match_Filter**: The logic that filters matches based on the selected date
- **Relative_Date_Label**: A human-readable date display (e.g., "Yesterday", "Today", "Tomorrow")
- **Available_Date**: A date that has at least one match fixture for the selected competition
- **MatchesPage**: The page component that displays the list of matches (`src/pages/MatchesPage.tsx`)
- **Matches_Component**: The component that renders the filtered list of match cards (`src/components/features/matches/Matches.tsx`)
- **Competition_Filter**: The existing SubjectButtons component that filters matches by competition/league

## Requirements

### Requirement 1: Default Date View

**User Story:** As a user, I want to see today's matches by default, so that I can quickly access current fixtures without additional navigation.

#### Acceptance Criteria

1. WHEN the MatchesPage loads, THE Date_Navigator SHALL display "Today" as the selected date
2. THE Matches_Component SHALL display only matches that occur on the current date
3. THE Date_Navigator SHALL determine the current date using the client's local timezone

### Requirement 2: Date Navigation Controls

**User Story:** As a user, I want to navigate between dates using arrow buttons, so that I can browse fixtures from different days.

#### Acceptance Criteria

1. THE Date_Navigator SHALL display a left arrow button for navigating to previous dates
2. THE Date_Navigator SHALL display a right arrow button for navigating to next dates
3. WHEN the user clicks the left arrow, THE Date_Navigator SHALL navigate to the nearest previous date that has available fixtures for the selected competition
4. WHEN the user clicks the right arrow, THE Date_Navigator SHALL navigate to the nearest next date that has available fixtures for the selected competition
5. IF there are no fixtures available in the previous direction, THEN THE Date_Navigator SHALL disable the left arrow button
6. IF there are no fixtures available in the next direction, THEN THE Date_Navigator SHALL disable the right arrow button

### Requirement 3: Relative Date Labels

**User Story:** As a user, I want to see intuitive date labels like "Today" and "Yesterday", so that I can quickly understand what timeframe I'm viewing.

#### Acceptance Criteria

1. WHEN the selected date is the current day, THE Date_Navigator SHALL display "Today"
2. WHEN the selected date is one day before the current day, THE Date_Navigator SHALL display "Yesterday"
3. WHEN the selected date is one day after the current day, THE Date_Navigator SHALL display "Tomorrow"
4. WHEN the selected date is more than one day away from the current day, THE Date_Navigator SHALL display the date in DD/MM/YY format (e.g., "15/01/24")
5. THE Relative_Date_Label SHALL update whenever the selected date changes

### Requirement 4: Integration with Competition Filter

**User Story:** As a user, I want date navigation to work seamlessly with competition filtering, so that I can view fixtures for specific leagues on specific dates.

#### Acceptance Criteria

1. WHEN the user changes the selected competition, THE Date_Navigator SHALL recalculate available dates based on the new competition
2. IF the currently selected date has no fixtures for the new competition, THEN THE Date_Navigator SHALL automatically navigate to the nearest date with available fixtures
3. THE Match_Filter SHALL filter matches by both selected competition AND selected date
4. THE Competition_Filter SHALL remain visible and functional above the Date_Navigator

### Requirement 5: Match Filtering and Sorting by Date

**User Story:** As a user, I want to see only matches from the selected date sorted with the latest matches first, so that I can focus on the most recent fixtures from a specific day.

#### Acceptance Criteria

1. THE Match_Filter SHALL compare match dates using only the date portion (year, month, day), ignoring time components
2. WHEN filtering matches, THE Match_Filter SHALL use the client's local timezone to determine date boundaries
3. THE Matches_Component SHALL display all matches from the selected date for the selected competition, regardless of match status (finished, live, or scheduled)
4. THE Matches_Component SHALL sort matches by kickoff time in descending order (latest match first, earliest match last)
5. THE Match_Filter SHALL not distinguish between finished and unfinished matches when displaying fixtures

### Requirement 6: Client-Side Implementation

**User Story:** As a developer, I want date navigation to work entirely client-side, so that we don't need backend changes and the feature remains performant.

#### Acceptance Criteria

1. THE Date_Navigator SHALL compute available dates by analyzing the fixtures array returned from the existing API endpoint
2. THE Match_Filter SHALL operate on the fixtures data already loaded by the MatchesPage loader
3. THE Date_Navigator SHALL not make additional API calls when navigating between dates
4. WHEN the MatchesPage loader refreshes fixture data, THE Date_Navigator SHALL recalculate available dates based on the new data

### Requirement 7: Replace Existing Filter UI

**User Story:** As a user, I want a cleaner interface without the confusing "All" / "Finished" toggle, so that I can focus on date-based browsing.

#### Acceptance Criteria

1. THE MatchesPage SHALL remove the TogglePill component that displays "All" and "Finished" options
2. THE Date_Navigator SHALL replace the TogglePill component in the same UI location
3. THE Matches_Component SHALL no longer accept or use the `showFinishedOnly` prop
4. THE MatchesPage SHALL maintain the existing visual hierarchy (Competition_Filter above Date_Navigator above Matches_Component)

### Requirement 8: Visual Consistency

**User Story:** As a user, I want the date navigator to match the app's existing design language, so that the interface feels cohesive.

#### Acceptance Criteria

1. THE Date_Navigator SHALL use Tailwind CSS classes consistent with the existing UI components
2. THE Date_Navigator SHALL use icons from the lucide-react library for arrow buttons
3. THE Date_Navigator SHALL use Motion animations consistent with other page elements
4. THE Date_Navigator SHALL use the emerald color scheme matching the existing TogglePill component
