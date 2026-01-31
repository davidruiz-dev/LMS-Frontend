import {z} from "zod";

export const gradeLevelSchema = ({
    name: z.string(),
    description: z.string(),
    level: z.enum(['primaria','secundaria']).default('primaria')
})

export type GradeLevelFormData = z.infer<typeof gradeLevelSchema>;