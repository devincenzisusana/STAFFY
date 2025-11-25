import { DashboardLayout } from "@/layouts/dashboard";
import { getStaffyManagementMenu } from "../menu";
import { Button } from "@/components/common/Button";
import { useTableSort } from "@/components/common/Table";
import { PageContent } from "@/components/shared/PageContent";
import { useEntityManagement, useEntityFilters } from "../hooks";
import { RiTeamLine, RiAddLine } from "react-icons/ri";
import { AddStaffModal, StaffFormData } from "./modals/AddStaffModal";
import { StaffTable, StaffMember } from "./components/StaffTable";
import { ConfirmationModal } from "@/components/common/Modal";
import { StaffFilters } from "./components/StaffFilters";
import { useStaffData } from "./hooks";
import { handleStaffStatusChange } from "./handlers";
import { staffService } from "@/services/staff/staffService";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export const Staff = () => {
  const { userRole, isLoading: authLoading } = useAuth();

  // Show loading state while checking role
  if (authLoading) {
    return null;
  }

  // Redirect staff-operator users away from Staff Management page
  if (userRole === "staff-operator") {
    return <Navigate to="/management/time-control" replace />;
  }

  // Data hooks
  const { staffData, isLoading, loadStaff } = useStaffData();

  // Entity management hook
  const {
    isCreateModalOpen,
    isViewModalOpen,
    isDeleteConfirmOpen,
    selectedEntity: selectedStaff,
    handleCreate,
    handleRowClick,
    confirmDelete,
    closeCreateModal,
    closeViewModal,
    closeDeleteConfirm,
  } = useEntityManagement<StaffMember, StaffFormData>({
    onSubmit: async (data: StaffFormData) => {
      await staffService.createStaffMember(data);
      await loadStaff();
    },
    onEdit: () => {},
    onDelete: async (staff) => {
      await staffService.deleteStaffMember(staff.id);
      await loadStaff();
    },
  });

  // Filtering hook
  const { searchQuery, setSearchQuery, filters, setFilter, filteredData } =
    useEntityFilters<StaffMember>(staffData, {
      searchFields: ["name"],
      filterFields: [
        {
          field: "status",
          values: ["active", "on-leave", "inactive"],
        },
      ],
    });

  const { sortedData, sortConfig, handleSort } = useTableSort(filteredData);

  // Handlers
  const handleStatusChange = async (staffId: string, newStatus: string) => {
    await handleStaffStatusChange(staffId, newStatus, staffData, loadStaff);
  };

  return (
    <DashboardLayout
      menuItems={getStaffyManagementMenu(userRole)}
      pageTitle="Staff Management"
      pageIcon={RiTeamLine}
      pageDescription="Manage staff members and their information"
      headerActions={
        <Button variant="primary" icon={<RiAddLine />} onClick={handleCreate}>
          Add Staff Member
        </Button>
      }
    >
      <PageContent description="View and manage all staff members, their roles, and contact information.">
        <StaffFilters
          filters={filters}
          searchQuery={searchQuery}
          onFilterChange={setFilter}
          onSearchChange={setSearchQuery}
        />

        {isLoading ? (
          <div
            style={{ padding: "2rem", textAlign: "center", color: "#757575" }}
          >
            Loading staff data...
          </div>
        ) : (
          <StaffTable
            data={sortedData}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={handleRowClick}
            onStatusChange={handleStatusChange}
          />
        )}
      </PageContent>

      <AddStaffModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={async (data: StaffFormData) => {
          await staffService.createStaffMember(data);
          await loadStaff();
        }}
        mode="create"
      />

      {selectedStaff && (
        <AddStaffModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          initialData={selectedStaff}
          mode="view"
          onDelete={async () => {
            await staffService.deleteStaffMember(selectedStaff.id);
            await loadStaff();
          }}
          onSubmit={async (data: StaffFormData) => {
            await staffService.updateStaffMember(selectedStaff.id, data);
            await loadStaff();
          }}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${selectedStaff?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </DashboardLayout>
  );
};
