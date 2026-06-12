import { z } from 'zod';
export const affiliateSchema = z.object({
    firstName: z.string()
        .min(1, "El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    lastName: z.string()
        .min(1, "El apellido es requerido")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido no puede exceder 100 caracteres"),
    email: z.string()
        .min(1, "El email es requerido")
        .email("El correo electrónico no es válido")
        .max(100, "El email no puede exceder 100 caracteres"),
    membershipType: z.enum(["silver", "gold", "platinum"])
});
