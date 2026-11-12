const express = require("express");
const path = require("path");
const db = require("../database/database");
const verificarLogin = require("../middleware/auth");
const router = express.Router();

router.get("/relatorios", verificarLogin, (req, res) => res.sendFile(path.join(__dirname, "../public/relatorios.html")));

router.get("/api/relatorios", verificarLogin, (req, res) => {
    const { inicio, fim } = req.query;
    const formato = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof inicio !== "string" || typeof fim !== "string" || !formato.test(inicio) || !formato.test(fim) || inicio > fim) {
        return res.status(400).json({ sucesso: false, mensagem: "Informe um período válido." });
    }
    const query = `
        SELECT id, cliente, corte, valor, pagamento, observacao, data, hora
        FROM cortes
        WHERE substr(data, 7, 4) || '-' || substr(data, 4, 2) || '-' || substr(data, 1, 2) BETWEEN ? AND ?
        ORDER BY id DESC`;
    const registros = db.prepare(query).all(inicio, fim);
    const resumo = registros.reduce((acumulado, item) => {
        acumulado.faturamento += item.valor;
        acumulado.quantidade += 1;
        return acumulado;
    }, { faturamento: 0, quantidade: 0 });
    resumo.ticketMedio = resumo.quantidade ? resumo.faturamento / resumo.quantidade : 0;
    res.json({ sucesso: true, resumo, registros });
});

module.exports = router;
