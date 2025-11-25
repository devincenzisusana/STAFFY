import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          setIsLoading(false);
          return;
        }

        setUser(authUser);

        // Log authenticated user ID
        console.log("🔐 Authenticated User ID:", authUser.id);

        // Fetch tenant name and role
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("tenant_id, role, tenants(name)")
          .eq("id", authUser.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
        }

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
      }
    };

    fetchUserData();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        // Refetch user data when signed in
        fetchUserData();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserName("");
        setTenantName("");
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userName, tenantName, userRole, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
