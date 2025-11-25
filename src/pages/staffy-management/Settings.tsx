import { DashboardLayout } from "@/layouts/dashboard";
import { getStaffyManagementMenu } from "./menu";
import { RiSettings4Line } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

export const Settings = () => {
  const { userRole } = useAuth();

  return (
    <DashboardLayout
      menuItems={getStaffyManagementMenu(userRole)}
      pageTitle="Settings"
      pageIcon={RiSettings4Line}
      pageDescription="Configure staff management settings"
    >
      <div>{/* Page content will go here */}</div>
    </DashboardLayout>
  );
};
