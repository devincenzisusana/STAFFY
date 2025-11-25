import { DashboardLayout } from "@/layouts/dashboard";
import { getStaffyManagementMenu } from "./menu";
import { RiBarChartLine } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";

export const Reports = () => {
  const { userRole } = useAuth();

  return (
    <DashboardLayout
      menuItems={getStaffyManagementMenu(userRole)}
      pageTitle="Reports"
      pageIcon={RiFileListLine}
      pageDescription="View and generate staff reports"
    >
      <div>{/* Page content will go here */}</div>
    </DashboardLayout>
  );
};
