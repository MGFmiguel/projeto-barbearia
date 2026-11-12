const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

require("./database/database");

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error("Defina SESSION_SECRET com pelo menos 32 caracteres.");
}

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(session({
    name: "mgf.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 8 * 60 * 60 * 1000
    }
}));

// Páginas protegidas também não podem ser abertas diretamente via arquivo .html.
app.use((req, res, next) => {
    if (/\.html$/i.test(req.path) && req.path.toLowerCase() !== "/login.html" && req.session.usuario !== "admin") {
        return res.redirect("/");
    }
    next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(require("./routes/auth"));
app.use(require("./routes/dashboard"));
app.use(require("./routes/cortes"));
app.use(require("./routes/clientes"));
app.use(require("./routes/relatorios"));
app.use(require("./routes/configuracoes"));

app.listen(PORT, () => console.log(`MGF Barbearia disponível em http://localhost:${PORT}`));
