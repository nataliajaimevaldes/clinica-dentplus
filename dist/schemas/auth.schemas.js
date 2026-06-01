"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, 'El email es requerido')
        .email('El correo electrónico no es válido'),
    password: zod_1.z.string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string()
        .min(1, 'El email es requerido')
        .email('El correo electrónico no es válido'),
    password: zod_1.z.string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña no puede exceder 100 caracteres'),
});
