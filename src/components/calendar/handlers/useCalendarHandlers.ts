import { useState } from "react";
import { Schedule } from "../hooks";
import { scheduleService } from "@/services/schedule/scheduleService";
import { eventService, Event } from "@/services/events";
import { supabase } from "@/lib/supabase";
import { ScheduleFormData } from "../modals/ScheduleModal";
import { EventFormData } from "../modals/EventModal";
import { SendCalendarFormData } from "../modals/SendCalendarModal";

export const useCalendarHandlers = (
  viewMode: "calendar" | "events",
  loadSchedules: () => Promise<void>,
  refetchEvents: () => Promise<any>
) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalMode, setScheduleModalMode] = useState<"create" | "view">(
    "create"
  );
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<"create" | "view">(
    "create"
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [listModalSchedules, setListModalSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleCreateSchedule = () => {
    setSelectedSchedule(null);
    setScheduleModalMode("create");
    setIsScheduleModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setEventModalMode("create");
    setIsEventModalOpen(true);
  };

  const handleDayClick = (_date: Date) => {
    // Open event modal if in events view, otherwise open schedule modal
    if (viewMode === "events") {
      setSelectedEvent(null);
      setEventModalMode("create");
      setIsEventModalOpen(true);
    } else {
      setSelectedSchedule(null);
      setScheduleModalMode("create");
      setIsScheduleModalOpen(true);
    }
  };

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setScheduleModalMode("view");
    setIsScheduleModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEventModalMode("view");
    setIsEventModalOpen(true);
  };

  const handleMoreClick = (schedules: Schedule[]) => {
    setListModalSchedules(schedules);
    setIsListModalOpen(true);
  };

  const handleListItemClick = (schedule: Schedule) => {
    setIsListModalOpen(false);
    handleScheduleClick(schedule);
  };

  const handleEditSchedule = () => {
    setScheduleModalMode("create");
  };

  const handleDeleteSchedule = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSchedule) return;

    await scheduleService.deleteSchedule(selectedSchedule.id);
    await loadSchedules();
    setIsScheduleModalOpen(false);
    setIsDeleteConfirmOpen(false);
    setSelectedSchedule(null);
  };

  const handleSendCalendar = () => {
    setIsSendModalOpen(true);
  };

  const handleEventSubmit = async (data: EventFormData) => {
    try {
      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, data);
      } else {
        await eventService.createEvent(data);
      }
      await refetchEvents();
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error creating/updating event:", error);
      throw error;
    }
  };

  const handleScheduleSubmit = async (data: ScheduleFormData) => {
    try {
      if (selectedSchedule) {
        await scheduleService.updateSchedule(selectedSchedule.id, data);
      } else {
        await scheduleService.createSchedule(data);
      }
      await loadSchedules();
      setIsScheduleModalOpen(false);
      setSelectedSchedule(null);
    } catch (error) {
      throw error;
    }
  };

  const handleSendSubmit = async (data: SendCalendarFormData) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please sign in to send calendar");
        return;
      }

      const { data: result, error } = await supabase.functions.invoke(
        "send-calendar",
        {
          body: {
            staffMemberIds: data.staffMembers,
            statuses: data.statuses,
            message: data.message,
          },
        }
      );

      if (error) {
        console.error("Error response:", error);
        throw error;
      }

      if (result?.success) {
        alert(result.message || "Calendar sent successfully!");
        setIsSendModalOpen(false);
      } else {
        alert(result?.message || "Failed to send calendar");
      }
    } catch (error) {
      console.error("Error sending calendar:", error);
      alert("Failed to send calendar. Please try again.");
    }
  };

  return {
    // Modal states
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

    // Handlers
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
  };
};
