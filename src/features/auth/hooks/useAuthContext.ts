import { useContext } from "react";
import type { AuthContextType } from "@/features/auth/types";import { AuthContext } from "../context/AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe ser usado dentro de un AuthProvider"
    );
  }

  return context;
};