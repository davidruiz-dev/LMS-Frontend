import type { ReactNode } from "react";
import { QueryProvider } from "./queryProvider";
import { AuthProvider } from "./AuthProvider";

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