# 🏛️ ARCHITECTURE.md — Como o Projeto Funciona

> Este arquivo explica toda a arquitetura do app Noivos.
> Leia antes de adicionar qualquer nova página, funcionalidade ou módulo.

---

## 🎯 Visão Geral

O **Noivos** é uma aplicação fullstack com suporte a **web (browser)** e **mobile**.
Dois usuários (os noivos) compartilham o mesmo espaço de planejamento com **sincronização em tempo real**.

```
┌─────────────────────────────────────────────────┐
│                   USUÁRIOS                       │
│         Noivo 1 📱        Noiva 2 💻            │
└──────────────┬──────────────────┬───────────────┘
               │                  │
    ┌──────────▼──────┐  ┌───────▼──────────┐
    │  Mobile (RN)    │  │   Web (Next.js)  │
    │  React Native   │  │   App Router     │
    └──────────┬──────┘  └───────┬──────────┘
               │                  │
               └────────┬─────────┘
                        │
              ┌─────────▼──────────┐
              │   Shared Layer     │
              │  hooks / services  │
              │  store / types     │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │     SUPABASE       │
              │  Auth | DB | RT    │
              │  Storage | Edge    │
              └────────────────────┘
```

---

## 📁 Organização das Pastas

```
noivos/
├── app/                          # Next.js App Router (WEB)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── cadastro/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── inicio/page.tsx
│   │   ├── convidados/page.tsx
│   │   ├── padrinhos/page.tsx
│   │   ├── tarefas/page.tsx
│   │   ├── fornecedores/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── webhooks/
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── mobile/                       # React Native (MOBILE)
│   ├── screens/
│   │   ├── AuthScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── GuestsScreen.tsx
│   │   ├── GroomsmenScreen.tsx
│   │   └── TasksScreen.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   └── components/               # Componentes exclusivos mobile
│
├── shared/                       # Compartilhado web + mobile
│   ├── components/
│   │   ├── ui/                   # Componentes base
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   └── Badge/
│   │   └── features/             # Componentes de feature
│   │       ├── GuestCard/
│   │       ├── TaskItem/
│   │       ├── GroomsmanCard/
│   │       └── SyncIndicator/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGuests.ts
│   │   ├── useGroomsmen.ts
│   │   ├── useTasks.ts
│   │   ├── useRealtime.ts
│   │   └── useCouple.ts
│   ├── services/
│   │   ├── supabase.ts           # Client Supabase
│   │   ├── authService.ts
│   │   ├── guestService.ts
│   │   ├── groomsmanService.ts
│   │   └── taskService.ts
│   ├── store/
│   │   ├── authStore.ts          # Estado de autenticação
│   │   ├── coupleStore.ts        # Estado do casal
│   │   └── uiStore.ts            # Estado de UI (modais, loading)
│   └── types/
│       ├── auth.types.ts
│       ├── couple.types.ts
│       ├── guest.types.ts
│       ├── groomsman.types.ts
│       └── task.types.ts
│
├── supabase/
│   ├── migrations/               # SQL — nunca editar manualmente
│   └── functions/                # Edge Functions (serverless)
│
├── public/                       # Assets estáticos (web)
│
├── CLAUDE.md
├── RULES.md
├── ARCHITECTURE.md
├── COMPONENTS.md
├── DESIGN-SYSTEM.md
├── API.md
└── ENV.md
```

---

## 🔄 Fluxo Completo da Aplicação

### 1. Primeiro Acesso — Cadastro do Casal
```
Usuário abre o app
       │
       ▼
Tela de Boas-vindas
       │
       ▼
Cadastro: email + senha + nome
       │
       ▼
Supabase Auth cria o usuário
       │
       ▼
Cria registro na tabela `couples`
(um casal tem 2 slots: partner_1 e partner_2)
       │
       ▼
Convite enviado para o segundo noivo(a)
(email com link de ingresso ao casal)
       │
       ▼
Segundo noivo(a) aceita → vinculado ao mesmo couple_id
       │
       ▼
Ambos entram no Dashboard compartilhado
```

### 2. Fluxo de Autenticação
```
Login com email + senha
       │
       ▼
Supabase Auth valida
       │
  ┌────┴────┐
  │         │
Sucesso   Erro
  │         │
  ▼         ▼
Busca    Exibe
couple   mensagem
do user  de erro
  │
  ▼
Salva no authStore (Zustand)
  │
  ▼
Redireciona para /inicio
```

### 3. Fluxo de Dados em Tempo Real
```
Noivo 1 adiciona convidado
       │
       ▼
Chama guestService.addGuest()
       │
       ▼
INSERT na tabela `guests` do Supabase
       │
       ▼
Supabase Realtime dispara evento
       │
       ▼
Noiva 2 recebe atualização automática
(sem precisar recarregar a página)
       │
       ▼
UI atualizada em tempo real
```

---

## 🌐 Estrutura Frontend (Web — Next.js)

### App Router — Grupos de Rotas

| Grupo | Rota | Descrição | Auth? |
|-------|------|-----------|-------|
| `(auth)` | `/login` | Tela de login | ❌ Pública |
| `(auth)` | `/cadastro` | Criar conta | ❌ Pública |
| `(auth)` | `/convite/[token]` | Aceitar convite do casal | ❌ Pública |
| `(dashboard)` | `/inicio` | Painel geral | ✅ Protegida |
| `(dashboard)` | `/convidados` | Lista de convidados | ✅ Protegida |
| `(dashboard)` | `/padrinhos` | Gestão de padrinhos | ✅ Protegida |
| `(dashboard)` | `/tarefas` | Lista de tarefas | ✅ Protegida |
| `(dashboard)` | `/fornecedores` | Fornecedores | ✅ Protegida |
| `(dashboard)` | `/configuracoes` | Config do casal | ✅ Protegida |

### Proteção de Rotas
```typescript
// middleware.ts — roda em toda requisição
export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')

  if (!token && isProtectedRoute(request.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

---

## 📱 Estrutura Mobile (React Native)

### Navegação

```
AppNavigator
├── AuthNavigator (se não logado)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── MainNavigator (se logado)
    ├── TabNavigator (barra inferior)
    │   ├── HomeScreen (Início)
    │   ├── GuestsScreen (Convidados)
    │   ├── GroomsmenScreen (Padrinhos)
    │   └── TasksScreen (Tarefas)
    │
    └── Modais (sobre qualquer tela)
        ├── AddGuestModal
        ├── AddTaskModal
        └── InvitePartnerModal
```

---

## 🗄️ Estrutura do Banco de Dados (Supabase/PostgreSQL)

```sql
-- Casal
couples
├── id (uuid, PK)
├── partner_1_id (uuid, FK → auth.users)
├── partner_2_id (uuid, FK → auth.users, nullable)
├── data_casamento (date, nullable)
├── wedding_name (text)         -- "Casamento de Thiago e Ana"
├── invite_token (text, unique) -- token para o 2º noivo entrar
├── created_at (timestamp)
└── updated_at (timestamp)

-- Convidados
guests
├── id (uuid, PK)
├── couple_id (uuid, FK → couples)
├── name (text)
├── email (text, nullable)
├── phone (text, nullable)
├── confirmed (boolean, default false)
├── table_number (int, nullable)
├── side (enum: 'bride' | 'groom' | 'both')
├── dietary_restrictions (text, nullable)
├── deleted_at (timestamp, nullable)  -- soft delete
├── created_at (timestamp)
└── updated_at (timestamp)

-- Padrinhos/Madrinhas
groomsmen
├── id (uuid, PK)
├── couple_id (uuid, FK → couples)
├── name (text)
├── role (enum: 'best_man' | 'maid_of_honor' | 'groomsman' | 'bridesmaid')
├── phone (text, nullable)
├── email (text, nullable)
├── suit_color (text, nullable)
├── confirmed (boolean, default false)
├── deleted_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Tarefas
tasks
├── id (uuid, PK)
├── couple_id (uuid, FK → couples)
├── title (text)
├── description (text, nullable)
├── done (boolean, default false)
├── due_date (date, nullable)
├── assigned_to (uuid, FK → auth.users, nullable)
├── category (enum: 'venue' | 'catering' | 'flowers' | 'music' | 'dress' | 'other')
├── deleted_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

-- Fornecedores
vendors
├── id (uuid, PK)
├── couple_id (uuid, FK → couples)
├── name (text)
├── category (enum: 'venue' | 'catering' | 'photography' | 'music' | 'flowers' | 'other')
├── contact_name (text, nullable)
├── phone (text, nullable)
├── email (text, nullable)
├── price (decimal, nullable)
├── status (enum: 'prospect' | 'negotiating' | 'hired' | 'cancelled')
├── notes (text, nullable)
├── deleted_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)
```

### Row Level Security (RLS)
Todas as tabelas têm RLS ativado. Usuário só acessa dados do próprio casal:

```sql
-- Exemplo de policy para guests
CREATE POLICY "Couple members can access their guests"
ON guests
FOR ALL
USING (
  couple_id IN (
    SELECT id FROM couples
    WHERE partner_1_id = auth.uid()
    OR partner_2_id = auth.uid()
  )
);
```

---

## 🔐 Fluxo de Autenticação

```
Supabase Auth (email + senha)
       │
       ▼
JWT Token armazenado em cookie seguro (web)
ou Secure Storage (mobile)
       │
       ▼
Cada requisição ao Supabase carrega o token
       │
       ▼
RLS do Postgres valida o couple_id automaticamente
```

---

## 🔁 Fluxo de Dados (Data Flow)

```
Componente de UI
     │ chama
     ▼
Custom Hook (ex: useGuests)
     │ chama
     ▼
Service (ex: guestService)
     │ chama
     ▼
Supabase Client
     │
     ▼
PostgreSQL (com RLS)
```

**Regra:** UI → Hook → Service → Supabase. Nunca pular etapas.

---

## ➕ Como Adicionar Novas Páginas

1. Identificar o grupo de rotas: `(auth)` ou `(dashboard)`
2. Criar pasta com nome em **kebab-case** dentro do grupo
3. Criar `page.tsx` dentro da pasta
4. Se precisar de layout específico, criar `layout.tsx` na pasta
5. Adicionar a rota na tabela deste arquivo
6. Criar hook correspondente em `shared/hooks/` se necessário
7. Criar service correspondente em `shared/services/` se necessário

```
app/
└── (dashboard)/
    └── lista-de-presentes/     ← nova pasta
        ├── page.tsx             ← nova página
        └── loading.tsx          ← opcional: skeleton
```

---

## ➕ Como Adicionar Novas Funcionalidades

1. Verificar se já existe serviço/hook relacionado
2. Criar migration SQL em `supabase/migrations/` se precisar de nova tabela
3. Criar tipos em `shared/types/`
4. Criar service em `shared/services/`
5. Criar hook em `shared/hooks/`
6. Criar componentes em `shared/components/features/`
7. Usar nos componentes de página
8. Documentar em `COMPONENTS.md` e `API.md`

---

## 🚫 Como Evitar Dependências Desnecessárias

- Antes de instalar qualquer lib, verificar se já tem algo que resolve no projeto
- Preferir utilitários nativos do React/Next.js antes de instalar lib
- Libs de UI: usar apenas o design system próprio (`DESIGN-SYSTEM.md`)
- Nunca instalar duas libs para o mesmo propósito
- Toda nova dependência deve ser discutida antes de adicionada

---

*Última atualização: Julho 2026 | Projeto: Noivos | IAs: Manus + Grok*
