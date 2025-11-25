import { DashboardLayout } from "@/layouts/dashboard";
import { getStaffyManagementMenu } from "../menu";
import { Button } from "@/components/common/Button";
import { useTableSort } from "@/components/common/Table";
import { PageContent } from "@/components/shared/PageContent";
import { useEntityManagement, useEntityFilters } from "../hooks";
import { RiCalendarCloseLine, RiAddLine } from "react-icons/ri";
import {
  CreateAbsenceModal,
  AbsenceFormData,
} from "./modals/CreateAbsenceModal";
import { AbsenceTable, AbsenceRecord } from "./components/AbsenceTable";
import { ConfirmationModal } from "@/components/common/Modal";
import { AbsenceFilters } from "./components/AbsenceFilters";
import { useAbsenceData } from "./hooks";
import { handleAbsenceStatusChange } from "./handlers";
import { absenceService } from "@/services/absence/absenceService";
import { useAuth } from "@/context/AuthContext";

export const Absence = () => {
  const { userRole } = useAuth();

  // Data hooks
  const { absenceData, loadAbsenceRequests } = useAbsenceData();

  // Entity management hook
  const {
    isCreateModalOpen,
    isViewModalOpen,
    isDeleteConfirmOpen,
    selectedEntity: selectedAbsence,
    handleCreate,
    handleSubmit,
    handleRowClick,
    handleDelete,
    confirmDelete,
    closeCreateModal,
    closeViewModal,
    closeDeleteConfirm,
  } = useEntityManagement<AbsenceRecord, AbsenceFormData>({
    onSubmit: async (data: AbsenceFormData) => {
      if (selectedAbsence) {
        await absenceService.updateAbsenceRequest(selectedAbsence.id, data);
      } else {
        await absenceService.createAbsenceRequest(data);
      }
      await loadAbsenceRequests();
    },
    onEdit: () => {},
    onDelete: async (absence) => {
      await absenceService.deleteAbsenceRequest(absence.id);
      await loadAbsenceRequests();
    },
  });

  // Filtering hook
  const { searchQuery, setSearchQuery, filters, setFilter, filteredData } =
    useEntityFilters<AbsenceRecord>(absenceData, {
      searchFields: ["staffName"],
      filterFields: [
        {
          field: "requestType",
          values: ["vacation", "sick-leave", "personal", "emergency", "other"],
        },
        {
          field: "status",
          values: ["pending", "approved", "rejected", "cancelled"],
        },
      ],
    });

  const { sortedData, sortConfig, handleSort } = useTableSort(filteredData);

  // Handlers
  const handleStatusChange = async (absenceId: string, newStatus: string) => {
    await handleAbsenceStatusChange(absenceId, newStatus, loadAbsenceRequests);
  };

  return (
    <DashboardLayout
      menuItems={getStaffyManagementMenu(userRole)}
      pageTitle="Absence"
      pageIcon={RiCalendarCloseLine}
      pageDescription="Track and manage staff absences and time off"
      headerActions={
        <Button variant="primary" icon={<RiAddLine />} onClick={handleCreate}>
          Create Absence Request
        </Button>
      }
    >
      <PageContent description="Track staff absences, leaves, and time-off requests.">
        <AbsenceFilters
          filters={filters}
          searchQuery={searchQuery}
          onFilterChange={setFilter}
          onSearchChange={setSearchQuery}
        />

        <AbsenceTable
          data={sortedData}
          sortConfig={sortConfig}
          onSort={handleSort}
          onRowClick={handleRowClick}
          onStatusChange={
            userRole === "admin-operator" ? handleStatusChange : undefined
          }
        />
      </PageContent>

      <CreateAbsenceModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleSubmit}
        mode="create"
      />

      {selectedAbsence && (
        <CreateAbsenceModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          initialData={{
            staffMember: selectedAbsence.staffId,
            requestType: selectedAbsence.requestType,
            startDate: selectedAbsence.startDate,
            endDate: selectedAbsence.endDate,
            notes: selectedAbsence.notes || "",
          }}
          mode="view"
          onDelete={handleDelete}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        title="Delete Absence Request"
        message={`Are you sure you want to delete the absence request for ${selectedAbsence?.staffName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </DashboardLayout>
  );
};
