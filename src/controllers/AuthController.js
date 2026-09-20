const UsuarioDAO = require('../models/UsuarioDAO');

class AuthController {

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      const usuario = await UsuarioDAO.verificarSenha(email, senha);

      if (!usuario) {
        return res.status(401).json({ erro: 'Email ou senha incorretos' });
      }

      req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      };

      res.json({
        mensagem: 'Login realizado com sucesso',
        usuario: req.session.usuario
      });

    } catch (erro) {
      console.error('Erro no login:', erro);
      res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  }

  logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao fazer logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ mensagem: 'Logout realizado com sucesso' });
    });
  }

  me(req, res) {
    if (req.session && req.session.usuario) {
      return res.json({ autenticado: true, usuario: req.session.usuario });
    }
    res.status(401).json({ autenticado: false });
  }
}

module.exports = new AuthController();