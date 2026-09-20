const express = require('express');
const cors = require('cors');
const path = require('path');
const itemRoutes = require('./src/routes/itemRoutes');

// Garante que o banco e a tabela existam ao iniciar
require('./src/config/db');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/itens', itemRoutes);

// Rota principal (serve o front-end)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('CRUD disponível em /api/itens');
});