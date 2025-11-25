-- Create tasks table for Task Assignment page
-- Based on the CreateTaskModal form fields

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    due_date DATE,
    due_time TIME,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id ON public.tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_staff_id ON public.tasks(staff_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);

-- Add check constraint for priority values
ALTER TABLE public.tasks 
ADD CONSTRAINT chk_tasks_priority 
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- Add check constraint for status values
ALTER TABLE public.tasks 
ADD CONSTRAINT chk_tasks_status 
CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled'));

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_tasks_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.tasks IS 'Task assignment and tracking table';
COMMENT ON COLUMN public.tasks.id IS 'Unique identifier for the task';
COMMENT ON COLUMN public.tasks.tenant_id IS 'Reference to tenant for multi-tenancy isolation';
COMMENT ON COLUMN public.tasks.title IS 'Task title/name';
COMMENT ON COLUMN public.tasks.description IS 'Optional detailed description of the task';
COMMENT ON COLUMN public.tasks.category IS 'Task category for grouping/filtering';
COMMENT ON COLUMN public.tasks.priority IS 'Task priority: low, medium, high, urgent';
COMMENT ON COLUMN public.tasks.staff_id IS 'Reference to staff member assigned to the task';
COMMENT ON COLUMN public.tasks.due_date IS 'Task due date';
COMMENT ON COLUMN public.tasks.due_time IS 'Task due time';
COMMENT ON COLUMN public.tasks.status IS 'Task status: pending, in-progress, completed, cancelled';
COMMENT ON COLUMN public.tasks.created_at IS 'Timestamp when task was created';
COMMENT ON COLUMN public.tasks.updated_at IS 'Timestamp when task was last updated';
