import { DashboardLayout } from "@/layouts/dashboard";
import { staffyVenuesMenu } from "./menu";
import { RiMapPinLine } from "react-icons/ri";

export const Locations = () => {
  return (
    <DashboardLayout
      menuItems={staffyVenuesMenu}
      pageTitle="Locations"
      pageIcon={RiMapPinLine}
      pageDescription="Manage venue locations and addresses"
    >
      <div>{/* Page content will go here */}</div>
    </DashboardLayout>
  );
};
