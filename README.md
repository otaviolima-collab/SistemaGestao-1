# Sistema de Gestão – CRUD Completo

Aplicação web full-stack para cadastro, listagem, edição e exclusão de itens, desenvolvida como **Atividade 4**.

O sistema integra:
- Front-end semântico e responsivo (HTML + CSS + JavaScript)
- Validação de formulário no lado do cliente
- Busca automática de endereço por CEP (ViaCEP)
- Back-end com padrão **MVC + DAO**
- Persistência de dados em arquivo JSON (simulando banco de dados relacional)

---

## Tecnologias Utilizadas

| Camada          | Tecnologia                  |
|-----------------|-----------------------------|
| Front-end       | HTML5, CSS3, JavaScript     |
| Back-end        | Node.js + Express           |
| Persistência    | Arquivo JSON (padrão DAO)   |
| API externa     | ViaCEP                      |

---

## Estrutura do Projeto

```
SistemaGestao/
├── package.json
├── server.js                 # Ponto de entrada do servidor
├── data/
│   └── itens.json            # "Banco de dados"
├── src/
│   ├── models/
│   │   └── ItemDAO.js        # Camada de acesso aos dados (DAO)
│   ├── controllers/
│   │   └── ItemController.js # Regras de negócio / controle
│   └── routes/
│       └── itemRoutes.js     # Rotas da API
└── public/                   # Front-end
    ├── index.html
    └── js/
        └── script.js
```

### Padrão MVC + DAO

- **Model (DAO)** → `ItemDAO.js` – responsável por ler e gravar os dados
- **Controller** → `ItemController.js` – recebe a requisição, valida e chama o DAO
- **View** → `public/index.html` + `script.js` – interface do usuário
- **Routes** → define os endpoints da API

---

## Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)

### Passo a passo

1. Abra o terminal na pasta do projeto

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   npm start
   ```

4. Abra o navegador em:
   ```
   http://localhost:3000
   ```

---

## Funcionalidades (CRUD)

| Operação | Descrição                              | Como usar                          |
|----------|----------------------------------------|------------------------------------|
| **Create** | Cadastrar novo item                   | Preencha o formulário e clique em **Cadastrar** |
| **Read**   | Listar todos os itens                 | A tabela é carregada automaticamente |
| **Update** | Editar um item existente              | Clique em **Editar** na tabela     |
| **Delete** | Excluir um item                       | Clique em **Excluir** na tabela    |

### Recursos extras
- Validação de campos no lado do cliente
- Preenchimento automático de endereço ao digitar o CEP
- Interface responsiva (funciona em celular e desktop)
- Feedback visual de sucesso e erro

---

## Endpoints da API

Base URL: `http://localhost:3000/api/itens`

| Método   | Rota              | Descrição                |
|----------|-------------------|--------------------------|
| `GET`    | `/api/itens`      | Lista todos os itens     |
| `GET`    | `/api/itens/:id`  | Busca um item pelo ID    |
| `POST`   | `/api/itens`      | Cadastra um novo item    |
| `PUT`    | `/api/itens/:id`  | Atualiza um item         |
| `DELETE` | `/api/itens/:id`  | Exclui um item           |

---

## Observações Importantes

- O arquivo `data/itens.json` funciona como banco de dados.  
  Na primeira execução ele é criado automaticamente com uma lista vazia (`[]`).
- Caso o arquivo fique corrompido, basta colocar `[]` dentro dele e salvar.
- A busca de CEP utiliza a API pública do [ViaCEP](https://viacep.com.br/).

---

## Autor

Projeto desenvolvido para a disciplina de Desenvolvimento Web – Atividade 4  
(Front-end + Back-end + Persistência de Dados com padrão MVC/DAO)
