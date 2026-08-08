import {
  useLoginMutation,
  useLogoutMutation,
  useCurrentUser,
} from "@/features/auth/hooks/useAuth";
import type {
  AuthContextType,
  LoginCredentials,
} from "@/features/auth/types";
import { STORAGE_KEYS, USER_ROLES } from "@/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AuthContext } from "../context/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  );

  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const { data: user, isLoading, error } = useCurrentUser(!!token);
  const queryClient = useQueryClient();

  const isAuthenticated = !!token && !!user && !error;

  const login = async (credentials: LoginCredentials) => {
    const response = await loginMutation.mutateAsync(credentials);
    setToken(response.access_token);
  };

  const canManageCourse = (instructorId: string): boolean => {
    if (!user) return false;

    return (
      user.id === instructorId ||
      user.role === USER_ROLES.ADMIN
    );
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();

      setToken(null);
      queryClient.clear();
    } catch {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      setToken(null);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(
        localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      );
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, []);

  const contextValue: AuthContextType = {
    user: user || null,
    token,
    isAuthenticated,
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending,
    login,
    logout,
    canManageCourse,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};