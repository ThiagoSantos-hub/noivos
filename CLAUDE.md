# 💍 CLAUDE.md — Cérebro do Projeto Noivos

> Este arquivo é a primeira coisa que você deve ler antes de qualquer tarefa.
> Ele define quem somos, o que construímos e como trabalhamos.

---

## 🎯 Objetivo do Projeto

**Noivos** é um app de planejamento de casamento para casais.
Permite que dois usuários (os noivos) planejem tudo juntos, em tempo real, com sincronização instantânea entre dispositivos.

- **Plataforma:** Web (browser) + Mobile (PWA ou app nativo)
- **Usuários principais:** 2 noivos com acesso simultâneo
- **Propósito:** Centralizar lista de convidados, padrinhos, tarefas, fornecedores e identidade visual do casamento

---

## 🛠️ Stack Utilizada

### Frontend
- **Framework:** React Native (mobile) + Next.js (web)
- **Estilização:** TailwindCSS + design system próprio
- **Estado global:** Zustand ou Context API
- **Sincronização real-time:** Supabase Realtime ou Firebase

### Backend
- **BaaS:** Supabase (auth, banco, real-time, storage)
- **Banco de dados:** PostgreSQL (via Supabase)
- **Autenticação:** Supabase Auth (email/senha + magic link)
- **Storage:** Supabase Storage (fotos, documentos)

### Ferramentas
- **Versionamento:** GitHub (`main` = produção, `staging` = testes)
- **Gerenciamento:** Notion
- **IA de desenvolvimento:** Manus IA + Grok IA

---

## 📁 Estrutura de Pastas

```
noivos/
├── app/                    # Next.js app router (web)
│   ├── (auth)/             # Rotas de autenticação
│   ├── (dashboard)/        # Rotas autenticadas
│   └── api/                # API routes
├── mobile/                 # React Native (mobile)
│   ├── screens/            # Telas do app
│   ├── components/         # Componentes mobile
│   └── navigation/         # Navegação
├── shared/                 # Código compartilhado web + mobile
│   ├── components/         # Componentes reutilizáveis
│   ├── hooks/              # Custom hooks
│   ├── services/           # Integrações (Supabase, APIs)
│   ├── store/              # Estado global
│   ├── types/              # Tipos TypeScript
│   └── utils/              # Funções utilitárias
├── supabase/               # Configurações Supabase
│   ├── migrations/         # Migrations do banco
│   └── functions/          # Edge functions
├── public/                 # Assets estáticos
├── docs/                   # Documentação (este arquivo e os outros .md)
├── CLAUDE.md
├── RULES.md
├── ARCHITECTURE.md
├── COMPONENTS.md
├── DESIGN-SYSTEM.md
├── API.md
└── ENV.md
```

---

## 📐 Convenções de Código

### Nomenclatura
- **Componentes:** PascalCase → `GuestCard.tsx`
- **Hooks:** camelCase com prefixo `use` → `useGuests.ts`
- **Funções utilitárias:** camelCase → `formatDate.ts`
- **Constantes:** UPPER_SNAKE_CASE → `MAX_GUESTS = 500`
- **Tipos/Interfaces:** PascalCase com prefixo `I` para interfaces → `IGuest`, `TUser`
- **Arquivos de estilo:** kebab-case → `guest-card.module.css`

### TypeScript
- Sempre usar TypeScript. Nunca usar `any`.
- Sempre tipar retornos de funções.
- Preferir `interface` para objetos, `type` para uniões.

### Imports
```typescript
// 1. Libs externas
import { useState } from 'react'
import { supabase } from '@/services/supabase'

// 2. Componentes internos
import { GuestCard } from '@/components/GuestCard'

// 3. Tipos
import type { IGuest } from '@/types'
```

---

## ✨ Como Criar Novas Funcionalidades

1. Crie a branch a partir de `staging`: `git checkout -b feat/nome-da-feature`
2. Verifique se já existe componente similar em `COMPONENTS.md`
3. Verifique se a rota de API já existe em `API.md`
4. Siga o design system definido em `DESIGN-SYSTEM.md`
5. Escreva o código seguindo `RULES.md`
6. Teste na branch `staging` antes de subir para `main`
7. Abra PR com descrição clara do que foi feito

---

## 🧩 Como Escrever Componentes

```typescript
// ✅ CORRETO
interface IGuestCardProps {
  guest: IGuest
  onRemove: (id: string) => void
}

export function GuestCard({ guest, onRemove }: IGuestCardProps) {
  return (
    <div className="guest-card">
      <span>{guest.name}</span>
      <button onClick={() => onRemove(guest.id)}>Remover</button>
    </div>
  )
}
```

- Um componente = um arquivo
- Props sempre tipadas com interface
- Nunca lógica de negócio dentro do componente — use hooks
- Componentes de UI não fazem chamadas diretas ao Supabase

---

## 🐛 Como Lidar com Bugs

1. Identifique se é bug de UI, lógica ou dados
2. Reproduza o bug localmente antes de corrigir
3. Crie branch: `git checkout -b fix/descricao-do-bug`
4. Corrija apenas o que está com problema — não refatore junto
5. Commit descritivo: `fix: corrige sincronização de convidados em tempo real`
6. Abra PR apontando para `staging`

---

## 📝 Como Criar Commits

Seguir padrão **Conventional Commits**:

```
feat: adiciona tela de lista de convidados
fix: corrige bug na sincronização dos noivos
style: ajusta espaçamento do botão de convite
refactor: extrai lógica de auth para hook useAuth
docs: atualiza CLAUDE.md com nova stack
chore: atualiza dependências do projeto
```

**Nunca commitar:**
- Arquivos `.env`
- `node_modules/`
- Credenciais ou tokens
- Código comentado sem explicação

---

## ❓ Como Responder Quando Faltar Contexto

Se você (IA) não souber algo sobre o projeto, siga esta ordem:

1. Consulte `ARCHITECTURE.md` para entender o fluxo
2. Consulte `API.md` para verificar endpoints existentes
3. Consulte `COMPONENTS.md` para verificar componentes existentes
4. Consulte `DESIGN-SYSTEM.md` para padrões visuais
5. **Nunca invente** endpoints, componentes ou rotas — pergunte ao desenvolvedor

---

## ✅ Boas Práticas Obrigatórias

- [ ] Todo componente novo entra no `COMPONENTS.md`
- [ ] Todo endpoint novo entra no `API.md`
- [ ] Toda variável de ambiente nova entra no `ENV.md`
- [ ] Código sempre em inglês (variáveis, funções, componentes)
- [ ] Comentários podem ser em português para facilitar entendimento
- [ ] Nunca deixar `console.log` em produção
- [ ] Sempre validar dados antes de salvar no banco
- [ ] Sempre tratar erros com `try/catch`
- [ ] Real-time: sempre desinscrever listeners quando componente desmonta

---

## 🚫 O Que Nunca Deve Ser Feito

- ❌ Nunca commitar a branch `main` diretamente — sempre PR
- ❌ Nunca expor chaves de API no código
- ❌ Nunca deletar dados do banco sem soft delete
- ❌ Nunca criar componente sem verificar se já existe
- ❌ Nunca ignorar erros do TypeScript com `// @ts-ignore`
- ❌ Nunca misturar lógica de negócio com UI
- ❌ Nunca criar endpoints duplicados
- ❌ Nunca usar `any` no TypeScript

---

*Última atualização: Julho 2026 | Projeto: Noivos | IAs: Manus + Grok*
