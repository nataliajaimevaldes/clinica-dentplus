"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const express_handlebars_1 = require("express-handlebars");
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const affiliateRoutes_js_1 = __importDefault(require("./routes/affiliateRoutes.js"));
const authMiddleware_js_1 = require("./middleware/authMiddleware.js");
const auth_controller_js_1 = require("./controllers/auth.controller.js");
const app = (0, express_1.default)();
app.engine("hbs", (0, express_handlebars_1.engine)({
    extname: ".hbs",
    helpers: {
        ifEquals: function (a, b, options) {
            return a === b
                ? options.fn(this)
                : options.inverse(this);
        }
    }
}));
app.set("view engine", "hbs");
app.set("views", "./src/views");
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(express_1.default.static("public"));
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "desarrollo",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // cambiar a true en producción con HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));
app.get("/", (req, res) => {
    if (req.session?.userId) {
        res.render("home");
    }
    else {
        res.redirect('/login');
    }
});
// Rutas de autenticación (sin protección)
app.use("/auth", authMiddleware_js_1.isLoggedOut, authRoutes_js_1.default);
app.get("/login", authMiddleware_js_1.isLoggedOut, (req, res) => {
    res.redirect("/auth/login");
});
app.get("/register", authMiddleware_js_1.isLoggedOut, (req, res) => {
    res.redirect("/auth/register");
});
// Rutas protegidas
app.use("/affiliates", authMiddleware_js_1.isLoggedIn, affiliateRoutes_js_1.default);
app.get("/logout", authMiddleware_js_1.isLoggedIn, auth_controller_js_1.AuthController.logout);
exports.default = app;
