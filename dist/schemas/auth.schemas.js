import { z } from 'zod';
export const loginSchema = z.object({
    email: z.string()
        .min(1, 'El email es requerido')
        .email('El correo electrónico no es válido'),
    password: z.string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
export const registerSchema = z.object({
    email: z.string()
        .min(1, 'El email es requerido')
        .email('El correo electrónico no es válido'),
    password: z.string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres'),
});
