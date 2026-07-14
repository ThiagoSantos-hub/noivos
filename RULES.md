# 📋 RULES.md — Regras que a IA deve seguir sempre

> Este arquivo define as regras obrigatórias de desenvolvimento do projeto Noivos.
> Toda IA (Manus, Grok) e todo desenvolvedor deve seguir estas regras sem exceção.

---

## 🔤 Convenções de Código

### Linguagem
- Todo código escrito em **inglês** (variáveis, funções, componentes, classes)
- Comentários podem ser em **português** para facilitar entendimento
- Mensagens de commit em **português** seguindo Conventional Commits

### TypeScript
- **Sempre** usar TypeScript — nunca JavaScript puro
- **Nunca** usar `any` — tipar tudo corretamente
- **Sempre** tipar o retorno de funções
- Preferir `interface` para objetos e shapes
- Preferir `type` para uniões, interseções e aliases
- Ativar `strict: true` no `tsconfig.json`

```typescript
// ✅ CORRETO
interface IGuest {
  id: string
  name: string
  confirmed: boolean
  tableNumber: number | null
}

function getConfirmedGuests(guests: IGuest[]): IGuest[] {
  return guests.filter(g => g.confirmed)
}

// ❌ ERRADO
function getGuests(guests: any): any {
  return guests.filter((g: any) => g.confirmed)
}
```

### Formatação
- Indentação: **2 espaços** (nunca tab)
- Aspas: **simples** `'texto'` (exceto em JSX: aspas duplas)
- Ponto e vírgula: **não usar** (omitir ao final das linhas)
- Máximo **100 caracteres** por linha
- Sempre **linha em branco** no final do arquivo

---

## 📁 Nomeação de Arquivos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componentes React | PascalCase | `GuestCard.tsx` |
| Hooks | camelCase + prefixo `use` | `useGuests.ts` |
| Páginas (Next.js) | kebab-case | `guest-list/page.tsx` |
| Utilitários | camelCase | `formatDate.ts` |
| Constantes | camelCase | `constants.ts` |
| Tipos | PascalCase | `types.ts` ou `IGuest.ts` |
| Estilos módulo | kebab-case | `guest-card.module.css` |
| Testes | mesmo nome + `.test` | `GuestCard.test.tsx` |
| Services | camelCase + `Service` | `guestService.ts` |

---

## 🧩 Nomeação de Componentes

- **PascalCase** sempre: `WeddingCard`, `GuestList`, `BrideGroomSync`
- Nome deve descrever **o que é**, não **onde está**
- Nunca usar prefixo genérico: ~~`ComponentCard`~~, ~~`ItemList`~~
- Componentes de página: sufixo `Page` → `GuestListPage`
- Componentes de modal: sufixo `Modal` → `AddGuestModal`
- Componentes de formulário: sufixo `Form` → `GuestForm`
- Componentes de layout: sufixo `Layout` → `DashboardLayout`

```typescript
// ✅ CORRETO
export function GuestCard({ guest }: IGuestCardProps) {}
export function AddGuestModal({ onClose }: IModalProps) {}
export function useGuestList() {}

// ❌ ERRADO
export function card({ data }: any) {}
export function Modal({ close }: any) {}
export function guestList() {}
```

---

## 📝 Estrutura de Commits

Seguir **Conventional Commits** obrigatoriamente:

```
<tipo>: <descrição em português, curta e clara>
```

### Tipos válidos
| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `style` | Mudanças visuais sem lógica |
| `refactor` | Refatoração sem nova feature ou fix |
| `docs` | Atualização de documentação |
| `chore` | Tarefas de manutenção, deps |
| `test` | Adição ou correção de testes |
| `perf` | Melhoria de performance |

### Exemplos corretos
```
feat: adiciona tela de lista de convidados
fix: corrige sincronização em tempo real entre os noivos
style: ajusta espaçamento dos cards de padrinhos
refactor: extrai lógica de auth para hook useAuth
docs: atualiza API.md com endpoint de convidados
chore: atualiza dependências do Supabase
```

### Regras de commit
- Descrição em **letras minúsculas**
- **Nunca** commitar diretamente na `main`
- **Sempre** commitar na `staging` e abrir PR
- **Nunca** commitar arquivos `.env`
- **Nunca** commitar `node_modules`
- **Nunca** commitar credenciais ou tokens

---

## 📂 Organização de Pastas

```
noivos/
├── app/                    # Next.js — rotas web
│   ├── (auth)/             # Rotas públicas (login, cadastro)
│   ├── (dashboard)/        # Rotas protegidas
│   └── api/                # API Routes do Next.js
├── mobile/                 # React Native
│   ├── screens/            # Telas
│   ├── components/         # Componentes mobile
│   └── navigation/         # Stack e Tab navigators
├── shared/                 # Compartilhado entre web e mobile
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/             # Componentes base (Button, Input...)
│   │   └── features/       # Componentes de feature (GuestCard...)
│   ├── hooks/              # Custom hooks
│   ├── services/           # Chamadas ao Supabase e APIs
│   ├── store/              # Estado global (Zustand)
│   ├── types/              # Interfaces e tipos TypeScript
│   └── utils/              # Funções puras utilitárias
├── supabase/
│   ├── migrations/         # SQL migrations (nunca editar manualmente)
│   └── functions/          # Edge functions
└── docs/                   # Arquivos .md do projeto
```

### Regras de organização
- Nunca criar pasta com nome genérico: ~~`misc`~~, ~~`stuff`~~, ~~`temp`~~
- Cada feature tem sua própria pasta dentro de `features/`
- Componentes de UI pura ficam em `ui/` — sem lógica de negócio
- Services nunca importam componentes
- Hooks nunca importam diretamente da UI

---

## ⚡ Regras de Performance

- Sempre usar `React.memo` em componentes que recebem as mesmas props frequentemente
- Sempre usar `useCallback` em funções passadas como props
- Sempre usar `useMemo` para cálculos pesados
- Nunca fazer fetch de dados dentro de componentes de UI — usar hooks ou services
- Imagens sempre com `width` e `height` definidos (evitar layout shift)
- Nunca carregar lista inteira — usar paginação (mínimo 20 itens por vez)
- Real-time: sempre cancelar subscription quando o componente desmonta

```typescript
// ✅ CORRETO — cancelar subscription
useEffect(() => {
  const subscription = supabase
    .channel('guests')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, handleChange)
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

---

## ♿ Regras de Acessibilidade

- Todo `<img>` deve ter atributo `alt` descritivo
- Todo botão deve ter texto ou `aria-label`
- Formulários sempre com `label` associado ao input (`htmlFor`)
- Cores nunca como único indicador de estado — usar texto ou ícone também
- Tamanho mínimo de área clicável: **44x44px**
- Sempre suportar navegação por teclado (Tab, Enter, Escape)
- Modais sempre com foco preso dentro e `Escape` para fechar

```tsx
// ✅ CORRETO
<button aria-label="Remover convidado João Silva">
  <TrashIcon />
</button>

// ❌ ERRADO
<div onClick={handleRemove}>
  <TrashIcon />
</div>
```

---

## 🔍 Regras de SEO (Web)

- Toda página com `<title>` e `<meta name="description">` únicos
- URLs sempre em **kebab-case** e em português: `/lista-de-convidados`
- Usar tags semânticas: `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`
- Hierarquia de headings: nunca pular nível (`h1` → `h2` → `h3`)
- Nunca mais de um `<h1>` por página
- Open Graph configurado para compartilhamento social

---

## ✅ Boas Práticas Gerais

- [ ] Sempre usar `try/catch` em chamadas assíncronas
- [ ] Sempre mostrar feedback ao usuário (loading, erro, sucesso)
- [ ] Nunca deixar `console.log` em produção
- [ ] Nunca fazer `soft delete` — usar campo `deleted_at` no banco
- [ ] Sempre validar dados no frontend **e** no backend
- [ ] Variáveis de ambiente sempre no `ENV.md` documentadas
- [ ] Todo componente novo documentado no `COMPONENTS.md`
- [ ] Todo endpoint novo documentado no `API.md`
- [ ] Código revisado antes de abrir PR

---

## 🚫 O Que Nunca Deve Ser Feito

- ❌ **Nunca** commitar na `main` diretamente
- ❌ **Nunca** expor chaves de API no código (usar `.env`)
- ❌ **Nunca** deletar registros fisicamente do banco (usar `deleted_at`)
- ❌ **Nunca** criar componente sem checar se já existe no `COMPONENTS.md`
- ❌ **Nunca** usar `// @ts-ignore` para suprimir erros TypeScript
- ❌ **Nunca** misturar lógica de negócio com componentes de UI
- ❌ **Nunca** criar endpoints sem documentar no `API.md`
- ❌ **Nunca** usar `any` no TypeScript
- ❌ **Nunca** fazer fetch sem tratamento de erro
- ❌ **Nunca** salvar senhas em texto puro — sempre hash (Supabase Auth cuida disso)
- ❌ **Nunca** criar variável de ambiente sem adicionar no `ENV.md`
- ❌ **Nunca** deixar subscription do Supabase aberta sem cleanup

---

## ✔️ Checklist Antes de Finalizar Qualquer Tarefa

Antes de considerar qualquer task concluída, verificar:

- [ ] O código compila sem erros TypeScript?
- [ ] Não há `console.log` esquecido?
- [ ] Não há `any` no TypeScript?
- [ ] O componente/feature foi documentado?
- [ ] As variáveis de ambiente foram adicionadas ao `ENV.md`?
- [ ] O endpoint foi adicionado ao `API.md`?
- [ ] O design segue o `DESIGN-SYSTEM.md`?
- [ ] O comportamento em mobile foi verificado?
- [ ] Os erros são tratados e exibidos ao usuário?
- [ ] A sincronização real-time foi testada com 2 usuários?

---

*Última atualização: Julho 2026 | Projeto: Noivos | IAs: Manus + Grok*
