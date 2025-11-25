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
import { ToastProvider } from "@/context/ToastContext";
import { ProtectedRoute } from "@/components/auth";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />

              {/* Staff Management Routes */}
              <Route
                path="/management"
                element={
                  <ProtectedRoute>
                    <StaffyManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/management/time-control"
                element={
                  <ProtectedRoute>
                    <TimeControl />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/management/staff"
                element={
                  <ProtectedRoute>
                    <Staff />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/management/tasks"
                element={
                  <ProtectedRoute>
                    <TaskAssignment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/management/schedule"
                element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/management/absence"
                element={
                  <ProtectedRoute>
                    <Absence />
                  </ProtectedRoute>
                }
              />

              {/* Venues Routes */}
              <Route
                path="/venues"
                element={
                  <ProtectedRoute>
                    <StaffyVenues />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/venues/list"
                element={
                  <ProtectedRoute>
                    <VenuesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/venues/locations"
                element={
                  <ProtectedRoute>
                    <Locations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/venues/reports"
                element={
                  <ProtectedRoute>
                    <VenuesReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/venues/settings"
                element={
                  <ProtectedRoute>
                    <VenuesSettings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
