import { useState } from "react";
import { SortConfig } from "@/components/common/Table";
import { Schedule } from "../../hooks";
import { Event } from "@/services/events";
import { ScheduleTable } from "./components/ScheduleTable";
import { EventTable } from "./components/EventTable";
import "./GridView.css";

interface GridViewProps {
  schedules: Schedule[];
  events: Event[];
  viewMode: "calendar" | "events";
  onScheduleClick: (schedule: Schedule) => void;
  onEventClick: (event: Event) => void;
  onScheduleUpdate?: () => void;
  onEventUpdate?: () => void;
}

export const GridView = ({
  schedules,
  events,
  viewMode,
  onScheduleClick,
  onEventClick,
  onScheduleUpdate,
  onEventUpdate,
}: GridViewProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: viewMode === "calendar" ? "startDate" : "date",
    direction: "asc",
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleVisibilityChange = async (eventId: string, isPublic: boolean) => {
    try {
      const { eventService } = await import("@/services/events");
      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      await eventService.updateEvent(eventId, {
        title: event.title,
        description: event.description || "",
        date: event.date,
        isPublic,
      });

      if (onEventUpdate) {
        onEventUpdate();
      }
    } catch (error) {
      console.error("Error updating event visibility:", error);
    }
  };

  return (
    <div className="grid-view">
      {viewMode === "calendar" ? (
        <ScheduleTable
          schedules={schedules}
          sortConfig={sortConfig}
          onSort={handleSort}
          onScheduleClick={onScheduleClick}
          onScheduleUpdate={onScheduleUpdate}
        />
      ) : (
        <EventTable
          events={events}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEventClick={onEventClick}
          onVisibilityChange={handleVisibilityChange}
        />
      )}
    </div>
  );
};
