import { DashboardLayout } from "@/layouts/dashboard";
import { getStaffyManagementMenu } from "./menu";
import { RiDashboardLine } from "react-icons/ri";
import { Overview } from "./Overview";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export const StaffyManagement = () => {
  const { userRole, isLoading } = useAuth();

  // Show loading state while checking role
  if (isLoading) {
    return null;
  }

  // Redirect staff-operator users away from Overview page
  if (userRole === "staff-operator") {
    return <Navigate to="/management/time-control" replace />;
  }

  return (
    <DashboardLayout
      menuItems={getStaffyManagementMenu(userRole)}
      pageTitle="Overview"
      pageIcon={RiDashboardLine}
      pageDescription="Staff management overview and quick start guide"
    >
      <Overview />
    </DashboardLayout>
  );
};
