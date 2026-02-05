import type { ModuleFormData, ModuleItemFormData } from "@/features/courses/schemas/module.schema";
import type { Module, ModuleItem, ReorderModuleItemsDto, ReorderModulesDto } from "@/features/courses/types/course.types";
import { api } from "@/lib/client";

export const moduleService = {
    getModulesByCourse: async (courseId: string): Promise<Module[]> => {
        const response = await api.get(`/courses/${courseId}/modules`);
        return response.data;
    },

    createModule: async (courseId: string, moduleData: ModuleFormData) => {
        const response = await api.post(`/courses/${courseId}/modules`, moduleData);
        return response.data;
    },

    deleteModule: async (courseId: string, moduleId: string) => {
        const { data } = await api.delete(`/courses/${courseId}/modules/${moduleId}`)
        return data;
    },

    reorderModules: async (courseId: string, orderData: ReorderModulesDto): Promise<Module[]> => {
        const { data } = await api.post(`/courses/${courseId}/modules/reorder`, orderData);
        return data;
    },

    /* Module Items methods */
    createModuleItem: async (courseId: string, moduleId: string, moduleItemData: ModuleItemFormData): Promise<ModuleItem> => {
        const { data } = await api.post(`/courses/${courseId}/modules/${moduleId}/items`, moduleItemData);
        return data;
    },

    reorderModuleItems: async (courseId: string, moduleId: string, orderData: ReorderModuleItemsDto): Promise<ModuleItem[]> => {
        const { data } = await api.post(`/courses/${courseId}/modules/${moduleId}/items/reorder`, orderData);
        return data;
    }
}