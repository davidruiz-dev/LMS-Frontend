import { queryClient } from './../../../lib/queryClient';
import type { ModuleFormData, ModuleItemFormData } from "@/features/courses/schemas/module.schema";
import { moduleService } from "@/features/courses/services/moduleService";
import type { ReorderModuleItemsDto, ReorderModulesDto } from "@/features/courses/types/course.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
        },
        onError: (error) => {
            console.error(error);
        }
    })
}

export const useCreateModuleItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ moduleId, moduleItem }: { moduleId: string; moduleItem: ModuleItemFormData }) => moduleService.createModuleItem(moduleId, moduleItem),
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
        mutationFn: ({ moduleId, orderData }: { moduleId: string; orderData: ReorderModuleItemsDto }) => moduleService.reorderModuleItems(moduleId, orderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
        },
        onError: (error) => {
            console.error(error);
        }
    })
}