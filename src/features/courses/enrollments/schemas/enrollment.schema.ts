import z from "zod";

export const enrollmentSchema = z.object({
    userId: z.string({ message: 'El usuario es requerido'}),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
