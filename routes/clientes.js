const express=require("express");

const router=express.Router();

const path=require("path");

const db=require("../database/database");

const verificarLogin=require("../middleware/auth");

// Página

router.get("/clientes",verificarLogin,(req,res)=>{

    res.sendFile(path.join(__dirname,"../public/clientes.html"));

});

// Novo cliente

router.post("/cliente", verificarLogin, (req, res) => {
    const nome = typeof req.body.nome === "string" ? req.body.nome.trim() : "";
    const telefone = typeof req.body.telefone === "string" ? req.body.telefone.trim() : "";
    if (!nome || nome.length > 120 || telefone.length > 30) {
        return res.status(400).json({ sucesso: false, mensagem: "Informe um nome válido e telefone de até 30 caracteres." });
    }
    try {
        db.prepare("INSERT INTO clientes (nome, telefone) VALUES (?, ?)").run(nome, telefone);
        res.status(201).json({ sucesso: true });
    } catch (error) {
        console.error("Erro ao cadastrar cliente:", error.message);
        res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar cliente." });
    }
});

// Lista clientes

router.get("/api/clientes",verificarLogin,(req,res)=>{

    const clientes=db.prepare(`
        SELECT clientes.id, clientes.nome, clientes.telefone,
            (SELECT MAX(id) FROM cortes WHERE cortes.cliente = clientes.nome) AS ultimo_id,
            (SELECT data FROM cortes WHERE cortes.cliente = clientes.nome ORDER BY id DESC LIMIT 1) AS ultimo_corte,
            (SELECT COALESCE(SUM(valor), 0) FROM cortes WHERE cortes.cliente = clientes.nome) AS total_gasto
        FROM clientes
        ORDER BY clientes.nome COLLATE NOCASE
    `).all();

    res.json(clientes);

});

module.exports=router;
