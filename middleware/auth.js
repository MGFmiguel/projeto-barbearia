function verificarLogin(req, res, next) {
    if (req.session.usuario === "admin") return next();
    if (req.path.startsWith("/api/") || req.accepts("json")) {
        return res.status(401).json({ sucesso: false, mensagem: "Faça login para continuar." });
    }
    return res.redirect("/");
}

module.exports = verificarLogin;
