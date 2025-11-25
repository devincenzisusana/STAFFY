import { DashboardLayout } from "@/layouts/dashboard";
import { getStaffyManagementMenu } from "../menu";
import { Button } from "@/components/common/Button";
import { useTableSort } from "@/components/common/Table";
import { PageContent } from "@/components/shared/PageContent";
import { useEntityManagement, useEntityFilters } from "../hooks";
import { RiTaskLine, RiAddLine, RiSendPlaneLine } from "react-icons/ri";
import { CreateTaskModal, TaskFormData } from "./modals/CreateTaskModal";
import { SendTasksModal, SendTasksFormData } from "./modals/SendTasksModal";
import { TaskTable, Task } from "./components/TaskTable";
import { ConfirmationModal } from "@/components/common/Modal";
import { TaskFilters } from "./components/TaskFilters";
import { useTaskData } from "./hooks";
import { handleTaskStatusChange, handleTaskPriorityChange } from "./handlers";
import { taskService } from "@/services/tasks/taskService";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const TaskAssignment = () => {
  const { userRole } = useAuth();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  // Data hooks
  const { taskData, loadTasks } = useTaskData();

  // Entity management hook
  const {
    isCreateModalOpen,
    isViewModalOpen,
    isDeleteConfirmOpen,
    selectedEntity: selectedTask,
    handleCreate,
    handleSubmit,
    handleRowClick,
    handleDelete,
    confirmDelete,
    closeCreateModal,
    closeViewModal,
    closeDeleteConfirm,
  } = useEntityManagement<Task, TaskFormData>({
    onSubmit: async (data: TaskFormData) => {
      if (selectedTask) {
        await taskService.updateTask(selectedTask.id, data);
      } else {
        await taskService.createTask(data);
      }
      await loadTasks();
    },
    onEdit: () => {},
    onDelete: async (task) => {
      await taskService.deleteTask(task.id);
      await loadTasks();
    },
  });

  // Filtering hook
  const { searchQuery, setSearchQuery, filters, setFilter, filteredData } =
    useEntityFilters<Task>(taskData, {
      searchFields: ["title"],
      filterFields: [
        {
          field: "category",
          values: [
            "cleaning",
            "bar-service",
            "security",
            "maintenance",
            "event-setup",
            "other",
          ],
        },
        {
          field: "priority",
          values: ["urgent", "high", "medium", "low"],
        },
        {
          field: "status",
          values: ["pending", "in-progress", "completed", "cancelled"],
        },
      ],
    });

  const { sortedData, sortConfig, handleSort } = useTableSort(filteredData);

  // Handlers
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await handleTaskStatusChange(taskId, newStatus, taskData, loadTasks);
  };

  const handlePriorityChange = async (taskId: string, newPriority: string) => {
    await handleTaskPriorityChange(taskId, newPriority, taskData, loadTasks);
  };

  const handleSendTasks = () => {
    setIsSendModalOpen(true);
  };

  const handleSendSubmit = async (data: SendTasksFormData) => {
    try {
      console.log("📧 Sending tasks with data:", data);

      // Get current auth session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please sign in to send tasks");
        return;
      }

      const requestBody = {
        staffMemberIds: data.staffMembers,
        priorities: data.priorities,
        statuses: data.statuses,
        message: data.message,
      };

      console.log("📧 Request body:", requestBody);

      const { data: result, error } = await supabase.functions.invoke(
        "send-tasks",
        {
          body: requestBody,
        }
      );

      console.log("📧 Response:", { result, error });

      if (error) {
        console.error("Error response:", error);
        alert(`Failed to send tasks: ${error.message || "Unknown error"}`);
        throw error;
      }

      if (result?.success) {
        alert(result.message || "Tasks sent successfully!");
        setIsSendModalOpen(false);
      } else {
        alert(result?.message || "Failed to send tasks");
      }
    } catch (error) {
      console.error("Error sending tasks:", error);
      alert("Failed to send tasks. Please try again.");
    }
  };

  return (
    <DashboardLayout
      menuItems={getStaffyManagementMenu(userRole)}
      pageTitle="Task Assignment"
      pageIcon={RiTaskLine}
      pageDescription="Assign and manage tasks for staff members"
      headerActions={
        userRole !== "staff-operator" ? (
          <div style={{ display: "flex", gap: "12px" }}>
            <Button
              variant="outline"
              size="sm"
              icon={<RiSendPlaneLine />}
              onClick={handleSendTasks}
            >
              Send Tasks
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<RiAddLine />}
              onClick={handleCreate}
            >
              Create Task
            </Button>
          </div>
        ) : undefined
      }
    >
      <PageContent description="Create, assign, and track tasks for your team.">
        <TaskFilters
          filters={filters}
          searchQuery={searchQuery}
          onFilterChange={setFilter}
          onSearchChange={setSearchQuery}
        />

        <TaskTable
          data={sortedData}
          sortConfig={sortConfig}
          onSort={handleSort}
          onRowClick={handleRowClick}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />
      </PageContent>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleSubmit}
        mode="create"
      />

      {selectedTask && (
        <CreateTaskModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          onSubmit={handleSubmit}
          initialData={selectedTask}
          mode="view"
          onDelete={handleDelete}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      <SendTasksModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSubmit={handleSendSubmit}
      />
    </DashboardLayout>
  );
};
