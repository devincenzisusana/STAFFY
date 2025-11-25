import { DashboardLayout } from "@/layouts/dashboard";
import { staffyVenuesMenu } from "./menu";
import { RiFileListLine } from "react-icons/ri";

export const VenuesReports = () => {
  return (
    <DashboardLayout
      menuItems={staffyVenuesMenu}
      pageTitle="Reports"
      pageIcon={RiFileListLine}
      pageDescription="View and generate venue reports"
    >
      <div>{/* Page content will go here */}</div>
    </DashboardLayout>
  );
};
