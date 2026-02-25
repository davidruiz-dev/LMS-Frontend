import { queryClient } from './../../../lib/queryClient';
import type { ModuleFormData, ModuleItemFormData } from "@/features/courses/modules/schemas/module.schema";
import { moduleService } from "@/features/courses/modules/services/moduleService";
import type { ReorderModuleItemsDto, ReorderModulesDto } from "@/features/courses/types/course.types";
import { showError, showSuccess } from '@/helpers/alerts';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useModulesByCourse(id: string) {
    return useQuery({
        queryKey: ['modules-course', id],
        queryFn: () => moduleService.getModulesByCourse(id),
        enabled: !!id
    })
}

export const useCreateModule = (courseId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (module: ModuleFormData) => moduleService.createModule(courseId, module),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
            showSuccess("Módulo creado exitosamente");
        },
        onError: (error) => {
            showError(error.message || "Error al crear módulo");
            console.error(error);
        }
    })
}

export const useUpdateModule = (courseId: string, moduleId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ModuleFormData) =>
            moduleService.updateModule(courseId, moduleId, data),
        onSuccess: (updatedModule) => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
            showSuccess('Módulo actualizado exitosamente');
        },
        onError: (error: any) => {
            showError(error?.message || 'Error al actualizar el módulo');
        },
    });
};

export const useDeleteModule = (courseId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (moduleId: string) => moduleService.deleteModule(courseId, moduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules-course'] })
            showSuccess('Módulo eliminado correctamente')
        },
        onError: (error) => {
            showError('Error al eliminar el módulo')
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

// Get all module items
export const useModuleItems = (courseId: string, moduleId: string) => {
  return useQuery({
    queryKey: ['module-items', courseId, moduleId],
    queryFn: () => moduleService.getItems(courseId, moduleId),
  });
};

export const useCreateModuleItem = (courseId: string, moduleId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (moduleItem: ModuleItemFormData) => moduleService.createModuleItem(courseId, moduleId, moduleItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module-items'] })
            showSuccess('Contenido agregado correctamente')
        },
        onError: (error) => {
            showError('Error al agregar contenido al módulo')
            console.error(error);
        }
    })
}

export const useDeleteModuleItem = (courseId: string, moduleId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => moduleService.deleteItem(courseId, moduleId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module-items'] })
            showSuccess("Elemento eliminado correctamente");
        },
        onError: (error) => {
            showError(error.message || "Error al reordenar elementos");
            console.error(error);
        }
    })
}

export const useReorderModuleItems = (courseId: string, moduleId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderData: ReorderModuleItemsDto) => moduleService.reorderModuleItems(courseId, moduleId, orderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['module-items'] })
            showSuccess("Elementos reordenados correctamente");
        },
        onError: (error) => {
            showError("Error al reordenar elementos");
            console.error(error);
        }
    })
}