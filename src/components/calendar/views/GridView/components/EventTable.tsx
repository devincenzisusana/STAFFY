import { Table, SortConfig } from "@/components/common/Table";
import { Event } from "@/services/events";
import { createEventTableColumns } from "./eventTableColumns";

interface EventTableProps {
  events: Event[];
  sortConfig: SortConfig;
  onSort: (key: string) => void;
  onEventClick: (event: Event) => void;
  onVisibilityChange?: (eventId: string, isPublic: boolean) => void;
}

export const EventTable = ({
  events,
  sortConfig,
  onSort,
  onEventClick,
  onVisibilityChange,
}: EventTableProps) => {
  console.log("📊 EventTable - Received events:", events);
  console.log("📊 EventTable - Events count:", events.length);

  // Sort data
  const sortedEvents = [...events].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof Event];
    const bValue = b[sortConfig.key as keyof Event];

    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const columns = createEventTableColumns(onVisibilityChange);

  return (
    <Table
      columns={columns}
      data={sortedEvents}
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onEventClick}
      emptyMessage="No events found."
    />
  );
};
