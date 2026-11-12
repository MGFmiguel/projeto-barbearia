const path = require("path");
const Database = require("better-sqlite3");

const db = new Database(path.join(__dirname, "database.db"));
db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT,
        email TEXT
    );
    CREATE TABLE IF NOT EXISTS cortes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente TEXT NOT NULL,
        corte TEXT NOT NULL,
        valor REAL NOT NULL,
        pagamento TEXT NOT NULL,
        observacao TEXT,
        data TEXT NOT NULL,
        hora TEXT NOT NULL
    );
`);

// Mantém uma única conta de acesso: o administrador.
const admin = db.prepare("SELECT id, senha FROM usuarios WHERE usuario = 'admin'").get();
if (!admin) {
    const senha = process.env.ADMIN_PASSWORD;
    if (!senha || senha.length < 12) {
        throw new Error("Defina ADMIN_PASSWORD com pelo menos 12 caracteres para criar a conta admin.");
    }
    const salt = require("crypto").randomBytes(16).toString("hex");
    const hash = require("crypto").scryptSync(senha, salt, 64).toString("hex");
    db.prepare("INSERT INTO usuarios (usuario, senha) VALUES ('admin', ?)").run(`scrypt$${salt}$${hash}`);
} else if (!admin.senha.startsWith("scrypt$")) {
    // Converte a senha antiga em texto puro para hash durante a atualização.
    const salt = require("crypto").randomBytes(16).toString("hex");
    const hash = require("crypto").scryptSync(admin.senha, salt, 64).toString("hex");
    db.prepare("UPDATE usuarios SET senha = ? WHERE id = ?").run(`scrypt$${salt}$${hash}`, admin.id);
}

module.exports = db;
