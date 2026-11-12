const express = require("express");
const path = require("path");
const db = require("../database/database");
const verificarLogin = require("../middleware/auth");
const router = express.Router();

router.get("/cortes", verificarLogin, (req, res) => res.sendFile(path.join(__dirname, "../public/cortes.html")));

function validarCorte(body) {
    const cliente = typeof body.cliente === "string" ? body.cliente.trim() : "";
    const corte = typeof body.corte === "string" ? body.corte.trim() : "";
    const pagamento = typeof body.pagamento === "string" ? body.pagamento.trim() : "";
    const valor = Number(String(body.valor ?? "").replace(",", "."));
    const observacao = typeof body.observacao === "string" ? body.observacao.trim() : "";
    if (!cliente || cliente.length > 120 || !corte || corte.length > 80 || !pagamento || pagamento.length > 40 ||
        !Number.isFinite(valor) || valor <= 0 || valor > 100000 || observacao.length > 1000) return null;
    return { cliente, corte, pagamento, valor, observacao };
}

router.post("/novo-corte", verificarLogin, (req, res) => {
    const dados = validarCorte(req.body);
    if (!dados) return res.status(400).json({ sucesso: false, mensagem: "Confira os campos e informe um valor maior que zero." });
    const agora = new Date();
    const data = agora.toLocaleDateString("pt-BR", { timeZone: "America/Manaus" });
    const hora = agora.toLocaleTimeString("pt-BR", { timeZone: "America/Manaus" });
    try {
        db.prepare(`INSERT INTO cortes (cliente, corte, valor, pagamento, observacao, data, hora) VALUES (?, ?, ?, ?, ?, ?, ?)`)
            .run(dados.cliente, dados.corte, dados.valor, dados.pagamento, dados.observacao, data, hora);
        res.status(201).json({ sucesso: true, mensagem: "Corte cadastrado com sucesso." });
    } catch (error) {
        console.error("Erro ao cadastrar corte:", error.message);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar corte." });
    }
});

router.get("/api/cortes", verificarLogin, (req, res) => {
    try { res.json(db.prepare("SELECT * FROM cortes ORDER BY id DESC").all()); }
    catch (error) { console.error("Erro ao buscar cortes:", error.message); res.status(500).json({ sucesso: false, mensagem: "Erro ao buscar cortes." }); }
});

router.put("/api/cortes/:id", verificarLogin, (req, res) => {
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ sucesso: false, mensagem: "ID inválido." });
    const dados = validarCorte(req.body);
    if (!dados) return res.status(400).json({ sucesso: false, mensagem: "Confira os campos e informe um valor maior que zero." });
    try {
        const result = db.prepare("UPDATE cortes SET cliente = ?, corte = ?, valor = ?, pagamento = ?, observacao = ? WHERE id = ?")
            .run(dados.cliente, dados.corte, dados.valor, dados.pagamento, dados.observacao, req.params.id);
        if (!result.changes) return res.status(404).json({ sucesso: false, mensagem: "Corte não encontrado." });
        res.json({ sucesso: true, mensagem: "Corte atualizado com sucesso." });
    } catch (error) { console.error("Erro ao editar corte:", error.message); res.status(500).json({ sucesso: false, mensagem: "Erro ao editar corte." }); }
});

router.delete("/api/cortes/:id", verificarLogin, (req, res) => {
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ sucesso: false, mensagem: "ID inválido." });
    try {
        const result = db.prepare("DELETE FROM cortes WHERE id = ?").run(req.params.id);
        if (!result.changes) return res.status(404).json({ sucesso: false, mensagem: "Corte não encontrado." });
        res.json({ sucesso: true, mensagem: "Corte excluído com sucesso." });
    } catch (error) { console.error("Erro ao excluir corte:", error.message); res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir corte." }); }
});

module.exports = router;
