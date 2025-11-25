import { supabase } from "@/lib/supabase";
import { getUserTenantId, updateField, deleteItem } from "@/services/base";
import { TaskFormData } from "@/pages/staffy-management/TaskAssignment/modals/CreateTaskModal";

export const taskService = {
  async fetchAllTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        staff:staff_id (
          id,
          employee_id,
          staff_personal_data (
            first_name,
            last_name
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createTask(formData: TaskFormData) {
    const tenantId = await getUserTenantId();

    const { error } = await supabase.from("tasks").insert({
      tenant_id: tenantId,
      title: formData.title,
      description: formData.description || null,
      category: formData.category || null,
      priority: formData.priority,
      staff_id: formData.assignedTo || null,
      due_date: formData.dueDate || null,
      due_time: formData.dueTime || null,
      status: "pending",
    });

    if (error) throw error;
  },

  async updateTask(id: string, formData: TaskFormData) {
    const { error } = await supabase
      .from("tasks")
      .update({
        title: formData.title,
        description: formData.description || null,
        category: formData.category || null,
        priority: formData.priority,
        staff_id: formData.assignedTo || null,
        due_date: formData.dueDate || null,
        due_time: formData.dueTime || null,
      })
      .eq("id", id);

    if (error) throw error;
  },

  async updateTaskStatus(id: string, status: string) {
    await updateField("tasks", id, "status", status);
  },

  async updateTaskPriority(id: string, priority: string) {
    await updateField("tasks", id, "priority", priority);
  },

  async deleteTask(id: string) {
    await deleteItem("tasks", id);
  },
};
