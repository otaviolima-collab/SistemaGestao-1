const ItemDAO = require('../models/ItemDAO');

class ItemController {

  // GET /api/itens
  listar(req, res) {
    try {
      const itens = ItemDAO.listarTodos();
      res.json(itens);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao listar itens' });
    }
  }

  // GET /api/itens/:id
  buscar(req, res) {
    try {
      const item = ItemDAO.buscarPorId(req.params.id);
      if (!item) {
        return res.status(404).json({ erro: 'Item não encontrado' });
      }
      res.json(item);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao buscar item' });
    }
  }

  // POST /api/itens
  criar(req, res) {
    try {
      const { nome, categoria, quantidade, descricao, cep, logradouro, bairro, cidade, uf } = req.body;

      // Validação básica no servidor
      if (!nome || !categoria || !quantidade || quantidade < 1) {
        return res.status(400).json({ erro: 'Dados obrigatórios inválidos' });
      }

      const novoItem = ItemDAO.criar({
        nome: nome.trim(),
        categoria,
        quantidade: Number(quantidade),
        descricao: descricao || null,
        cep: cep || null,
        logradouro: logradouro || null,
        bairro: bairro || null,
        cidade: cidade || null,
        uf: uf || null
      });

      res.status(201).json(novoItem);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao cadastrar item' });
    }
  }

  // PUT /api/itens/:id
  atualizar(req, res) {
    try {
      const itemExistente = ItemDAO.buscarPorId(req.params.id);
      if (!itemExistente) {
        return res.status(404).json({ erro: 'Item não encontrado' });
      }

      const { nome, categoria, quantidade, descricao, cep, logradouro, bairro, cidade, uf } = req.body;

      if (!nome || !categoria || !quantidade || quantidade < 1) {
        return res.status(400).json({ erro: 'Dados obrigatórios inválidos' });
      }

      const itemAtualizado = ItemDAO.atualizar(req.params.id, {
        nome: nome.trim(),
        categoria,
        quantidade: Number(quantidade),
        descricao: descricao || null,
        cep: cep || null,
        logradouro: logradouro || null,
        bairro: bairro || null,
        cidade: cidade || null,
        uf: uf || null
      });

      res.json(itemAtualizado);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao atualizar item' });
    }
  }

  // DELETE /api/itens/:id
  excluir(req, res) {
    try {
      const sucesso = ItemDAO.excluir(req.params.id);
      if (!sucesso) {
        return res.status(404).json({ erro: 'Item não encontrado' });
      }
      res.status(204).send();
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao excluir item' });
    }
  }
}

module.exports = new ItemController();
