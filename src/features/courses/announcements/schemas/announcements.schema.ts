import z from "zod";

export const AnnouncementSchema = z.object({
    title: z.string().min(5, {error: 'El nombre debe tener al menos 5 caracteres'}),
    content: z.string({ message: 'El contenido es requerido.'}),
    isPublished: z.boolean().optional(),
})

export type CreateAnnouncement = z.infer<typeof AnnouncementSchema>;

// Editar
export const EditAnnouncementSchema = AnnouncementSchema.partial();
export type EditAnnouncement = Partial<CreateAnnouncement>;