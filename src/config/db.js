const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Caminho do banco
const dbDir = path.join(__dirname, '../../database');
const dbPath = path.join(dbDir, 'database.db');

// Cria a pasta database se ela não existir
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('Pasta database/ criada automaticamente.');
}

// Conecta / cria o arquivo do banco
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

console.log('Banco de dados conectado com sucesso!');
console.log('Arquivo:', dbPath);

module.exports = db;