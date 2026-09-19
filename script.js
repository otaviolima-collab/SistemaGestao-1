/**
 * Sistema de Gestão - Atividade 2
 * Validação de formulário + busca assíncrona de CEP (ViaCEP)
 */
document.addEventListener('DOMContentLoaded', () => {
    // ===== Elementos do DOM =====
    const form = document.getElementById('form-cadastro');
    const campoNome = document.getElementById('nome');
    const campoCategoria = document.getElementById('categoria');
    const campoQuantidade = document.getElementById('quantidade');
    const campoCep = document.getElementById('cep');
    const campoLogradouro = document.getElementById('logradouro');
    const campoBairro = document.getElementById('bairro');
    const campoCidade = document.getElementById('cidade');
    const campoUf = document.getElementById('uf');
    const btnCadastrar = document.getElementById('btn-cadastrar');
    const btnLimpar = document.getElementById('btn-limpar');
    const mensagemFeedback = document.getElementById('mensagem-feedback');

    // ===== Funções auxiliares de feedback =====
    function mostrarFeedback(texto, tipo = 'info') {
        mensagemFeedback.textContent = texto;
        mensagemFeedback.className = `mensagem-feedback ${tipo}`;
    }

    function limparFeedback() {
        mensagemFeedback.textContent = '';
        mensagemFeedback.className = 'mensagem-feedback';
    }

    function mostrarErro(campo, mensagemId, mostrar = true) {
        const input = document.getElementById(campo);
        const erro = document.getElementById(mensagemId);

        if (mostrar) {
            input.classList.add('invalido');
            input.classList.remove('valido');
            erro.classList.add('visivel');
        } else {
            input.classList.remove('invalido');
            input.classList.add('valido');
            erro.classList.remove('visivel');
        }
    }

    function limparValidacaoCampo(campoId) {
        const input = document.getElementById(campoId);
        input.classList.remove('invalido', 'valido');
        const erro = document.getElementById(`erro-${campoId}`);
        if (erro) erro.classList.remove('visivel');
    }

    // ===== Validação de campos individuais =====
    function validarNome() {
        const valor = campoNome.value.trim();
        if (valor.length < 3) {
            mostrarErro('nome', 'erro-nome', true);
            return false;
        }
        mostrarErro('nome', 'erro-nome', false);
        return true;
    }

    function validarCategoria() {
        if (!campoCategoria.value) {
            mostrarErro('categoria', 'erro-categoria', true);
            return false;
        }
        mostrarErro('categoria', 'erro-categoria', false);
        return true;
    }

    function validarQuantidade() {
        const valor = Number(campoQuantidade.value);
        if (!valor || valor < 1) {
            mostrarErro('quantidade', 'erro-quantidade', true);
            return false;
        }
        mostrarErro('quantidade', 'erro-quantidade', false);
        return true;
    }

    function validarCep() {
        const cepLimpo = campoCep.value.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            mostrarErro('cep', 'erro-cep', true);
            return false;
        }
        mostrarErro('cep', 'erro-cep', false);
        return true;
    }

    // ===== Máscara de CEP =====
    campoCep.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 5) {
            valor = valor.substring(0, 5) + '-' + valor.substring(5, 8);
        }
        e.target.value = valor;

        // Limpa campos de endereço se o CEP for alterado
        if (valor.replace(/\D/g, '').length < 8) {
            limparCamposEndereco();
        }
    });

    // ===== Busca assíncrona de CEP (ViaCEP) =====
    async function buscarCep(cep) {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) return;

        mostrarFeedback('Buscando endereço...', 'info');
        btnCadastrar.disabled = true;

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if (!resposta.ok) {
                throw new Error('Erro na requisição');
            }

            const dados = await resposta.json();

            if (dados.erro) {
                mostrarFeedback('CEP não encontrado. Verifique o número digitado.', 'erro');
                limparCamposEndereco();
                mostrarErro('cep', 'erro-cep', true);
                return;
            }

            // Preenche os campos automaticamente
            campoLogradouro.value = dados.logradouro || '';
            campoBairro.value = dados.bairro || '';
            campoCidade.value = dados.localidade || '';
            campoUf.value = dados.uf || '';

            mostrarFeedback(`Endereço encontrado: ${dados.localidade} - ${dados.uf}`, 'sucesso');
            mostrarErro('cep', 'erro-cep', false);

        } catch (erro) {
            console.error('Erro ao buscar CEP:', erro);
            mostrarFeedback('Não foi possível buscar o CEP. Verifique sua conexão.', 'erro');
            limparCamposEndereco();
        } finally {
            btnCadastrar.disabled = false;
        }
    }

    function limparCamposEndereco() {
        campoLogradouro.value = '';
        campoBairro.value = '';
        campoCidade.value = '';
        campoUf.value = '';
    }

    // Dispara a busca quando o usuário sai do campo CEP
    campoCep.addEventListener('blur', () => {
        const cepLimpo = campoCep.value.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            buscarCep(cepLimpo);
        }
    });

    // Também permite buscar ao pressionar Enter no CEP
    campoCep.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cepLimpo = campoCep.value.replace(/\D/g, '');
            if (cepLimpo.length === 8) {
                buscarCep(cepLimpo);
            }
        }
    });

    // ===== Validação em tempo real (blur) =====
    campoNome.addEventListener('blur', validarNome);
    campoCategoria.addEventListener('change', validarCategoria);
    campoQuantidade.addEventListener('blur', validarQuantidade);

    // ===== Validação completa no submit =====
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio tradicional

        limparFeedback();

        const nomeOk = validarNome();
        const categoriaOk = validarCategoria();
        const quantidadeOk = validarQuantidade();
        const cepOk = validarCep();

        // Verifica se o endereço foi preenchido (busca realizada)
        const enderecoPreenchido = campoCidade.value.trim() !== '';

        if (!nomeOk || !categoriaOk || !quantidadeOk || !cepOk) {
            mostrarFeedback('Corrija os campos destacados antes de continuar.', 'erro');
            return;
        }

        if (!enderecoPreenchido) {
            mostrarFeedback('Informe um CEP válido para preencher o endereço automaticamente.', 'erro');
            mostrarErro('cep', 'erro-cep', true);
            return;
        }

        // Simulação de cadastro bem-sucedido
        mostrarFeedback(
            `Item "${campoNome.value}" cadastrado com sucesso em ${campoCidade.value}-${campoUf.value}!`,
            'sucesso'
        );

        // Opcional: limpar o formulário após 2 segundos
        setTimeout(() => {
            form.reset();
            limparCamposEndereco();
            limparValidacaoCampo('nome');
            limparValidacaoCampo('categoria');
            limparValidacaoCampo('quantidade');
            limparValidacaoCampo('cep');
            limparFeedback();
        }, 2500);
    });

    // ===== Botão Limpar =====
    btnLimpar.addEventListener('click', () => {
        limparCamposEndereco();
        limparFeedback();
        limparValidacaoCampo('nome');
        limparValidacaoCampo('categoria');
        limparValidacaoCampo('quantidade');
        limparValidacaoCampo('cep');
    });
});