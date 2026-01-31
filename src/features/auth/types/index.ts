import type { User } from "@/shared/types"

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: 'student' | 'instructor'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  canManageCourse: (instructorId: string) => boolean;
}