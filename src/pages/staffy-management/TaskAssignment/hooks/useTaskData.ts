import { useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/tasks/taskService";
import { Task } from "../components/TaskTable";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import { queryConfig, createQueryKey } from "@/utils/queryConfig";

/**
 * Hook to manage task data loading and transformation using React Query
 * Includes realtime subscriptions for instant updates
 */
export const useTaskData = () => {
  const queryClient = useQueryClient();
  const queryKey = createQueryKey("tasks");

  const { data: taskData = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      const data = await taskService.fetchAllTasks();
      const tasks: Task[] = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        category: task.category || "",
        priority: task.priority,
        assignedTo: task.staff_id || "",
        assignedToName: task.staff
          ? `${task.staff.staff_personal_data?.first_name || ""} ${
              task.staff.staff_personal_data?.last_name || ""
            }`.trim()
          : "Unassigned",
        dueDate: task.due_date || "",
        dueTime: task.due_time || "",
        status: task.status,
        createdAt: task.created_at,
      }));
      
      return tasks;
    },
    ...queryConfig.frequent, // Tasks change frequently
  });

  // Setup realtime subscription for tasks table
  useRealtimeSubscription({
    table: "tasks",
    queryKey,
    event: "*", // Listen to all events
  });

  const loadTasks = async () => {
    await queryClient.invalidateQueries({ queryKey });
  };

  return {
    taskData,
    isLoading: false, // Never show loading for smooth UX
    loadTasks,
    setTaskData: () => {}, // Not needed with React Query
  };
};
