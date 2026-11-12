const crypto = require("crypto");
const db = require("../database/database");

const senha = process.env.ADMIN_PASSWORD;
if (!senha || senha.length < 12) {
    console.error("Defina ADMIN_PASSWORD com pelo menos 12 caracteres antes de executar.");
    process.exitCode = 1;
} else {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(senha, salt, 64).toString("hex");
    db.prepare("UPDATE usuarios SET senha = ? WHERE usuario = 'admin'").run(`scrypt$${salt}$${hash}`);
    console.log("Senha do administrador atualizada.");
}
db.close();
