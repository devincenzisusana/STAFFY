-- Enable Row Level Security on tenants table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "tenants_admin_view" ON tenants;
DROP POLICY IF EXISTS "tenants_staff_view" ON tenants;

-- Policy 1: Admin operators can view their own tenant
CREATE POLICY "tenants_admin_view"
ON tenants
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin-operator'
    AND users.tenant_id = tenants.id
  )
);

-- Policy 2: Staff operators can view their own tenant
CREATE POLICY "tenants_staff_view"
ON tenants
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'staff-operator'
    AND users.tenant_id = tenants.id
  )
);
