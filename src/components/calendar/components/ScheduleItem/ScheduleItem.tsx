import "./ScheduleItem.css";

interface ScheduleItemProps {
  staffName: string;
  shiftStart: string;
  shiftEnd: string;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
  variant?: "compact" | "default";
  onClick?: (e: React.MouseEvent) => void;
}

export const ScheduleItem = ({
  staffName,
  shiftStart,
  shiftEnd,
  status,
  variant = "default",
  onClick,
}: ScheduleItemProps) => {
  const className = `schedule-item ${
    variant === "compact" ? "compact" : ""
  } status-${status}`;

  return (
    <div className={className} onClick={onClick}>
      <span className="schedule-staff">{staffName}</span>
      <span className="schedule-time">
        {shiftStart}-{shiftEnd}
      </span>
    </div>
  );
};
