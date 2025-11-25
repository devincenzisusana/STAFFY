-- Enable Row Level Security on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "tasks_admin_full_access" ON tasks;
DROP POLICY IF EXISTS "tasks_staff_view_own" ON tasks;
DROP POLICY IF EXISTS "tasks_staff_update_own" ON tasks;

-- Policy 1: Admin operators have full access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "tasks_admin_full_access"
ON tasks
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin-operator'
    AND users.tenant_id = tasks.tenant_id
  )
);

-- Policy 2: Staff operators can view only their own tasks
CREATE POLICY "tasks_staff_view_own"
ON tasks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = tasks.tenant_id
    AND staff.id = tasks.staff_id
  )
);

-- Policy 3: Staff operators can update only their own tasks
CREATE POLICY "tasks_staff_update_own"
ON tasks
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = tasks.tenant_id
    AND staff.id = tasks.staff_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = tasks.tenant_id
    AND staff.id = tasks.staff_id
  )
);
