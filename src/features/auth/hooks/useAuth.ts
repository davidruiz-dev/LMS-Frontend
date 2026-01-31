import { authAPI } from '@/features/auth/services/auth.service';
import { QUERY_KEYS, STORAGE_KEYS } from '@/shared/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from "sweetalert2";

export const useLoginMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data) => {
            // Guardar token en localStorage
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
            // Invalidar queries relacionadas con auth
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER });
        },
        onError: (error) => {
            console.error('Login failed:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Credencilaes inválidas',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        },
    });
};

export const useCurrentUser = (enabled: boolean = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.AUTH.USER,
        queryFn: authAPI.getCurrentUser,
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: false,
    });
};

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authAPI.logout,
        onSuccess: () => {
            // Limpiar storage
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

            // Limpiar cache
            queryClient.clear();
        },
    });
};