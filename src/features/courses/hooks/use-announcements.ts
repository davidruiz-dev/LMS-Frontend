import { AnnouncementsService } from "@/features/courses/services/announcementsService"
import { showError, showSuccess } from "@/helpers/alerts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAnnouncements = (courseId: string) => {
    return useQuery({
        queryKey: ['announcements', courseId],
        queryFn: () => AnnouncementsService.findByCourse(courseId),
        enabled: !!courseId
    })
}

export const useCreateAnnouncement = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({courseId, data}:{courseId: string, data: any}) => 
            AnnouncementsService.create(courseId, data),
        onSuccess: (_, { courseId }) => {
            showSuccess('Anuncio creado correctamente.')
            qc.invalidateQueries({ queryKey: ['announcements', courseId]})
        },
        onError: (error) => {
            showError(error.message || 'Error al crear anuncio.')
        }
    })
}