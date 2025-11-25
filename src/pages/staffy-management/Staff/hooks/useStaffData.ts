import { useQuery, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services/staff/staffService";
import { StaffMember } from "../components/StaffTable";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { queryConfig, createQueryKey } from "@/utils/queryConfig";

/**
 * Hook to manage staff data loading and transformation using React Query
 * Includes realtime subscriptions for instant updates
 */
export const useStaffData = () => {
  const queryClient = useQueryClient();
  const queryKey = createQueryKey("staff");

  const { data: staffData = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await staffService.fetchAllStaff();
      const staffMembers: StaffMember[] = data.map((staff: any) => ({
        id: staff.id,
        employeeId: staff.employee_id,
        name: `${staff.staff_personal_data?.first_name || ""} ${
          staff.staff_personal_data?.last_name || ""
        }`.trim(),
        email: staff.email,
        position: staff.position,
        department: staff.department,
        phone: staff.staff_personal_data?.phone_number || "",
        hireDate: staff.hire_date || "",
        status: staff.status,
        role: staff.users?.role || "",
        photoUrl: staff.photo_url || "",
        // Personal data fields
        firstName: staff.staff_personal_data?.first_name || "",
        lastName: staff.staff_personal_data?.last_name || "",
        idNumber: staff.staff_personal_data?.id_number || "",
        dateOfBirth: staff.staff_personal_data?.date_of_birth || "",
        address: staff.staff_personal_data?.address || "",
        city: staff.staff_personal_data?.city || "",
        zipCode: staff.staff_personal_data?.zip_code || "",
        country: staff.staff_personal_data?.country || "",
        emergencyContactName:
          staff.staff_personal_data?.emergency_contact_name || "",
        emergencyContactNumber:
          staff.staff_personal_data?.emergency_contact_number || "",
        gdprConsentGiven:
          staff.staff_personal_data?.gdpr_consent_given || false,
        gdprConsentDate: staff.staff_personal_data?.gdpr_consent_date || "",
      }));

      console.log("[useStaffData] Final staffMembers:", staffMembers);
      return staffMembers;
    },
    ...queryConfig.realtime, // Use realtime config with infinite staleTime
  });

  // Setup realtime subscription for staff table
  useRealtimeSubscription({
    table: "staff",
    queryKey,
    event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
  });

  // Also subscribe to staff_personal_data changes
  useRealtimeSubscription({
    table: "staff_personal_data",
    queryKey,
    event: "*",
  });

  // Also subscribe to staff_personal_data changes
  useRealtimeSubscription({
    table: "staff_personal_data",
    queryKey,
    event: "*",
  });

  const loadStaff = async () => {
    await queryClient.invalidateQueries({ queryKey });
  };

  return {
    staffData,
    isLoading: false, // Never show loading for smooth UX
    loadStaff,
    setStaffData: () => {}, // Not needed with React Query
  };
};
