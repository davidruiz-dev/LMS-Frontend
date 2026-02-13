import type { Announcement } from "@/features/courses/types/course.types";
import { api } from "@/lib/client"

export const AnnouncementsService = {
    create: async (courseId: string, announcementData: any): Promise<Announcement> => {
        const { data } = await api.post(`courses/${courseId}/announcements`, announcementData)
        return data;
    },

    findByCourse: async (courseId: string): Promise<Announcement[]> => {
        const { data } = await api.get(`courses/${courseId}/announcements`)
        return data;
    }
}