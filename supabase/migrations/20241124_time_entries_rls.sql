-- Enable Row Level Security on time_entries table
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "time_entries_admin_full_access" ON time_entries;
DROP POLICY IF EXISTS "time_entries_staff_view_own" ON time_entries;
DROP POLICY IF EXISTS "time_entries_staff_insert_own" ON time_entries;
DROP POLICY IF EXISTS "time_entries_staff_update_own" ON time_entries;

-- Policy 1: Admin operators have full access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "time_entries_admin_full_access"
ON time_entries
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin-operator'
    AND users.tenant_id = time_entries.tenant_id
  )
);

-- Policy 2: Staff operators can view only their own time entries
CREATE POLICY "time_entries_staff_view_own"
ON time_entries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = time_entries.tenant_id
    AND staff.id = time_entries.staff_id
  )
);

-- Policy 3: Staff operators can insert their own time entries
CREATE POLICY "time_entries_staff_insert_own"
ON time_entries
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = time_entries.tenant_id
    AND staff.id = time_entries.staff_id
  )
);

-- Policy 4: Staff operators can update only their own time entries
CREATE POLICY "time_entries_staff_update_own"
ON time_entries
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = time_entries.tenant_id
    AND staff.id = time_entries.staff_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = time_entries.tenant_id
    AND staff.id = time_entries.staff_id
  )
);
