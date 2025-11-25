-- Enable Row Level Security on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "users_admin_full_access" ON users;
DROP POLICY IF EXISTS "users_staff_view_own" ON users;
DROP POLICY IF EXISTS "users_staff_update_own" ON users;

-- Policy 1: Admin operators have full access (SELECT, INSERT, UPDATE, DELETE)
-- Using a direct role check to avoid recursion
CREATE POLICY "users_admin_full_access"
ON users
FOR ALL
TO authenticated
USING (
  users.role = 'admin-operator'
  AND users.id = auth.uid()
)
WITH CHECK (
  users.role = 'admin-operator'
  AND users.id = auth.uid()
);

-- Policy 2: Staff operators can view only their own user record
CREATE POLICY "users_staff_view_own"
ON users
FOR SELECT
TO authenticated
USING (
  users.id = auth.uid()
  AND users.role = 'staff-operator'
);
