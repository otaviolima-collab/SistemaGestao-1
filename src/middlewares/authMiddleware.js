function autenticado(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  return res.status(401).json({ erro: 'Não autorizado. Faça login.' });
}

function apenasAdmin(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.perfil === 'admin') {
    return next();
  }
  return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
}

module.exports = { autenticado, apenasAdmin };