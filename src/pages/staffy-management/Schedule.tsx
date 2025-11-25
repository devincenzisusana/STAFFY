import { DashboardLayout } from "@/layouts/dashboard";
import { getStaffyManagementMenu } from "./menu";
import { Calendar } from "@/components/calendar";
import { RiCalendarLine } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

export const Schedule = () => {
  const { userRole } = useAuth();

  return (
    <DashboardLayout
      menuItems={getStaffyManagementMenu(userRole)}
      pageTitle="Schedule"
      pageIcon={RiCalendarLine}
      pageDescription="Manage staff schedules and shifts"
    >
      <Calendar userRole={userRole} />
    </DashboardLayout>
  );
};
