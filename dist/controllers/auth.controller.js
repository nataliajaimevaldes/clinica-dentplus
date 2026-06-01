"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = require("bcryptjs");
const user_model_js_1 = require("../models/user.model.js");
const auth_schemas_js_1 = require("../schemas/auth.schemas.js");
const parseError_js_1 = require("../lib/parseError.js");
class AuthController {
    // VER FORMULARIO REGISTRO
    static async registerView(req, res) {
        res.render('auth/register');
    }
    // REGISTRAR USUARIO
    static async register(req, res) {
        try {
            const validatedData = auth_schemas_js_1.registerSchema.safeParse(req.body);
            if (!validatedData.success) {
                const errors = (0, parseError_js_1.formatZodErrors)(validatedData.error);
                return res.render('auth/register', {
                    errors,
                    email: req.body.email
                });
            }
            // Verificar si el usuario ya existe
            const userExists = await (0, user_model_js_1.findUserByEmail)(validatedData.data.email);
            if (userExists) {
                return res.render('auth/register', {
                    errors: { email: 'Este email ya está registrado' },
                    email: validatedData.data.email
                });
            }
            // Validar que las contraseñas coincidan
            if (validatedData.data.password !== req.body.passwordConfirm) {
                return res.render('auth/register', {
                    errors: { passwordConfirm: 'Las contraseñas no coinciden' },
                    email: validatedData.data.email
                });
            }
            // Hashear contraseña
            const hashedPassword = await (0, bcryptjs_1.hash)(validatedData.data.password, 10);
            // Crear usuario
            await (0, user_model_js_1.createUser)(validatedData.data.email, hashedPassword);
            res.status(201).render('auth/register', {
                success: 'Usuario registrado exitosamente'
            });
        }
        catch (error) {
            console.log(error);
            res.render('auth/register', {
                errors: { general: 'Error al registrar usuario' }
            });
        }
    }
    // VER FORMULARIO LOGIN
    static async loginView(req, res) {
        res.render('auth/login');
    }
    // INICIAR SESIÓN
    static async login(req, res) {
        try {
            const validatedData = auth_schemas_js_1.loginSchema.safeParse(req.body);
            if (!validatedData.success) {
                const errors = (0, parseError_js_1.formatZodErrors)(validatedData.error);
                return res.render('auth/login', {
                    errors,
                    email: req.body.email
                });
            }
            // Buscar usuario
            const user = await (0, user_model_js_1.findUserByEmail)(validatedData.data.email);
            if (!user) {
                return res.render('auth/login', {
                    errors: { general: 'Email o contraseña incorrectos' },
                    email: validatedData.data.email
                });
            }
            // Comparar contraseña
            const isPasswordValid = await (0, bcryptjs_1.compare)(validatedData.data.password, user.password);
            if (!isPasswordValid) {
                return res.render('auth/login', {
                    errors: { general: 'Email o contraseña incorrectos' },
                    email: validatedData.data.email
                });
            }
            // Guardar sesión
            req.session.userId = user.id;
            req.session.userEmail = user.email;
            res.status(200).redirect('/affiliates');
        }
        catch (error) {
            console.log(error);
            res.render('auth/login', {
                errors: { general: 'Error al iniciar sesión' }
            });
        }
    }
    // LOGOUT
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.send('Error al cerrar sesión');
            }
            res.redirect('/login');
        });
    }
}
exports.AuthController = AuthController;
