const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const itemRoutes = require('./src/routes/itemRoutes');
const authRoutes = require('./src/routes/authRoutes');
const { autenticado } = require('./src/middlewares/authMiddleware');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'chave-secreta-sistema-gestao-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas (só quem está logado)
app.use('/api/itens', autenticado, itemRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});