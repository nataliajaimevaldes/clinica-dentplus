import express from "express";

import { engine } from "express-handlebars";

import affiliateRouter from "./routes/affiliateRoutes.js";

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

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/affiliates", affiliateRouter);

export default app;