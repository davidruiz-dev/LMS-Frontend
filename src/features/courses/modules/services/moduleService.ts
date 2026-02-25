import type { ModuleFormData, ModuleItemFormData } from "@/features/courses/modules/schemas/module.schema";
import type { Module, ModuleItem, ReorderModuleItemsDto, ReorderModulesDto } from "@/features/courses/modules/types/module.types";
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

    updateModule: async (courseId: string, moduleId: string, data: ModuleFormData) => {
        const response = await api.patch(`/courses/${courseId}/modules/${moduleId}`, data);
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
    getItems: async (courseId: string, moduleId: string) : Promise<ModuleItem[]> => {
        const { data } = await api.get(`/courses/${courseId}/modules/${moduleId}/items`)
        return data;
    },

    createModuleItem: async (courseId: string, moduleId: string, moduleItemData: ModuleItemFormData): Promise<ModuleItem> => {
        const { data } = await api.post(`/courses/${courseId}/modules/${moduleId}/items`, moduleItemData);
        return data;
    },

    deleteItem: async (courseId: string, moduleId: string, id: string) => {
        const { data } = await api.delete(`/courses/${courseId}/modules/${moduleId}/items/${id}`);
        return data;
    },

    reorderModuleItems: async (courseId: string, moduleId: string, orderData: ReorderModuleItemsDto): Promise<ModuleItem[]> => {
        const { data } = await api.post(`/courses/${courseId}/modules/${moduleId}/items/reorder`, orderData);
        return data;
    }
}