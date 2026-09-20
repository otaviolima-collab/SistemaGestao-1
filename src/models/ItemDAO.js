const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/itens.json');

// Garante que a pasta e o arquivo existam
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
  const conteudo = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(conteudo);
}

function salvarDados(dados) {
  fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2), 'utf8');
}

class ItemDAO {

  listarTodos() {
    return lerDados();
  }

  buscarPorId(id) {
    const itens = lerDados();
    return itens.find(item => item.id === Number(id)) || null;
  }

  criar(item) {
    const itens = lerDados();
    const novoId = itens.length > 0 ? Math.max(...itens.map(i => i.id)) + 1 : 1;

    const novoItem = {
      id: novoId,
      nome: item.nome,
      categoria: item.categoria,
      quantidade: item.quantidade,
      descricao: item.descricao || null,
      cep: item.cep || null,
      logradouro: item.logradouro || null,
      bairro: item.bairro || null,
      cidade: item.cidade || null,
      uf: item.uf || null,
      criado_em: new Date().toISOString()
    };

    itens.push(novoItem);
    salvarDados(itens);
    return novoItem;
  }

  atualizar(id, item) {
    const itens = lerDados();
    const index = itens.findIndex(i => i.id === Number(id));

    if (index === -1) return null;

    itens[index] = {
      ...itens[index],
      nome: item.nome,
      categoria: item.categoria,
      quantidade: item.quantidade,
      descricao: item.descricao || null,
      cep: item.cep || null,
      logradouro: item.logradouro || null,
      bairro: item.bairro || null,
      cidade: item.cidade || null,
      uf: item.uf || null
    };

    salvarDados(itens);
    return itens[index];
  }

  excluir(id) {
    const itens = lerDados();
    const novosItens = itens.filter(i => i.id !== Number(id));

    if (novosItens.length === itens.length) {
      return false; // não encontrou
    }

    salvarDados(novosItens);
    return true;
  }
}

module.exports = new ItemDAO();