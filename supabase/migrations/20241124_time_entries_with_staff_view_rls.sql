-- Enable Row Level Security on time_entries_with_staff view
-- Note: Views in PostgreSQL don't support RLS policies directly.
-- Instead, we use security_invoker to make the view execute with the caller's privileges,
-- which means it will automatically inherit RLS policies from the underlying tables.

ALTER VIEW time_entries_with_staff SET (security_invoker = on);

-- No explicit policies needed - the view will use RLS from time_entries, staff, and staff_personal_data tables
