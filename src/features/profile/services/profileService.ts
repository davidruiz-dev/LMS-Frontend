import { api } from "@/shared/lib/client";
import type { ChangePasswordPayload, ProfileDto, ProfileStatsDto, PublicProfileDto, UpdateProfilePayload } from "../types/profile.types";

export const profileService = {
    getMyProfile: async () => {
        const { data } = await api.get<ProfileDto>("/profile/me");
        console.log(data)
        return data;
    },

    updateMe: (payload: UpdateProfilePayload) => api.patch<ProfileDto>('/profile/me', payload).then((r) => r.data),
    changePassword: (payload: ChangePasswordPayload) => api.patch('/profile/me/password', payload).then((r) => r.data),
    uploadAvatar: (file: File) => {
        const form = new FormData();
        form.append('file', file);
        return api.post<{ avatarUrl: string }>('/profile/me/avatar', form).then((r) => r.data);
    },
    getStats: () => api.get<ProfileStatsDto>('/profile/me/stats').then((r) => r.data),
    getPublic: async (userId: string) => {
        const { data } = await api.get<PublicProfileDto>(`/profile/${userId}`);
        return data;
    },
}