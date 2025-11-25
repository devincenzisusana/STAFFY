-- Function to link Google OAuth users to existing staff records by email
CREATE OR REPLACE FUNCTION link_google_user_to_staff()
RETURNS TRIGGER AS $$
DECLARE
  staff_record RECORD;
  user_provider TEXT;
  user_tenant_id UUID;
  user_role TEXT;
BEGIN
  -- Get the provider from auth.identities table
  SELECT provider INTO user_provider
  FROM auth.identities
  WHERE user_id = NEW.id
  LIMIT 1;

  -- Only process Google OAuth signups
  IF user_provider = 'google' THEN
    -- Check if there's an existing staff record with this email but different ID
    SELECT * INTO staff_record
    FROM public.staff
    WHERE email = NEW.email
    AND id != NEW.id;

    IF FOUND THEN
      RAISE NOTICE 'Found existing staff record with ID % for email %, updating to Google auth ID %', staff_record.id, NEW.email, NEW.id;
      
      -- Get tenant_id and role from placeholder users record
      SELECT tenant_id, role INTO user_tenant_id, user_role
      FROM public.users
      WHERE id = staff_record.id;
      
      -- Update related records first
      UPDATE public.staff_personal_data
      SET staff_id = NEW.id
      WHERE staff_id = staff_record.id;

      -- Create new users record with Google auth ID
      INSERT INTO public.users (id, tenant_id, email, role)
      VALUES (NEW.id, user_tenant_id, NEW.email, COALESCE(user_role, 'staff-operator'))
      ON CONFLICT (id) DO UPDATE SET 
        role = EXCLUDED.role,
        tenant_id = EXCLUDED.tenant_id;

      -- Update the staff record to use the Google auth user ID
      UPDATE public.staff
      SET id = NEW.id
      WHERE id = staff_record.id;

      -- Delete the placeholder user record
      DELETE FROM public.users WHERE id = staff_record.id AND id != NEW.id;

      RAISE NOTICE 'Successfully linked Google user % to existing staff record', NEW.email;
    ELSE
      -- New Google user without existing staff record
      -- Get tenant_id from first tenant (fallback)
      SELECT id INTO user_tenant_id FROM public.tenants LIMIT 1;
      
      -- Create users table entry with default staff-operator role
      INSERT INTO public.users (id, tenant_id, email, role)
      VALUES (NEW.id, user_tenant_id, NEW.email, 'staff-operator')
      ON CONFLICT (id) DO NOTHING;
      
      RAISE NOTICE 'Created new users record for Google user %', NEW.email;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_google_user_created ON auth.users;
CREATE TRIGGER on_google_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION link_google_user_to_staff();
