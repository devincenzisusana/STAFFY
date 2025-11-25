import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Login } from "@/pages/auth/Login";
import { StaffyManagement } from "@/pages/staffy-management";
import { TimeControl } from "@/pages/staffy-management/TimeControl";
import { Staff } from "@/pages/staffy-management/Staff";
import { TaskAssignment } from "@/pages/staffy-management/TaskAssignment";
import { Schedule } from "@/pages/staffy-management/Schedule";
import { Absence } from "@/pages/staffy-management/Absence";
import { StaffyVenues } from "@/pages/staffy-venues";
import { VenuesList } from "@/pages/staffy-venues/VenuesList";
import { Locations } from "@/pages/staffy-venues/Locations";
import { VenuesReports } from "@/pages/staffy-venues/VenuesReports";
import { VenuesSettings } from "@/pages/staffy-venues/VenuesSettings";
import { AuthProvider } from "@/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Staff Management Routes */}
            <Route path="/management" element={<StaffyManagement />} />
            <Route path="/management/time-control" element={<TimeControl />} />
            <Route path="/management/staff" element={<Staff />} />
            <Route path="/management/tasks" element={<TaskAssignment />} />
            <Route path="/management/schedule" element={<Schedule />} />
            <Route path="/management/absence" element={<Absence />} />

            {/* Venues Routes */}
            <Route path="/venues" element={<StaffyVenues />} />
            <Route path="/venues/list" element={<VenuesList />} />
            <Route path="/venues/locations" element={<Locations />} />
            <Route path="/venues/reports" element={<VenuesReports />} />
            <Route path="/venues/settings" element={<VenuesSettings />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
