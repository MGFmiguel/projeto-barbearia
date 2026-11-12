const express = require("express");
const router = express.Router();
const path = require("path");

const db = require("../database/database");
const verificarLogin = require("../middleware/auth");

// ===============================
// DASHBOARD
// ===============================

router.get("/dashboard", verificarLogin, (req, res) => {

    res.sendFile(
        path.join(__dirname, "../public/dashboard.html")
    );

});

// ===============================
// API DASHBOARD
// ===============================

router.get("/api/dashboard", verificarLogin, (req, res) => {

    const hoje = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Manaus" });

    // Faturamento
    const total = db.prepare(`
        SELECT COALESCE(SUM(valor), 0) AS total
        FROM cortes
        WHERE data = ?
    `).get(hoje);

    // Quantidade
    const quantidade = db.prepare(`
        SELECT COUNT(*) AS quantidade
        FROM cortes
        WHERE data = ?
    `).get(hoje);

    // Últimos cortes
    const ultimosCortes = db.prepare(`
        SELECT cliente, corte, valor, pagamento, data, hora, observacao
        FROM cortes
        ORDER BY id DESC
        LIMIT 5
    `).all();

    // Ticket médio
    const ticket =
        quantidade.quantidade === 0
            ? 0
            : total.total / quantidade.quantidade;

    res.json({

        faturamento: total.total,

        cortes: quantidade.quantidade,

        ticket: ticket,

        data: hoje,

        ultimosCortes: ultimosCortes

    });

});

module.exports = router;