import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";
import authRouter from "./routes/authRoutes.js";
import affiliateRouter from "./routes/affiliateRoutes.js";
import { isLoggedIn, isLoggedOut } from "./middleware/authMiddleware.js";

const app = express();

app.engine("hbs", engine({
  extname: ".hbs",
  helpers: {
    ifEquals: function(a, b, options) {
      return a === b
        ? options.fn(this)
        : options.inverse(this);
    }
  }
}));

app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// Session configuration
app.use(session({
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
  } else {
    res.redirect('/login');
  }
});

// Rutas de autenticación (sin protección)
app.use("/auth", isLoggedOut, authRouter);
app.get("/login", isLoggedOut, (req, res) => {
  res.redirect("/auth/login");
});
app.get("/register", isLoggedOut, (req, res) => {
  res.redirect("/auth/register");
});

// Rutas protegidas
app.use("/affiliates", isLoggedIn, affiliateRouter);
app.get("/logout", (req, res) => {
  res.redirect("/auth/logout");
});

export default app;