import { taskService } from "@/services/tasks/taskService";
import { Task } from "../components/TaskTable";

/**
 * Handle task status change
 */
export const handleTaskStatusChange = async (
  taskId: string,
  newStatus: string,
  taskData: Task[],
  loadTasks: () => Promise<void>
) => {
  try {
    await taskService.updateTaskStatus(taskId, newStatus);
    await loadTasks();
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

/**
 * Handle task priority change
 */
export const handleTaskPriorityChange = async (
  taskId: string,
  newPriority: string,
  taskData: Task[],
  loadTasks: () => Promise<void>
) => {
  try {
    await taskService.updateTaskPriority(taskId, newPriority);
    await loadTasks();
  } catch (error) {
    console.error("Error updating task priority:", error);
    throw error;
  }
};
