const API = 'http://localhost:3000/api/itens';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastro');
    const itemId = document.getElementById('item-id');
    const btnSalvar = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const btnLimpar = document.getElementById('btn-limpar');
    const mensagemFeedback = document.getElementById('mensagem-feedback');
    const tabelaCorpo = document.getElementById('tabela-corpo');

    // Campos
    const campos = {
        nome: document.getElementById('nome'),
        categoria: document.getElementById('categoria'),
        quantidade: document.getElementById('quantidade'),
        descricao: document.getElementById('descricao'),
        cep: document.getElementById('cep'),
        logradouro: document.getElementById('logradouro'),
        bairro: document.getElementById('bairro'),
        cidade: document.getElementById('cidade'),
        uf: document.getElementById('uf')
    };

    // ===== Feedback =====
    function mostrarFeedback(texto, tipo = 'info') {
        mensagemFeedback.textContent = texto;
        mensagemFeedback.className = `mensagem-feedback ${tipo}`;
    }
    function limparFeedback() {
        mensagemFeedback.className = 'mensagem-feedback';
        mensagemFeedback.textContent = '';
    }

    // ===== Validação =====
    function validar() {
        let ok = true;
        const nome = campos.nome.value.trim();
        const categoria = campos.categoria.value;
        const qtd = Number(campos.quantidade.value);
        const cep = campos.cep.value.replace(/\D/g, '');

        // Nome
        if (nome.length < 3) {
            document.getElementById('erro-nome').classList.add('visivel');
            campos.nome.classList.add('invalido');
            ok = false;
        } else {
            document.getElementById('erro-nome').classList.remove('visivel');
            campos.nome.classList.remove('invalido');
        }

        // Categoria
        if (!categoria) {
            document.getElementById('erro-categoria').classList.add('visivel');
            campos.categoria.classList.add('invalido');
            ok = false;
        } else {
            document.getElementById('erro-categoria').classList.remove('visivel');
            campos.categoria.classList.remove('invalido');
        }

        // Quantidade
        if (!qtd || qtd < 1) {
            document.getElementById('erro-quantidade').classList.add('visivel');
            campos.quantidade.classList.add('invalido');
            ok = false;
        } else {
            document.getElementById('erro-quantidade').classList.remove('visivel');
            campos.quantidade.classList.remove('invalido');
        }

        // CEP
        if (cep.length !== 8) {
            document.getElementById('erro-cep').classList.add('visivel');
            campos.cep.classList.add('invalido');
            ok = false;
        } else {
            document.getElementById('erro-cep').classList.remove('visivel');
            campos.cep.classList.remove('invalido');
        }

        return ok;
    }

    // ===== Máscara + busca CEP =====
    campos.cep.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
        e.target.value = v;
    });

    campos.cep.addEventListener('blur', async () => {
        const cep = campos.cep.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        mostrarFeedback('Buscando CEP...', 'info');
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await res.json();
            if (dados.erro) {
                mostrarFeedback('CEP não encontrado.', 'erro');
                return;
            }
            campos.logradouro.value = dados.logradouro || '';
            campos.bairro.value = dados.bairro || '';
            campos.cidade.value = dados.localidade || '';
            campos.uf.value = dados.uf || '';
            mostrarFeedback(`Endereço: ${dados.localidade} - ${dados.uf}`, 'sucesso');
        } catch {
            mostrarFeedback('Erro ao buscar CEP.', 'erro');
        }
    });

    // ===== Carregar lista (READ) =====
    async function carregarItens() {
        try {
            const res = await fetch(API);
            const itens = await res.json();

            tabelaCorpo.innerHTML = '';

            if (itens.length === 0) {
                tabelaCorpo.innerHTML = `<tr><td colspan="6" style="text-align:center">Nenhum item cadastrado.</td></tr>`;
                return;
            }

            itens.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.categoria}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.cidade || '-'} / ${item.uf || '-'}</td>
                    <td class="acoes">
                        <button class="botao botao-primario" style="padding:.35rem .7rem;font-size:.85rem" onclick="editarItem(${item.id})">Editar</button>
                        <button class="botao botao-perigo" style="padding:.35rem .7rem;font-size:.85rem" onclick="excluirItem(${item.id})">Excluir</button>
                    </td>
                `;
                tabelaCorpo.appendChild(tr);
            });
        } catch (erro) {
            console.error(erro);
            mostrarFeedback('Erro ao carregar itens do banco.', 'erro');
        }
    }

// ===== CREATE / UPDATE =====
form.addEventListener('submit', async e => {
    e.preventDefault();
    limparFeedback();

    if (!validar()) {
        mostrarFeedback('Corrija os campos destacados.', 'erro');
        return;
    }

    const dados = {
        nome: campos.nome.value.trim(),
        categoria: campos.categoria.value,
        quantidade: Number(campos.quantidade.value),
        descricao: campos.descricao.value.trim() || null,
        cep: campos.cep.value,
        logradouro: campos.logradouro.value,
        bairro: campos.bairro.value,
        cidade: campos.cidade.value,
        uf: campos.uf.value
    };

    const id = itemId.value;
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API}/${id}` : API;

    try {
        btnSalvar.disabled = true;

        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        // Tenta ler a resposta mesmo se der erro
        let resposta;
        try {
            resposta = await res.json();
        } catch {
            resposta = { erro: 'Resposta inválida do servidor' };
        }

        if (!res.ok) {
            // Mostra a mensagem real do servidor
            throw new Error(resposta.erro || `Erro HTTP ${res.status}`);
        }

        mostrarFeedback(id ? 'Item atualizado com sucesso!' : 'Item cadastrado com sucesso!', 'sucesso');
        form.reset();
        itemId.value = '';
        btnSalvar.textContent = 'Cadastrar';
        btnCancelar.style.display = 'none';
        carregarItens();

    } catch (erro) {
        console.error('Erro completo:', erro);
        mostrarFeedback(erro.message, 'erro');   // agora mostra a mensagem real
    } finally {
        btnSalvar.disabled = false;
    }
});
    // ===== EDITAR (preenche o formulário) =====
    window.editarItem = async function(id) {
        try {
            const res = await fetch(`${API}/${id}`);
            const item = await res.json();

            itemId.value = item.id;
            campos.nome.value = item.nome;
            campos.categoria.value = item.categoria;
            campos.quantidade.value = item.quantidade;
            campos.descricao.value = item.descricao || '';
            campos.cep.value = item.cep || '';
            campos.logradouro.value = item.logradouro || '';
            campos.bairro.value = item.bairro || '';
            campos.cidade.value = item.cidade || '';
            campos.uf.value = item.uf || '';

            btnSalvar.textContent = 'Atualizar';
            btnCancelar.style.display = 'inline-block';
            document.getElementById('cadastro').scrollIntoView({ behavior: 'smooth' });
        } catch {
            mostrarFeedback('Erro ao carregar item para edição.', 'erro');
        }
    };

    // ===== EXCLUIR =====
    window.excluirItem = async function(id) {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        try {
            const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
            if (res.status === 204 || res.ok) {
                mostrarFeedback('Item excluído com sucesso!', 'sucesso');
                carregarItens();
            } else {
                throw new Error('Falha ao excluir');
            }
        } catch {
            mostrarFeedback('Erro ao excluir item.', 'erro');
        }
    };

    // ===== Cancelar edição =====
    btnCancelar.addEventListener('click', () => {
        form.reset();
        itemId.value = '';
        btnSalvar.textContent = 'Cadastrar';
        btnCancelar.style.display = 'none';
        limparFeedback();
    });

    // ===== Limpar =====
    btnLimpar.addEventListener('click', () => {
        itemId.value = '';
        btnSalvar.textContent = 'Cadastrar';
        btnCancelar.style.display = 'none';
        limparFeedback();
    });

    // Carrega a lista ao abrir a página
    carregarItens();
});