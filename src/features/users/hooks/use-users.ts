import type { UserFormData } from "@/features/users/schemas";
import { UsersService } from "@/features/users/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2"

export const useUsers = (filters: any = {}) => {
    return useQuery({
        queryKey: ["users", filters],
        queryFn: () => UsersService.getAll(filters),
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: UserFormData) => UsersService.create(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            Swal.fire({
                icon: "success",
                title: "Usuario agregado",
                showConfirmButton: false,
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al añadir usuario",
                showConfirmButton: false,
                timer: 2000
            });
            console.error(error);
        }
    })
};

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) =>
            UsersService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
            Swal.fire({
                icon: "success",
                title: "Usuario actualizado",
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al editar usuario",
                showConfirmButton: false,
                timer: 1500
            });
            console.error(error);
        },
    });
}

export function useUser(id: string | undefined) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => UsersService.getById(id!),
        enabled: !!id, // Solo ejecutar si existe un ID
    });
}

export const useDeleteUser = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => UsersService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            Swal.fire({
                icon: "success",
                title: "Usuario eliminado exitosamente",
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al eliminar usuario",
                showConfirmButton: false,
                timer: 1500
            });
            console.error(error);
        }
    })
}