// app/providers/auth-provider.tsx
import { useCurrentUser, useLoginMutation, useLogoutMutation } from "@/features/auth/hooks/useAuth";
import type { AuthContextType, LoginCredentials } from "@/features/auth/types";
import { STORAGE_KEYS, USER_ROLES } from "@/shared/constants";
import { useContext, useEffect, useState, type ReactNode, createContext } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  );
  
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  
  // Solo hacer query del usuario si hay token
  const { data: user, isLoading, error } = useCurrentUser(!!token);

  const isAuthenticated = !!token && !!user && !error;

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await loginMutation.mutateAsync(credentials);
      setToken(response.access_token);
    } catch (error) {
      throw error;
    }
  };

  

  const canManageCourse = (instructorId: string): boolean => {
    if (!user) return false;
    return user.id === instructorId || user.role === USER_ROLES.ADMIN;
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setToken(null);
    } catch (error) {
      // Logout local incluso si falla el servidor
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
    }
  };

  // Sync token state with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      setToken(storedToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const contextValue: AuthContextType = {
    user: user || null,
    token,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    canManageCourse
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};