import { z } from "zod";

export const moduleSchema = z.object({
    title: z.string().min(5, { error: 'El título debe tener al menos 5 caracteres' }), 
    description: z.string().optional()
    //courseId: z.string({ message: 'El curso es requerido' }),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;

export const moduleItemSchema = z.object({
    title: z.string().min(5, { error: 'El título debe tener al menos 5 caracteres' }),
    type: z.enum([ 'assignment' ,'discussion' ,'file', 'page', 'quiz', 'external_url']),
    published: z.boolean().optional(),
    moduleId: z.string({ message: 'El módulo ID es requerido' }).optional(), // se envía por separado
    content: z.string().optional(),
})

export type ModuleItemFormData = z.infer<typeof moduleItemSchema>;
