import z from "zod";

export const enrollmentSchema = z.object({
    courseId: z.string({ message: 'El curso es requerido'}),
    userId: z.string({ message: 'El usuario es requerido'}),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
