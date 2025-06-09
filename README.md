# 🏎️ F1 Data Explorer

Um sistema completo para exploração e análise de dados da Fórmula 1, desenvolvido como projeto acadêmico da disciplina SCC0541 - Laboratório de Bases de Dados da USP.

## 📖 Sobre o Projeto

O F1 Data Explorer é uma aplicação web que permite visualizar e analisar dados históricos da Fórmula 1, incluindo informações sobre pilotos, equipes, corridas, circuitos e resultados. O projeto utiliza uma arquitetura moderna com:

- **Backend**: PostgreSQL + PostgREST para API REST automática
- **Frontend**: React + TypeScript + Vite
- **Administração**: pgAdmin para gerenciamento do banco
- **Containerização**: Docker Compose para orquestração dos serviços

## 🚀 Setup Inicial

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js (versão especificada no arquivo `.nvmrc`)

### 1. Configuração do Banco de Dados

Clone o repositório e execute os containers:

```bash
# Clone o repositório
git clone https://github.com/FelipeCorerato/SCC0541.git
cd SCC0541

# Subir os serviços (PostgreSQL, pgAdmin e PostgREST)
docker-compose up -d
```

Isso irá criar:
- **PostgreSQL**: Banco de dados principal na porta `5432`
- **pgAdmin**: Interface web na porta `8081`
- **PostgREST**: API REST na porta `3000`

### 2. Acesso ao pgAdmin

Para gerenciar o banco via pgAdmin:

1. **Abra o pgAdmin**  
   Acesse: http://localhost:8081

2. **Login no pgAdmin**  
   - **Email**: `fcorerato@gmail.com`
   - **Senha**: `Senha123`

3. **Registrar servidor do banco**  
   - Clique com o botão direito em **Servers** → **Register → Server...**
   
   **Aba Geral:**
   - **Name**: `f1-data-explorer`
   
   **Aba Conexão:**
   | Campo                   | Valor                    |
   |-------------------------|--------------------------|
   | Host name/address       | `db`                     |
   | Port                    | `5432`                   |
   | Maintenance database    | `f1-data-explorer`       |
   | Username                | `postgres`               |
   | Password                | `123456789`              |

4. **Salvar**: Clique em **Save** para conectar

## 🔌 PostgREST - API REST Automática

O projeto utiliza PostgREST para gerar automaticamente uma API REST baseada no esquema do banco PostgreSQL. 

### Características do PostgREST:
- **API automática**: Cada tabela vira um endpoint REST
- **Consultas flexíveis**: Suporte a filtros, ordenação e paginação
- **Performance**: Consultas diretas ao banco sem overhead
- **Documentação**: Auto-documentação baseada no esquema

### Endpoints Disponíveis:
Todas as consultas e dados estão disponíveis através da rota `/db` na porta 3000:

```
Base URL: http://localhost:3000
```

Exemplos de uso:
```bash
# Listar todas as tabelas/endpoints
GET http://localhost:3000/

# Consultar pilotos
GET http://localhost:3000/drivers

# Consultar corridas com filtros
GET http://localhost:3000/races?year=eq.2023

# Consultar resultados com join
GET http://localhost:3000/results?select=*,drivers(*)
```

## 🎨 Frontend - Setup e Execução

### Instalação das Dependências

```bash
# Instalar dependências do projeto
npm install
```

### Scripts Disponíveis

```bash
# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Lint do código
npm run lint

# Preview da build de produção
npm run preview
```

### Desenvolvimento

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação**:
   - Frontend: http://localhost:5173 (porta padrão do Vite)
   - API (PostgREST): http://localhost:3000
   - pgAdmin: http://localhost:8081

### Tecnologias do Frontend

- **React 19**: Biblioteca para interface
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **React Router Dom**: Roteamento
- **Axios**: Cliente HTTP
- **React Icons**: Ícones
- **React Toastify**: Notificações

## 📁 Estrutura do Projeto

```
.
├── src/                    # Código fonte do frontend
├── db/                     # Scripts SQL e configurações do banco
├── init-scripts/           # Scripts de inicialização
├── public/                 # Arquivos estáticos
├── docker-compose.yml      # Orquestração dos serviços
├── package.json           # Dependências e scripts do frontend
└── README.md              # Este arquivo
```

## 📊 Dados e Queries

Todos os scripts SQL estão localizados no diretório `/db`:

- `db_origin_ingest.sql`: Script principal de criação e população do banco
- `users_ingest.sql`: Dados de usuários
- `create_reports.sql`: Relatórios e views personalizadas
- `backup.sql`: Backup completo dos dados

## 🤝 Contribuição

Este é um projeto acadêmico. Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📋 Requisitos do Sistema

- Docker Engine 20.0+
- Docker Compose 2.0+
- Node.js 18+ (conforme `.nvmrc`)
- npm 8+

---

Desenvolvido para a disciplina **SCC0541 - Laboratório de Bases de Dados** da Universidade de São Paulo (USP) - ICMC.
