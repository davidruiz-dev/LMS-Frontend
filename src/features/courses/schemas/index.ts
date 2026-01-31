import { z } from "zod";

// course
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

// enrollment
export const enrollmentSchema = z.object({
    courseId: z.string({ message: 'El curso es requerido'}),
    userId: z.string({ message: 'El usuario es requerido'}),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

// course modules
export const moduleSchema = z.object({
    title: z.string().min(5, { error: 'El título debe tener al menos 5 caracteres' }), 
    description: z.string().optional()
    //courseId: z.string({ message: 'El curso es requerido' }),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;
