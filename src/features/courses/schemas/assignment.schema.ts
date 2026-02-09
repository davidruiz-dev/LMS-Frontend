import z from "zod";

export const AssignmentSchema = z.object({
    name: z.string().min(5, { message: 'Mínimo 5 caracteres'}),
    description: z.string().optional(),
    points: z.string(),
    dueDate: z.date(),
    availableFrom: z.date(),
    availableUntil: z.date(),
    isPublished: z.boolean(),
})

export type AssignmentFormDataCreate = z.infer<typeof AssignmentSchema>;
export type AssignmentFormDataUpdate = Partial<AssignmentFormDataCreate>;