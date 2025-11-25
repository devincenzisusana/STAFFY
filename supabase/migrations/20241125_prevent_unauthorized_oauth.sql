-- =====================================================
-- Prevent Unauthorized OAuth User Creation
-- =====================================================
-- This migration ensures that only pre-registered users
-- can successfully authenticate via OAuth (Google/Azure)
-- =====================================================

-- Function to check if user should be allowed to sign in
CREATE OR REPLACE FUNCTION public.check_user_authorization()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user exists in users table
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = NEW.id
  ) THEN
    -- User not in users table, reject the auth
    RAISE EXCEPTION 'User not authorized. Please contact your administrator.'
      USING HINT = 'Only pre-registered users can sign in';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: We cannot create triggers on auth.users directly
-- Instead, we handle this in the application layer (AuthContext)

-- Create a function that can be called after OAuth sign-in
CREATE OR REPLACE FUNCTION public.validate_oauth_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user exists in users table
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.validate_oauth_user TO authenticated;

COMMENT ON FUNCTION public.validate_oauth_user IS 'Validates if an OAuth user is authorized to access the system';
