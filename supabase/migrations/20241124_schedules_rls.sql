-- Enable Row Level Security on schedules table
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "schedules_admin_full_access" ON schedules;
DROP POLICY IF EXISTS "schedules_staff_view_own" ON schedules;
DROP POLICY IF EXISTS "schedules_staff_update_own" ON schedules;

-- Policy 1: Admin operators have full access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "schedules_admin_full_access"
ON schedules
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin-operator'
    AND users.tenant_id = schedules.tenant_id
  )
);

-- Policy 2: Staff operators can view only their own schedules
CREATE POLICY "schedules_staff_view_own"
ON schedules
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = schedules.tenant_id
    AND staff.id = schedules.staff_id
  )
);

-- Policy 3: Staff operators can update only their own schedules
CREATE POLICY "schedules_staff_update_own"
ON schedules
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = schedules.tenant_id
    AND staff.id = schedules.staff_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = schedules.tenant_id
    AND staff.id = schedules.staff_id
  )
);
