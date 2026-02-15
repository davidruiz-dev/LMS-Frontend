import type { CreateAnnouncement } from "@/features/courses/schemas/announcements.schema";
import type { Announcement } from "@/features/courses/types/course.types";
import { api } from "@/lib/client"

export const AnnouncementsService = {
    create: async (courseId: string, announcementData: CreateAnnouncement): Promise<Announcement> => {
        const { data } = await api.post(`courses/${courseId}/announcements`, announcementData)
        return data;
    },

    findByCourse: async (courseId: string): Promise<Announcement[]> => {
        const { data } = await api.get(`courses/${courseId}/announcements`)
        return data;
    }
}