const express = require("express");
const path = require("path");
const crypto = require("crypto");
const router = express.Router();
const db = require("../database/database");

router.get("/", (req, res) => {
    if (req.session.usuario === "admin") return res.redirect("/dashboard");
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

router.post("/login", (req, res, next) => {
    const usuario = typeof req.body.usuario === "string" ? req.body.usuario.trim() : "";
    const senha = typeof req.body.senha === "string" ? req.body.senha : "";
    if (!usuario || !senha || usuario !== "admin") {
        return res.status(401).json({ sucesso: false, mensagem: "Usuário ou senha inválidos." });
    }

    const admin = db.prepare("SELECT senha FROM usuarios WHERE usuario = 'admin'").get();
    if (!admin) return res.status(401).json({ sucesso: false, mensagem: "Usuário ou senha inválidos." });

    const [, salt, storedHash] = admin.senha.split("$");
    const suppliedHash = crypto.scryptSync(senha, salt, 64);
    const valid = storedHash && /^[a-f0-9]{128}$/i.test(storedHash) &&
        crypto.timingSafeEqual(suppliedHash, Buffer.from(storedHash, "hex"));
    if (!valid) return res.status(401).json({ sucesso: false, mensagem: "Usuário ou senha inválidos." });

    req.session.regenerate((error) => {
        if (error) return next(error);
        req.session.usuario = "admin";
        req.session.save((saveError) => {
            if (saveError) return next(saveError);
            res.json({ sucesso: true, mensagem: "Login realizado com sucesso." });
        });
    });
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("mgf.sid");
        res.redirect("/");
    });
});
// Mantém compatibilidade com o link antigo da navegação.
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("mgf.sid");
        res.redirect("/");
    });
});

module.exports = router;
