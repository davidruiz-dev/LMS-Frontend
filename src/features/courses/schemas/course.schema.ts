import z from "zod";

export const courseSchema = z.object({
    name: z.string().min(20, {error: 'El nombre debe tener al menos 20 caracteres'}),
    description: z.string(),
    short_description: z.string().max(250, {error: 'La descripción debe tener máximo 200 caracteres'}).min(150, { error: 'La descripción debe tener mínimo 150 caracteres'}),
    gradeLevelId: z.string(),
    instructorId: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    status: z.enum(['draft', 'published', 'archived']),
});

export type CourseFormData = z.infer<typeof courseSchema>;