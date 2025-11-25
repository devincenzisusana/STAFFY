-- Enable Row Level Security on staff table
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "staff_admin_full_access" ON staff;
DROP POLICY IF EXISTS "staff_staff_view_own" ON staff;
DROP POLICY IF EXISTS "staff_staff_update_own" ON staff;

-- Policy 1: Admin operators have full access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "staff_admin_full_access"
ON staff
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin-operator'
    AND users.tenant_id = staff.tenant_id
  )
);

-- Policy 2: Staff operators can view only their own staff record
CREATE POLICY "staff_staff_view_own"
ON staff
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = staff.tenant_id
    AND users.id = staff.user_id
  )
);

-- Policy 3: Staff operators can update only their own staff record
CREATE POLICY "staff_staff_update_own"
ON staff
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = staff.tenant_id
    AND users.id = staff.user_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = staff.tenant_id
    AND users.id = staff.user_id
  )
);
