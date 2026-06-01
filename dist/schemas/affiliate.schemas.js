"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.affiliateSchema = void 0;
const zod_1 = require("zod");
exports.affiliateSchema = zod_1.z.object({
    firstName: zod_1.z.string()
        .min(1, "El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    lastName: zod_1.z.string()
        .min(1, "El apellido es requerido")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido no puede exceder 100 caracteres"),
    email: zod_1.z.string()
        .min(1, "El email es requerido")
        .email("El correo electrónico no es válido")
        .max(100, "El email no puede exceder 100 caracteres"),
    membershipType: zod_1.z.enum(["silver", "gold", "platinum"])
});
