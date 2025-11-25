import { DashboardLayout } from "@/layouts/dashboard";
import { staffyVenuesMenu } from "./menu";
import { RiDashboardLine } from "react-icons/ri";

export const StaffyVenues = () => {
  return (
    <DashboardLayout
      menuItems={staffyVenuesMenu}
      pageTitle="Overview"
      pageIcon={RiDashboardLine}
      pageDescription="Venues management overview and analytics"
    >
      <div>{/* Page content will go here */}</div>
    </DashboardLayout>
  );
};
