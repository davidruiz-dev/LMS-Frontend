import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import type { ChangePasswordPayload, UpdateProfilePayload } from '../types/profile.types';
import { showError, showSuccess } from '@/shared/helpers/alerts';

export function useMyProfile() {
  return useQuery({ queryKey: ['profile', 'me'], queryFn: profileService.getMyProfile });
}

export function useProfileStats() {
  return useQuery({ queryKey: ['profile', 'me', 'stats'], queryFn: profileService.getStats, staleTime: 60_000 });
}

export function usePublicProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getPublic(userId),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileService.updateMe(payload),
    onSuccess: (data) => {
      qc.setQueryData(['profile', 'me'], data);
      showSuccess('Perfil actualizado');
    },
    onError: () => showError('No se pudo actualizar el perfil'),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileService.changePassword(payload),
    onSuccess: () => showSuccess('Contraseña actualizada'),
    onError: (err: any) => showError(err?.message ?? 'No se pudo cambiar la contraseña'),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: ({ avatarUrl }) => {
      qc.setQueryData(['profile', 'me'], (old: any) => (old ? { ...old, avatarUrl } : old));
      showSuccess('Avatar actualizado');
    },
    onError: () => showError('No se pudo subir la imagen'),
  });
}