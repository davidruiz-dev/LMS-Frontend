import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import axios from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,

      retry: (failureCount, error) => {
        if (
          axios.isAxiosError(error) &&
          error.response?.status &&
          [401, 403, 404].includes(error.response.status)
        ) {
          return false;
        }

        return failureCount < 3;
      },
    },

    mutations: {
      retry: false,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};