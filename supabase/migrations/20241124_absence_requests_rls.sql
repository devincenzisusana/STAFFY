-- Enable Row Level Security on absence_requests table
ALTER TABLE absence_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "absence_requests_admin_full_access" ON absence_requests;
DROP POLICY IF EXISTS "absence_requests_staff_view_own" ON absence_requests;
DROP POLICY IF EXISTS "absence_requests_staff_insert_own" ON absence_requests;
DROP POLICY IF EXISTS "absence_requests_staff_update_own" ON absence_requests;

-- Policy 1: Admin operators have full access (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "absence_requests_admin_full_access"
ON absence_requests
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin-operator'
    AND users.tenant_id = absence_requests.tenant_id
  )
);

-- Policy 2: Staff operators can view only their own absence requests
CREATE POLICY "absence_requests_staff_view_own"
ON absence_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.email = (
      SELECT email FROM auth.users WHERE auth.users.id = auth.uid()
    )
    AND staff.id = absence_requests.staff_id
    AND staff.tenant_id = absence_requests.tenant_id
  )
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = absence_requests.tenant_id
  )
);

-- Policy 3: Staff operators can insert absence requests only for themselves
CREATE POLICY "absence_requests_staff_insert_own"
ON absence_requests
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.email = (
      SELECT email FROM auth.users WHERE auth.users.id = auth.uid()
    )
    AND staff.id = absence_requests.staff_id
    AND staff.tenant_id = absence_requests.tenant_id
  )
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = absence_requests.tenant_id
  )
);

-- Policy 4: Staff operators can update their own absence requests
-- Note: This policy allows updating all fields. The application layer 
-- (frontend) prevents staff-operators from changing the status field.
CREATE POLICY "absence_requests_staff_update_own"
ON absence_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.email = (
      SELECT email FROM auth.users WHERE auth.users.id = auth.uid()
    )
    AND staff.id = absence_requests.staff_id
    AND staff.tenant_id = absence_requests.tenant_id
  )
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = absence_requests.tenant_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.email = (
      SELECT email FROM auth.users WHERE auth.users.id = auth.uid()
    )
    AND staff.id = absence_requests.staff_id
    AND staff.tenant_id = absence_requests.tenant_id
  )
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = absence_requests.tenant_id
  )
  -- Prevent staff-operators from changing the status field
  AND (
    absence_requests.status IS NOT DISTINCT FROM 
    (SELECT status FROM absence_requests WHERE id = absence_requests.id)
  )
);
