const express = require("express");
const path = require("path");
const crypto = require("crypto");
const db = require("../database/database");
const verificarLogin = require("../middleware/auth");
const router = express.Router();

router.get("/configuracoes", verificarLogin, (req, res) => res.sendFile(path.join(__dirname, "../public/configuracoes.html")));

router.put("/api/admin/senha", verificarLogin, (req, res, next) => {
    const { senhaAtual, novaSenha } = req.body;
    if (typeof senhaAtual !== "string" || typeof novaSenha !== "string" || novaSenha.length < 12 || novaSenha.length > 200) {
        return res.status(400).json({ sucesso: false, mensagem: "A nova senha deve ter entre 12 e 200 caracteres." });
    }
    const admin = db.prepare("SELECT senha FROM usuarios WHERE usuario = 'admin'").get();
    if (!admin) return res.status(404).json({ sucesso: false, mensagem: "Conta admin não encontrada." });
    const [, salt, hashSalvo] = admin.senha.split("$");
    const hashAtual = crypto.scryptSync(senhaAtual, salt, 64);
    if (!hashSalvo || !/^[a-f0-9]{128}$/i.test(hashSalvo) || !crypto.timingSafeEqual(hashAtual, Buffer.from(hashSalvo, "hex"))) {
        return res.status(401).json({ sucesso: false, mensagem: "Senha atual incorreta." });
    }
    const novoSalt = crypto.randomBytes(16).toString("hex");
    const novoHash = crypto.scryptSync(novaSenha, novoSalt, 64).toString("hex");
    db.prepare("UPDATE usuarios SET senha = ? WHERE usuario = 'admin'").run(`scrypt$${novoSalt}$${novoHash}`);
    req.session.regenerate((error) => {
        if (error) return next(error);
        req.session.usuario = "admin";
        req.session.save((saveError) => {
            if (saveError) return next(saveError);
            res.json({ sucesso: true, mensagem: "Senha atualizada com sucesso." });
        });
    });
});

module.exports = router;
