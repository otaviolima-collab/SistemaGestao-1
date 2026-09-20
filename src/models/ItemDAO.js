const db = require('../config/db');

class ItemDAO {

  // CREATE
  criar(item) {
    const stmt = db.prepare(`
      INSERT INTO itens 
        (nome, categoria, quantidade, descricao, cep, logradouro, bairro, cidade, uf)
      VALUES 
        (@nome, @categoria, @quantidade, @descricao, @cep, @logradouro, @bairro, @cidade, @uf)
    `);
    const info = stmt.run(item);
    return this.buscarPorId(info.lastInsertRowid);
  }

  // READ - todos
  listarTodos() {
    return db.prepare('SELECT * FROM itens ORDER BY id DESC').all();
  }

  // READ - por ID
  buscarPorId(id) {
    return db.prepare('SELECT * FROM itens WHERE id = ?').get(id);
  }

  // UPDATE
  atualizar(id, item) {
    const stmt = db.prepare(`
      UPDATE itens SET
        nome = @nome,
        categoria = @categoria,
        quantidade = @quantidade,
        descricao = @descricao,
        cep = @cep,
        logradouro = @logradouro,
        bairro = @bairro,
        cidade = @cidade,
        uf = @uf
      WHERE id = @id
    `);
    stmt.run({ ...item, id });
    return this.buscarPorId(id);
  }

  // DELETE
  excluir(id) {
    const stmt = db.prepare('DELETE FROM itens WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
}

module.exports = new ItemDAO();