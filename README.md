# 💈 Barber Shop

Aplicação web fullstack para agendamento de serviços em barbearias, com autenticação via Google, listagem de barbearias, reserva de horários e sistema de avaliações.

## 🚀 Tecnologias

- **[Next.js 16](https://nextjs.org/)** — Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática
- **[Prisma](https://www.prisma.io/)** — ORM para banco de dados
- **[PostgreSQL](https://www.postgresql.org/)** — Banco de dados relacional (via Supabase)
- **[NextAuth.js](https://next-auth.js.org/)** — Autenticação com Google OAuth
- **[Tailwind CSS](https://tailwindcss.com/)** — Estilização utilitária
- **[shadcn/ui](https://ui.shadcn.com/)** — Componentes de UI
- **[Vercel](https://vercel.com/)** — Deploy e hospedagem

## ✨ Funcionalidades

- Autenticação com conta Google
- Listagem e busca de barbearias
- Visualização de serviços por barbearia
- Agendamento de horários
- Cancelamento de agendamentos
- Sistema de avaliações com média por barbearia
- Menu lateral com histórico de agendamentos

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── (home)/          # Página inicial com busca e listagem
│   ├── _action/         # Server actions (cancelamento, avaliação)
│   ├── _components/     # Componentes globais (header, footer, etc.)
│   ├── _lib/            # Configurações de auth e Prisma
│   ├── _providers/      # Providers de contexto
│   ├── api/             # Rotas de API (NextAuth)
│   ├── barbershops/     # Páginas de barbearias e agendamento
│   └── bookings/        # Página de agendamentos do usuário
├── components/ui/       # Componentes shadcn/ui
└── lib/                 # Utilitários
prisma/
├── migrations/          # Histórico de migrations
├── schema.prisma        # Schema do banco de dados
└── seed.ts              # Script de seed
```

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL (ou conta no [Supabase](https://supabase.com))
- Conta no [Google Cloud Console](https://console.cloud.google.com) para OAuth

### 1. Clone o repositório

```bash
git clone https://github.com/JoaoFabris/barber-shop.git
cd barber-shop
```

### 2. Instale as dependências

```bash
npm install --legacy-peer-deps
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase - Transaction pooler (porta 6543)
DATABASE_URL="postgresql://postgres.xxxx:SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Supabase - Session pooler (para migrations)
DIRECT_URL="postgresql://postgres.xxxx:SENHA@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# NextAuth
NEXT_AUTH_SECRET="gere com: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="seu_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu_client_secret"
```

### 4. Execute as migrations e o seed

```bash
npx prisma migrate deploy
npx prisma db seed
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## 🗄️ Banco de Dados

O projeto usa **Supabase** como provedor PostgreSQL. As migrations estão em `prisma/migrations/` e cobrem:

- Tabelas iniciais (barbearias, serviços)
- URL de imagem para serviços
- Tabelas de usuário e autenticação
- Correções do NextAuth
- Status de agendamentos
- Sistema de avaliações e médias

## 🔐 Autenticação

A autenticação é feita via **Google OAuth** com NextAuth.js. Para configurar:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto e vá em **APIs & Services → Credentials**
3. Crie um **OAuth 2.0 Client ID** do tipo "Web application"
4. Adicione `http://localhost:3000/api/auth/callback/google` como URI de redirecionamento autorizado
5. Copie o Client ID e Client Secret para o `.env`

## 🚢 Deploy

O projeto está configurado para deploy na **Vercel**. Configure as variáveis de ambiente em **Settings → Environment Variables** com os mesmos valores do `.env` local.

```bash
# Build de produção
npm run build
```

## 📜 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia em modo produção |
| `npm run lint` | Verifica erros de lint |
| `npx prisma studio` | Interface visual do banco |
| `npx prisma db seed` | Popula o banco com dados iniciais |