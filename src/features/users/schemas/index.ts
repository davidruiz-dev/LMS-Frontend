import { z } from 'zod'

export const userSchema = z.object({
    firstName: z.string().min(2, { message: "Nombre debe tener al menos 2 caracteres.", }),
    lastName: z.string().min(2, { message: "Apellido debe tener al menos 2 caracteres.", }),
    email: z.email({ message: "Invalid email address.", }),
    password: z.string({ message: 'La contraseña es requerida'}).min(6, { message: 'La contraseña debe tener al menos 6 caracteres'}),
    role: z.enum(['admin', 'instructor', 'student']),
    isActive: z.boolean(),
});

export type UserFormData = z.infer<typeof userSchema>;