import { MenuItem } from "@/components/sidebar";
import {
  RiDashboardLine,
  RiBuildingLine,
  RiMapPinLine,
  RiFileListLine,
  RiSettings4Line,
} from "react-icons/ri";

export const staffyVenuesMenu: MenuItem[] = [
  { path: "/venues", label: "Overview", icon: RiDashboardLine },
  { path: "/venues/list", label: "Venues", icon: RiBuildingLine },
  { path: "/venues/locations", label: "Locations", icon: RiMapPinLine },
  { path: "/venues/reports", label: "Reports", icon: RiFileListLine },
  { path: "/venues/settings", label: "Settings", icon: RiSettings4Line },
];
