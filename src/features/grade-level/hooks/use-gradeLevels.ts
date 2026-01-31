import { GradeLevelService } from "@/features/grade-level/services/gradeLevelService";
import type { GradeLevel } from "@/features/grade-level/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"

export const useGradeLevels = (filters: any = {}) => {
    return useQuery({
        queryKey: ["gradeLevels", filters],
        queryFn: () => GradeLevelService.getAll(filters),
    })
}

export const useCreateGradeLevel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (gradeLevel: Omit<GradeLevel, 'id'>) => GradeLevelService.create(gradeLevel),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gradeLevels'] });
            toast.success("Grado creado exitosamente")
        },
        onError: (error) => {
            console.error(error);
            toast.error("Error al crear el grado")
        }
    })
};

export function useUpdateGradeLevel() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: GradeLevel) => GradeLevelService.update(data.id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['gradeLevels'] });
            queryClient.invalidateQueries({ queryKey: ['gradeLevel', variables.id] });
            toast.success('Grado actualizado con éxito');
        },
        onError: (error) => {
            toast.error('Error al actualizar el grado');
            console.error(error);
        },
    });
}

export function useGradeLevel(id: string | undefined) {
    return useQuery({
        queryKey: ['gradeLevel', id],
        queryFn: () => GradeLevelService.getById(id!),
        enabled: !!id, // Solo ejecutar si existe un ID
    });
}

export function useGradeLevelByName(name: string | undefined) {
    return useQuery({
        queryKey: ['gradeLevelByName', name],
        queryFn: () => GradeLevelService.findByName(name),
        enabled: !!name, // Solo ejecutar si existe un nombre
    });
}