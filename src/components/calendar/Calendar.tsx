import { useState } from "react";
import { CalendarHeader } from "./components/CalendarHeader";
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";
import { GridView } from "./views/GridView";
import { ScheduleModal } from "./modals/ScheduleModal";
import { SendCalendarModal } from "./modals/SendCalendarModal";
import { EventModal } from "./modals/EventModal";
import { ConfirmationModal } from "@/components/common/Modal";
import { ListModal } from "@/components/common/Modal";
import { ScheduleItem } from "./components/ScheduleItem";
import { navigatePrevious, navigateNext, getToday } from "./utils";
import { useScheduleData, Schedule } from "./hooks";
import { eventService, Event } from "@/services/events";
import { useQuery } from "@tanstack/react-query";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { useCalendarHandlers } from "./handlers";
import "./Calendar.css";

interface CalendarProps {
  userRole?: string | null;
}

export const Calendar = ({ userRole }: CalendarProps) => {
  const { scheduleData, loadSchedules } = useScheduleData();
  const [currentDate, setCurrentDate] = useState(getToday());
  const [view, setView] = useState<"month" | "week" | "grid">("month");
  const [viewMode, setViewMode] = useState<"calendar" | "events">("calendar");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch events data
  const { data: eventsData = [], refetch: refetchEvents } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getEvents(),
  });

  // Real-time subscription for events
  useRealtimeSubscription({
    table: "events",
    queryKey: ["events"],
    event: "*",
  });

  // Use calendar handlers hook
  const {
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    scheduleModalMode,
    isSendModalOpen,
    setIsSendModalOpen,
    isEventModalOpen,
    setIsEventModalOpen,
    eventModalMode,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    isListModalOpen,
    setIsListModalOpen,
    listModalSchedules,
    selectedSchedule,
    setSelectedSchedule,
    selectedEvent,
    setSelectedEvent,
    handleCreateSchedule,
    handleCreateEvent,
    handleDayClick,
    handleScheduleClick,
    handleEventClick,
    handleMoreClick,
    handleListItemClick,
    handleEditSchedule,
    handleDeleteSchedule,
    confirmDelete,
    handleSendCalendar,
    handleEventSubmit,
    handleScheduleSubmit,
    handleSendSubmit,
  } = useCalendarHandlers(viewMode, loadSchedules, refetchEvents);

  const handlePrevious = () => {
    if (view === "grid") return; // Grid view doesn't have navigation
    setCurrentDate(navigatePrevious(currentDate, view));
  };

  const handleNext = () => {
    if (view === "grid") return; // Grid view doesn't have navigation
    setCurrentDate(navigateNext(currentDate, view));
  };

  const handleToday = () => {
    setCurrentDate(getToday());
  };

  // Wrapper to handle clicks on items in month/week views
  // Routes to event or schedule handler based on view mode
  const handleItemClick = (item: Schedule) => {
    if (viewMode === "events") {
      // Find the original event by ID
      const event = eventsData.find((e: Event) => e.id === item.id);
      if (event) {
        handleEventClick(event);
      }
    } else {
      handleScheduleClick(item);
    }
  };

  // Convert events to schedule-like format for calendar display
  const eventSchedules: Schedule[] = eventsData.map((event: Event) => ({
    id: event.id,
    staffId: event.user_id,
    staffName: event.title,
    startDate: event.date,
    finishDate: event.date,
    shiftStart: "00:00",
    shiftEnd: "23:59",
    status: "scheduled",
    notes: event.description || "",
    tenantId: event.tenant_id,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  }));

  // Filter schedules based on search and status
  const filteredSchedules = scheduleData.filter((schedule) => {
    // Search filter - search by staff name
    const matchesSearch =
      searchQuery === "" ||
      schedule.staffName.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter - filter by schedule status
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(schedule.status);

    return matchesSearch && matchesStatus;
  });

  // Filter events based on search
  const filteredEvents = eventSchedules.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.staffName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Use filtered data based on view mode
  const displayData =
    viewMode === "calendar" ? filteredSchedules : filteredEvents;

  return (
    <div className="calendar">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onViewChange={setView}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onCreateSchedule={handleCreateSchedule}
        onSendCalendar={handleSendCalendar}
        onCreateEvent={handleCreateEvent}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        userRole={userRole}
      />

      {view === "month" ? (
        <MonthView
          currentDate={currentDate}
          onDayClick={handleDayClick}
          onScheduleClick={handleItemClick}
          onMoreClick={handleMoreClick}
          schedules={displayData}
        />
      ) : view === "week" ? (
        <WeekView
          currentDate={currentDate}
          onDayClick={handleDayClick}
          onScheduleClick={handleItemClick}
          onMoreClick={handleMoreClick}
          schedules={displayData}
        />
      ) : (
        <GridView
          schedules={filteredSchedules}
          events={eventsData}
          viewMode={viewMode}
          onScheduleClick={handleScheduleClick}
          onEventClick={handleEventClick}
          onScheduleUpdate={loadSchedules}
          onEventUpdate={refetchEvents}
        />
      )}

      {/* Modals */}
      <ListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title={viewMode === "events" ? "All Events" : "All Schedules"}
        items={listModalSchedules}
        onItemClick={(item) => {
          setIsListModalOpen(false);
          handleItemClick(item);
        }}
        renderItem={(schedule) => (
          <ScheduleItem
            staffName={schedule.staffName}
            shiftStart={schedule.shiftStart}
            shiftEnd={schedule.shiftEnd}
            status={
              schedule.status as
                | "scheduled"
                | "confirmed"
                | "cancelled"
                | "completed"
            }
            variant="default"
          />
        )}
        emptyMessage="No schedules to display"
      />
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedSchedule(null);
        }}
        onSubmit={handleScheduleSubmit}
        initialData={
          selectedSchedule
            ? {
                staffMember: selectedSchedule.staffId,
                startDate: selectedSchedule.startDate,
                finishDate: selectedSchedule.finishDate,
                shiftStart: selectedSchedule.shiftStart,
                shiftEnd: selectedSchedule.shiftEnd,
                scheduleStatus: selectedSchedule.status,
                notes: selectedSchedule.notes || "",
              }
            : undefined
        }
        mode={scheduleModalMode}
        onEdit={handleEditSchedule}
        onDelete={handleDeleteSchedule}
      />

      <SendCalendarModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSubmit={handleSendSubmit}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Schedule"
        message={`Are you sure you want to delete this schedule for ${selectedSchedule?.staffName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleEventSubmit}
        initialData={
          selectedEvent
            ? {
                title: selectedEvent.title,
                description: selectedEvent.description || "",
                date: selectedEvent.date,
                isPublic: selectedEvent.is_public,
              }
            : undefined
        }
        mode={eventModalMode}
        onEdit={() => setEventModalMode("create")}
        onDelete={() => {
          // TODO: Implement event delete handler
          console.log("Delete event:", selectedEvent);
        }}
      />
    </div>
  );
};
