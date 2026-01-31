import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email('Email inválido'),
    password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
})

export const registerSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
    role: z.enum(['student', 'instructor']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>