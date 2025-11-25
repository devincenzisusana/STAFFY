import { Column } from "@/components/common/Table";
import {
  StatusBadge,
  StatusBadgeSelect,
  StatusOption,
} from "@/components/shared/StatusBadge";
import { Event } from "@/services/events";

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
};

const visibilityOptions: StatusOption[] = [
  { value: "private", label: "Private", variant: "neutral" },
  { value: "public", label: "Public", variant: "success" },
];

export const createEventTableColumns = (
  onVisibilityChange?: (eventId: string, isPublic: boolean) => void
): Column<Event>[] => [
  {
    key: "title",
    label: "EVENT TITLE",
    sortable: true,
    width: "20%",
    render: (_, event) => event.title || "-",
  },
  {
    key: "date",
    label: "DATE",
    sortable: true,
    width: "20%",
    render: (_, event) => formatDate(event.date),
  },
  {
    key: "description",
    label: "DESCRIPTION",
    sortable: false,
    width: "30%",
    render: (_, event) => event.description || "-",
  },
  {
    key: "is_public",
    label: "VISIBILITY",
    sortable: true,
    width: "15%",
    render: (_, event) =>
      onVisibilityChange ? (
        <StatusBadgeSelect
          value={event.is_public ? "public" : "private"}
          options={visibilityOptions}
          onChange={(newValue) =>
            onVisibilityChange(event.id, newValue === "public")
          }
        />
      ) : (
        <StatusBadge
          status={event.is_public ? "Public" : "Private"}
          variant={event.is_public ? "success" : "neutral"}
        />
      ),
  },
  {
    key: "created_at",
    label: "CREATED",
    sortable: true,
    width: "15%",
    render: (_, event) => formatDate(event.created_at),
  },
];
