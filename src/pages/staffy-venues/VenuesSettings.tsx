import { DashboardLayout } from "@/layouts/dashboard";
import { staffyVenuesMenu } from "./menu";
import { RiSettings4Line } from "react-icons/ri";

export const VenuesSettings = () => {
  return (
    <DashboardLayout
      menuItems={staffyVenuesMenu}
      pageTitle="Settings"
      pageIcon={RiSettings4Line}
      pageDescription="Configure venue management settings"
    >
      <div>{/* Page content will go here */}</div>
    </DashboardLayout>
  );
};
