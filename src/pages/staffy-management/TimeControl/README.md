# TimeControl Component Structure

This directory contains the refactored TimeControl page, organized into smaller, more manageable components.

## Directory Structure

```
TimeControl/
├── TimeControl.tsx           # Main component (orchestrates all hooks and components)
├── index.ts                  # Public export
├── hooks/                    # Custom hooks for logic
│   ├── index.ts              # Barrel export
│   ├── types.ts              # TypeScript types
│   ├── useTimeEntries.ts     # Data fetching and transformation
│   ├── useStaffData.ts       # Staff options loading
│   ├── useTimeControlModals.ts  # Modal state management
│   └── useDateRangeFilter.ts    # Date filtering logic
├── components/               # Presentational components
│   └── TimeControlFilters.tsx   # Filter UI controls
├── utils/                    # Pure utility functions
│   ├── index.ts              # Barrel export
│   └── filters.ts            # Date filtering and calculations
└── handlers/                 # Business logic handlers
    ├── index.ts              # Barrel export
    └── timeControlHandlers.ts   # Clock in/out handlers
```

## Components

### TimeControl.tsx

Main component that:

- Orchestrates all hooks and manages state
- Renders the layout and child components
- Coordinates data flow between hooks and UI

### TimeControlFilters.tsx

Presentational component for filter controls:

- Start date input
- End date input
- Search input
  Accepts props for values and change handlers.

## Hooks

### useTimeEntries

Manages time entries data:

- **State**: `timeEntries`, `isLoading`
- **Methods**: `loadTimeEntries()`
- **Features**: Data transformation, uses shared `formatInterval` from `utils/timeUtils`
- **Note**: Page-specific hook, unique to TimeControl

### useStaffOptions (Shared Hook)

Loads staff options for dropdowns:

- **Location**: `../hooks/useStaffOptions.ts` (shared across all pages)
- **State**: `staffOptions`, `isLoading`
- **Methods**: `reload()`
- **Features**: Auto-loads on mount, formats staff names from database
- **Used By**: TimeControl, CreateTaskModal, CreateAbsenceModal

### useTimeControlModals

Manages modal state:

- **State**: Clock in/out modal visibility, selected entry
- **Methods**: Open/close handlers, row click handler
- **Features**: Automatic state cleanup on close

### useDateRangeFilter

Manages date range filtering:

- **State**: `startDate`, `endDate`
- **Methods**: `setStartDate()`, `setEndDate()`, `clearFilters()`

## Utilities

### formatInterval(interval: string): string

Converts PostgreSQL interval format to HH:MM display format.

### filterByDateRange(entries, startDate, endDate): TimeEntry[]

Filters time entries by date range.

### calculateTotalHours(entries): number

Calculates total hours from time entries.

## Handlers

### handleClockIn(data, onSuccess)

Processes clock in submission:

- Calls timeControlService.clockIn()
- Handles duplicate entry errors
- Shows user-friendly error messages
- Calls onSuccess callback to refresh data

### handleClockOut(entryId, data, onSuccess)

Processes clock out submission:

- Formats break duration to PostgreSQL interval
- Calls timeControlService.clockOut()
- Calls onSuccess callback to refresh data

## Data Flow

1. **Load Phase**:

   - `useTimeEntries` fetches data on mount
   - `useStaffData` loads staff options on mount

2. **Filter Phase**:

   - User enters search query → `useEntityFilters`
   - User selects date range → `useDateRangeFilter`
   - `filterByDateRange` applies date filtering
   - `useTableSort` applies sorting

3. **Action Phase**:
   - User clicks "Clock In" → Opens modal
   - User submits → `handleClockIn` → Refreshes data
   - User clicks row → `handleRowClick` → Opens clock out modal
   - User submits → `handleClockOut` → Refreshes data

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Reusability**: Hooks and utilities can be used in other components
3. **Testability**: Pure functions and isolated hooks are easy to test
4. **Maintainability**: Changes to one concern don't affect others
5. **Readability**: Main component is concise and easy to understand
6. **Type Safety**: TypeScript types are centralized in types.ts

## Usage Example

```tsx
import { TimeControl } from "./TimeControl";

// Use in routing
<Route path="/time-control" element={<TimeControl />} />;
```

## Dependencies

### Internal Dependencies

- `../hooks/useStaffOptions`: **Shared hook** for staff dropdown data
- `../utils/timeUtils`: **Shared utilities** for time formatting
- `../hooks/useEntityFilters`: **Shared hook** for search/filter logic
- `@/services/timeControl`: timeControlService for time entry API calls
- `@/services/staff`: staffService used by shared `useStaffOptions` hook

### Component Dependencies

- `@/components/common`: Button, Input, Table hooks
- `@/components/shared`: PageContent, FilterBar, SummaryBox
- `@/layouts/dashboard`: DashboardLayout

### Page-Level Resources

- `./hooks/`: Page-specific hooks (not reusable outside TimeControl)
- `./components/`: Page-specific components
- `./handlers/`: Page-specific business logic
- `./utils/`: Page-specific utilities

## Future Enhancements

- Extract TimeControlTable configuration to separate file
- Add unit tests for utilities and handlers
- Create custom hook for total hours calculation
- Add loading states for individual operations
- Extract error handling to centralized error boundary
