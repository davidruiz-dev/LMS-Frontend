import type { ModuleFormData } from "@/features/courses/schemas";
import { moduleService } from "@/features/courses/services/moduleService";
import type { Module } from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

export function useModulesByCourse(idCourse: string | undefined) {
    return useQuery({
        queryKey: ['modules-course', idCourse],
        queryFn: () => moduleService.getModulesByCourse(idCourse!),
        enabled: !!idCourse
    })
}

export const useCreateModule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, module }: { courseId: string; module: ModuleFormData }) => moduleService.createModule(courseId, module),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
            Swal.fire({
                icon: "success",
                title: "Inscripción creada",
                showConfirmButton: false,
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al crear módulo",
                showConfirmButton: false,
                timer: 2000
            });
            console.error(error);
        }
    })
}


export const useReorderModules = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, orderData }: { courseId: string; orderData: { modules: Module[]} }) => moduleService.reorderModules(courseId, orderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
            Swal.fire({
                icon: "success",
                title: "Actualizado",
                showConfirmButton: false,
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error al reordenar módulos",
                showConfirmButton: false,
                timer: 2000
            });
            console.error(error);
        }
    })
}