import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToastContext } from "./ToastContext";

interface AuthContextType {
  user: User | null;
  userName: string;
  tenantName: string;
  userRole: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userName: "",
  tenantName: "",
  userRole: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [tenantName, setTenantName] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasShownErrorRef = useRef(false);
  const isCheckingAuthRef = useRef(false);
  const toast = useToastContext();

  const fetchUserData = useCallback(async () => {
    // Prevent concurrent executions
    if (isCheckingAuthRef.current) {
      console.log("Already checking auth, skipping...");
      return;
    }

    isCheckingAuthRef.current = true;

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setIsLoading(false);
        isCheckingAuthRef.current = false;
        return;
      }

      // Log authenticated user ID
      console.log("🔐 Authenticated User ID:", authUser.id);

      // Fetch tenant name and role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("tenant_id, role, tenants(name)")
        .eq("id", authUser.id)
        .single();

      // If user doesn't exist in users table, they're not authorized
      if (userError || !userData) {
        console.error("User not found in database:", userError);
        console.warn("Unauthorized OAuth sign-in attempt. Signing out...");

        // Sign out the unauthorized user
        await supabase.auth.signOut();

        // Clear state first
        setUser(null);
        setUserName("");
        setTenantName("");
        setUserRole(null);

        // Set loading to false AFTER clearing user state
        setIsLoading(false);

        // Show error toast only once using ref
        if (!hasShownErrorRef.current) {
          hasShownErrorRef.current = true;
          toast.error(
            "Access denied. This account is not registered in the system. Please contact your administrator.",
            6000
          );
        }

        isCheckingAuthRef.current = false;
        // Don't redirect here - ProtectedRoute will handle it
        return;
      }

      // Reset error flag on successful auth
      hasShownErrorRef.current = false;

      // User is authorized, set the user
      setUser(authUser);

      if (!userError && userData) {
        // @ts-ignore - tenants relationship
        const tenant = userData.tenants?.name || "STAFFY";
        setTenantName(tenant);
        setUserRole(userData.role || null);

        // Log user role
        console.log("👤 User Role:", userData.role || "No role assigned");
      }

      // Fetch staff member's name
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select("id, staff_personal_data(first_name, last_name)")
        .eq("email", authUser.email)
        .single();

      if (!staffError && staffData && staffData.staff_personal_data) {
        // @ts-ignore - staff_personal_data relationship
        const personalData = Array.isArray(staffData.staff_personal_data)
          ? staffData.staff_personal_data[0]
          : staffData.staff_personal_data;

        if (personalData) {
          const fullName =
            `${personalData.first_name || ""} ${
              personalData.last_name || ""
            }`.trim() ||
            authUser.email ||
            "User";
          setUserName(fullName);
        } else {
          setUserName(authUser.email || "User");
        }
      } else {
        setUserName(authUser.email || "User");
      }
    } catch (error) {
      console.error("Error fetching auth data:", error);
    } finally {
      setIsLoading(false);
      isCheckingAuthRef.current = false;
    }
  }, [toast]);

  useEffect(() => {
    // Initial check
    fetchUserData();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (event === "SIGNED_IN" && session?.user) {
        // Fetch user data on sign in
        // The lock mechanism prevents duplicate calls
        await fetchUserData();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserName("");
        setTenantName("");
        setUserRole(null);
        hasShownErrorRef.current = false;
        isCheckingAuthRef.current = false;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  return (
    <AuthContext.Provider
      value={{ user, userName, tenantName, userRole, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
