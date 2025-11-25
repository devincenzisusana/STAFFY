import { MenuItem } from "@/components/sidebar";
import {
  RiDashboardLine,
  RiTeamLine,
  RiTaskLine,
  RiCalendarLine,
  RiCalendarCloseLine,
  RiTimeLine,
} from "react-icons/ri";

export const getStaffyManagementMenu = (
  userRole: string | null
): MenuItem[] => {
  const allMenuItems: MenuItem[] = [
    { path: "/management", label: "Overview", icon: RiDashboardLine },
    { path: "/management/staff", label: "Staff Management", icon: RiTeamLine },
    {
      path: "/management/time-control",
      label: "Time Control",
      icon: RiTimeLine,
    },
    {
      path: "/management/tasks",
      label: "Task Assignment",
      icon: RiTaskLine,
    },
    {
      path: "/management/schedule",
      label: "Schedule",
      icon: RiCalendarLine,
    },
    {
      path: "/management/absence",
      label: "Absence",
      icon: RiCalendarCloseLine,
    },
  ];

  // If user is staff-operator, hide Overview and Staff Management
  if (userRole === "staff-operator") {
    return allMenuItems.filter(
      (item) => item.path !== "/management" && item.path !== "/management/staff"
    );
  }

  return allMenuItems;
};

// Keep the old export for backward compatibility
export const staffyManagementMenu: MenuItem[] = [
  { path: "/management", label: "Overview", icon: RiDashboardLine },
  { path: "/management/staff", label: "Staff Management", icon: RiTeamLine },
  { path: "/management/time-control", label: "Time Control", icon: RiTimeLine },
  {
    path: "/management/tasks",
    label: "Task Assignment",
    icon: RiTaskLine,
  },
  {
    path: "/management/schedule",
    label: "Schedule",
    icon: RiCalendarLine,
  },
  {
    path: "/management/absence",
    label: "Absence",
    icon: RiCalendarCloseLine,
  },
];
