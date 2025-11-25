import { supabase } from "@/lib/supabase";

/**
 * Get the authenticated user's tenant ID
 * @throws Error if user is not authenticated or tenant not found
 */
export const getUserTenantId = async (): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", user.id)
    .single();

  if (error || !userData) {
    throw new Error("User data not found");
  }

  return userData.tenant_id;
};

/**
 * Get the authenticated user
 * @throws Error if user is not authenticated
 */
export const getAuthenticatedUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
};
