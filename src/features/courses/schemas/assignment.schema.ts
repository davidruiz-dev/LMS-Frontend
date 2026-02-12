import z from "zod";

export const AssignmentSchema = z.object({
    name: z.string().min(5, { message: 'Mínimo 5 caracteres'}),
    description: z.string({ message: 'La descripción es requerida'}),
    maxPoints: z.string(),
    dueDate: z.date(),
    maxAttempts: z.string(),
    allowLateSubmissions: z.boolean(),
    availableFrom: z.date(),
    availableUntil: z.date(),
    isPublished: z.boolean(),
})

export type AssignmentFormDataCreate = z.infer<typeof AssignmentSchema>;
export type AssignmentFormDataUpdate = Partial<AssignmentFormDataCreate>;