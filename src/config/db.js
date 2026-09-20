const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/database.db');
const db = new Database(dbPath);

// Cria a tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS itens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    quantidade INTEGER NOT NULL CHECK(quantidade >= 1),
    descricao TEXT,
    cep TEXT,
    logradouro TEXT,
    bairro TEXT,
    cidade TEXT,
    uf TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Banco de dados conectado e tabela verificada.');

module.exports = db;