-- Enable Row Level Security on audit_log table
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "audit_log_admin_view" ON audit_log;

-- Policy: Only admin operators can view audit logs for their tenant
-- No INSERT/UPDATE/DELETE policies - audit logs should only be created via triggers
CREATE POLICY "audit_log_admin_view"
ON audit_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin-operator'
    AND users.tenant_id = audit_log.tenant_id
  )
);

-- Function to capture audit log entries
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
  tenant_id_value uuid;
  user_id_value uuid;
BEGIN
  -- Get the current user's ID
  user_id_value := auth.uid();
  
  -- Get tenant_id from the record being modified
  IF TG_OP = 'DELETE' THEN
    tenant_id_value := OLD.tenant_id;
  ELSE
    tenant_id_value := NEW.tenant_id;
  END IF;

  -- Insert audit log entry using dynamic record ID conversion
  INSERT INTO audit_log (
    tenant_id,
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address
  )
  SELECT
    tenant_id_value,
    user_id_value,
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN (OLD.id)::text
      ELSE (NEW.id)::text
    END,
    CASE 
      WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD)
      ELSE NULL
    END,
    CASE 
      WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)
      ELSE NULL
    END,
    COALESCE(
      current_setting('request.headers', true)::json->>'x-forwarded-for',
      inet_client_addr()::text
    );

  RETURN CASE 
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
  END;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block the operation
    RAISE WARNING 'Audit log failed: %', SQLERRM;
    RETURN CASE 
      WHEN TG_OP = 'DELETE' THEN OLD
      ELSE NEW
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for tables that need auditing
-- Example: staff table
DROP TRIGGER IF EXISTS audit_staff_changes ON staff;
CREATE TRIGGER audit_staff_changes
AFTER INSERT OR UPDATE OR DELETE ON staff
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Example: staff_personal_data table
DROP TRIGGER IF EXISTS audit_staff_personal_data_changes ON staff_personal_data;
CREATE TRIGGER audit_staff_personal_data_changes
AFTER INSERT OR UPDATE OR DELETE ON staff_personal_data
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Example: users table
DROP TRIGGER IF EXISTS audit_users_changes ON users;
CREATE TRIGGER audit_users_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Example: schedules table
DROP TRIGGER IF EXISTS audit_schedules_changes ON schedules;
CREATE TRIGGER audit_schedules_changes
AFTER INSERT OR UPDATE OR DELETE ON schedules
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Example: tasks table
DROP TRIGGER IF EXISTS audit_tasks_changes ON tasks;
CREATE TRIGGER audit_tasks_changes
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Example: time_entries table
DROP TRIGGER IF EXISTS audit_time_entries_changes ON time_entries;
CREATE TRIGGER audit_time_entries_changes
AFTER INSERT OR UPDATE OR DELETE ON time_entries
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Example: absence_requests table
DROP TRIGGER IF EXISTS audit_absence_requests_changes ON absence_requests;
CREATE TRIGGER audit_absence_requests_changes
AFTER INSERT OR UPDATE OR DELETE ON absence_requests
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
