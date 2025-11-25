import { useState, useEffect } from "react";
import { staffService } from "@/services/staff/staffService";

export interface StaffOption {
  value: string;
  label: string;
}

/**
 * Shared hook to load and format staff data for dropdowns
 * Use this hook anywhere you need a staff member dropdown/select
 *
 * @example
 * ```tsx
 * const { staffOptions, isLoading } = useStaffOptions();
 *
 * <Select
 *   label="Staff Member"
 *   options={staffOptions}
 *   value={selectedStaffId}
 *   onChange={handleChange}
 * />
 * ```
 */
export const useStaffOptions = () => {
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      const data = await staffService.fetchAllStaff();
      const options = data.map((staff) => ({
        value: staff.id,
        label:
          `${staff.staff_personal_data?.first_name || ""} ${
            staff.staff_personal_data?.last_name || ""
          }`.trim() || staff.email,
      }));
      setStaffOptions(options);
    } catch (error) {
      console.error("Error loading staff options:", error);
      setStaffOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { staffOptions, isLoading, reload: loadStaff };
};
