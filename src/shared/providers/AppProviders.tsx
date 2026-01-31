import { AuthProvider } from "@/shared/providers/AuthProvider";
import { QueryProvider } from "@/shared/providers/queryProvier";
import type { ReactNode } from "react";

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
};