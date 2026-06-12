import { hash, compare } from 'bcryptjs';
import { findUserByEmail, createUser } from '../models/user.model.js';
import { registerSchema, loginSchema } from '../schemas/auth.schemas.js';
import { formatZodErrors } from '../lib/parseError.js';
export class AuthController {
    // VER FORMULARIO REGISTRO
    static async registerView(req, res) {
        res.render('auth/register');
    }
    // REGISTRAR USUARIO
    static async register(req, res) {
        try {
            const validatedData = registerSchema.safeParse(req.body);
            if (!validatedData.success) {
                const errors = formatZodErrors(validatedData.error);
                return res.render('auth/register', {
                    errors,
                    email: req.body.email
                });
            }
            // Verificar si el usuario ya existe
            const userExists = await findUserByEmail(validatedData.data.email);
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
            const hashedPassword = await hash(validatedData.data.password, 10);
            // Crear usuario
            await createUser(validatedData.data.email, hashedPassword);
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
            const validatedData = loginSchema.safeParse(req.body);
            if (!validatedData.success) {
                const errors = formatZodErrors(validatedData.error);
                return res.render('auth/login', {
                    errors,
                    email: req.body.email
                });
            }
            // Buscar usuario
            const user = await findUserByEmail(validatedData.data.email);
            if (!user) {
                return res.render('auth/login', {
                    errors: { general: 'Email o contraseña incorrectos' },
                    email: validatedData.data.email
                });
            }
            // Comparar contraseña
            const isPasswordValid = await compare(validatedData.data.password, user.password);
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
