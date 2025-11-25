export interface TimeEntry {
  id: string;
  staffMember: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakDuration: string;
  overtime: string;
  totalHours: string;
  status: "active" | "pending" | "approved" | "rejected";
}
