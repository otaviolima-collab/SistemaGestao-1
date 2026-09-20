const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../data/usuarios.json');

function garantirBanco() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '[]', 'utf8');
  }
}

function lerDados() {
  garantirBanco();
  try {
    const conteudo = fs.readFileSync(DB_PATH, 'utf8').trim();
    if (!conteudo) return [];
    return JSON.parse(conteudo);
  } catch (erro) {
    console.error('Erro ao ler usuarios.json, reiniciando...', erro.message);
    fs.writeFileSync(DB_PATH, '[]', 'utf8');
    return [];
  }
}

function salvarDados(dados) {
  fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2), 'utf8');
}

class UsuarioDAO {

  listarTodos() {
    return lerDados().map(u => {
      const { senha, ...usuarioSemSenha } = u;
      return usuarioSemSenha;
    });
  }

  buscarPorEmail(email) {
    const usuarios = lerDados();
    return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  buscarPorId(id) {
    const usuarios = lerDados();
    return usuarios.find(u => u.id === Number(id)) || null;
  }

  async criar(usuario) {
    const usuarios = lerDados();
    const novoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

    const senhaHash = await bcrypt.hash(usuario.senha, 10);

    const novoUsuario = {
      id: novoId,
      nome: usuario.nome,
      email: usuario.email.toLowerCase(),
      senha: senhaHash,
      perfil: usuario.perfil || 'usuario'
    };

    usuarios.push(novoUsuario);
    salvarDados(usuarios);

    const { senha, ...usuarioSemSenha } = novoUsuario;
    return usuarioSemSenha;
  }

  async verificarSenha(email, senhaDigitada) {
    const usuario = this.buscarPorEmail(email);
    if (!usuario) return null;

    const senhaCorreta = await bcrypt.compare(senhaDigitada, usuario.senha);
    if (!senhaCorreta) return null;

    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }
}

module.exports = new UsuarioDAO();