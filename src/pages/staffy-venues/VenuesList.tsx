import { DashboardLayout } from "@/layouts/dashboard";
import { staffyVenuesMenu } from "./menu";
import { RiBuildingLine } from "react-icons/ri";

export const VenuesList = () => {
  return (
    <DashboardLayout
      menuItems={staffyVenuesMenu}
      pageTitle="Venues"
      pageIcon={RiBuildingLine}
      pageDescription="Manage all venue locations and details"
    >
      <div>{/* Page content will go here */}</div>
    </DashboardLayout>
  );
};
