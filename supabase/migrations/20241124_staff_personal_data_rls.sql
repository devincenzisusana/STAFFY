-- Enable Row Level Security on staff_personal_data table
ALTER TABLE staff_personal_data ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "staff_personal_data_admin_full_access" ON staff_personal_data;
DROP POLICY IF EXISTS "staff_personal_data_staff_view_own" ON staff_personal_data;
DROP POLICY IF EXISTS "staff_personal_data_staff_update_own" ON staff_personal_data;
DROP POLICY IF EXISTS "staff_personal_data_staff_insert_own" ON staff_personal_data;

-- Policy 1: Admin operators have full access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "staff_personal_data_admin_full_access"
ON staff_personal_data
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.tenant_id = users.tenant_id
    WHERE users.id = auth.uid()
    AND users.role = 'admin-operator'
    AND staff.id = staff_personal_data.staff_id
  )
);

-- Policy 2: Staff operators can view only their own personal data
CREATE POLICY "staff_personal_data_staff_view_own"
ON staff_personal_data
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND staff.id = staff_personal_data.staff_id
  )
);

-- Policy 3: Staff operators can update only their own personal data
CREATE POLICY "staff_personal_data_staff_update_own"
ON staff_personal_data
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND staff.id = staff_personal_data.staff_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND staff.id = staff_personal_data.staff_id
  )
);

-- Policy 4: Staff operators can insert their own personal data (for initial setup)
CREATE POLICY "staff_personal_data_staff_insert_own"
ON staff_personal_data
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    JOIN staff ON staff.user_id = users.id
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND staff.id = staff_personal_data.staff_id
  )
);
