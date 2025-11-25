-- Fix audit_trigger_function to match audit_log.record_id column type (UUID)
-- No casting needed - pass UUID directly

CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
  tenant_id_value uuid;
  user_id_value uuid;
  record_id_value uuid;
BEGIN
  RAISE NOTICE '🔍 Audit trigger fired for table: %, operation: %', TG_TABLE_NAME, TG_OP;
  
  -- Get the current user's ID (may be NULL for service role operations)
  user_id_value := auth.uid();
  RAISE NOTICE '👤 User ID: %', COALESCE(user_id_value::text, 'NULL');
  
  -- Get tenant_id and record_id from the record being modified
  IF TG_OP = 'DELETE' THEN
    tenant_id_value := OLD.tenant_id;
    record_id_value := OLD.id;
  ELSE
    tenant_id_value := NEW.tenant_id;
    record_id_value := NEW.id;
  END IF;
  
  RAISE NOTICE '🏢 Tenant ID: %, Record ID: %', tenant_id_value, record_id_value;

  -- Insert audit log entry with UUID record_id (no casting)
  INSERT INTO audit_log (
    tenant_id,
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address
  ) VALUES (
    tenant_id_value,
    user_id_value,
    TG_OP,
    TG_TABLE_NAME,
    record_id_value,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    COALESCE(
      (current_setting('request.headers', true)::json->>'x-forwarded-for')::inet,
      inet_client_addr()
    )
  );
  
  RAISE NOTICE '✅ Audit log entry created successfully';

  RETURN CASE 
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
  END;
EXCEPTION
  WHEN OTHERS THEN
    -- Log detailed error information
    RAISE WARNING '❌ Audit log failed for table %: % (SQLSTATE: %)', TG_TABLE_NAME, SQLERRM, SQLSTATE;
    -- Still return the row to not block the operation
    RETURN CASE 
      WHEN TG_OP = 'DELETE' THEN OLD
      ELSE NEW
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for tables that need auditing

-- staff table
DROP TRIGGER IF EXISTS audit_staff_changes ON staff;
CREATE TRIGGER audit_staff_changes
AFTER INSERT OR UPDATE OR DELETE ON staff
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- staff_personal_data table
DROP TRIGGER IF EXISTS audit_staff_personal_data_changes ON staff_personal_data;
CREATE TRIGGER audit_staff_personal_data_changes
AFTER INSERT OR UPDATE OR DELETE ON staff_personal_data
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- users table
DROP TRIGGER IF EXISTS audit_users_changes ON users;
CREATE TRIGGER audit_users_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- schedules table
DROP TRIGGER IF EXISTS audit_schedules_changes ON schedules;
CREATE TRIGGER audit_schedules_changes
AFTER INSERT OR UPDATE OR DELETE ON schedules
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- tasks table
DROP TRIGGER IF EXISTS audit_tasks_changes ON tasks;
CREATE TRIGGER audit_tasks_changes
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- time_entries table
DROP TRIGGER IF EXISTS audit_time_entries_changes ON time_entries;
CREATE TRIGGER audit_time_entries_changes
AFTER INSERT OR UPDATE OR DELETE ON time_entries
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- absence_requests table
DROP TRIGGER IF EXISTS audit_absence_requests_changes ON absence_requests;
CREATE TRIGGER audit_absence_requests_changes
AFTER INSERT OR UPDATE OR DELETE ON absence_requests
FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
