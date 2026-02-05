import { queryClient } from './../../../lib/queryClient';
import type { ModuleFormData, ModuleItemFormData } from "@/features/courses/schemas/module.schema";
import { moduleService } from "@/features/courses/services/moduleService";
import type { ReorderModuleItemsDto, ReorderModulesDto } from "@/features/courses/types/course.types";
import { showError, showSuccess } from '@/helpers/alerts';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useModulesByCourse(id: string | undefined) {
    return useQuery({
        queryKey: ['modules-course', id],
        queryFn: () => moduleService.getModulesByCourse(id!),
        enabled: !!id
    })
}

export const useCreateModule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, module }: { courseId: string; module: ModuleFormData }) => moduleService.createModule(courseId, module),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

export const useDeleteModule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, moduleId}: { courseId: string, moduleId: string }) => moduleService.deleteModule(courseId, moduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

export const useReorderModules = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, orderData }: { courseId: string; orderData: ReorderModulesDto }) => moduleService.reorderModules(courseId, orderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
            showSuccess("Módulos reordenados correctamente");
        },
        onError: (error) => {
            showError("Error al reordenar módulos");
            console.error(error);
        }
    })
}

export const useCreateModuleItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, moduleId, moduleItem }: { courseId: string, moduleId: string; moduleItem: ModuleItemFormData }) => moduleService.createModuleItem(courseId, moduleId, moduleItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

export const useReorderModuleItems = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, moduleId, orderData }: { courseId: string, moduleId: string; orderData: ReorderModuleItemsDto }) => moduleService.reorderModuleItems(courseId, moduleId, orderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
            showSuccess("Elementos reordenados correctamente");
        },
        onError: (error) => {
            showError("Error al reordenar elementos");
            console.error(error);
        }
    })
}