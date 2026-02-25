import type { CreateAnnouncement, EditAnnouncement } from "@/features/courses/announcements/schemas/announcements.schema";
import type { Announcement } from "@/features/courses/announcements/types/announcement.types";
import { api } from "@/lib/client"

export const AnnouncementsService = {
    create: async (courseId: string, announcementData: CreateAnnouncement): Promise<Announcement> => {
        const { data } = await api.post(`courses/${courseId}/announcements`, announcementData)
        return data;
    },

    findByCourse: async (courseId: string): Promise<Announcement[]> => {
        const { data } = await api.get(`courses/${courseId}/announcements`)
        return data;
    },

    edit: async (courseId: string, announcementId: string, announcementData: EditAnnouncement) => {
        const { data } = await api.patch(`courses/${courseId}/announcements/${announcementId}`, announcementData)
        return data;
    },

    delete: async (courseId: string, announcementId: string) => {
        const { data } = await api.delete(`courses/${courseId}/announcements/${announcementId}`)
        return data;
    }
}