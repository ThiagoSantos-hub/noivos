# 🧩 COMPONENTS.md — Componentes do Projeto

> Antes de criar qualquer componente novo, consulte este arquivo.
> Se já existe, reutilize. Se criou um novo, documente aqui.

---

## 📐 Componentes Base (UI)

Ficam em `shared/components/ui/`
São componentes puros de interface — sem lógica de negócio.

---

### `Button`
**Objetivo:** Botão padrão do app, com variantes de estilo e estado.

**Quando utilizar:** Toda ação que o usuário pode executar.

**Quando NÃO utilizar:** Links de navegação (usar `<Link>` do Next.js ou `TouchableOpacity` no mobile).

**Props disponíveis:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | `string` | — | Texto do botão |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |
| `loading` | `boolean` | `false` | Mostra spinner |
| `disabled` | `boolean` | `false` | Desabilita |
| `icon` | `ReactNode` | `undefined` | Ícone opcional |

**Exemplo de uso:**
```tsx
<Button
  label="Adicionar convidado"
  variant="primary"
  onClick={handleAddGuest}
  loading={isLoading}
/>
```

---

### `Input`
**Objetivo:** Campo de texto padrão com label, placeholder e estado de erro.

**Quando utilizar:** Qualquer campo de entrada de texto no app.

**Quando NÃO utilizar:** Seleção de opções (usar `Select`), data (usar `DatePicker`).

**Props disponíveis:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | `string` | — | Label do campo |
| `placeholder` | `string` | `''` | Placeholder |
| `value` | `string` | — | Valor atual |
| `onChange` | `(val: string) => void` | — | Callback de mudança |
| `error` | `string` | `undefined` | Mensagem de erro |
| `type` | `'text' \| 'email' \| 'password' \| 'tel' \| 'date' \| 'number'` | `'text'` | Tipo do input |
| `disabled` | `boolean` | `false` | Desabilita |

**Exemplo de uso:**
```tsx
<Input
  label="Nome do convidado"
  placeholder="Ex: João Silva"
  value={name}
  onChange={setName}
  error={errors.name}
/>
```

---

### `ProgressBar`
**Objetivo:** Barra de progresso fina no topo da tela para indicar etapas de onboarding.

**Quando utilizar:** Em fluxos de múltiplas etapas (onboarding, formulários longos).

**Props disponíveis:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `progress` | `number` | — | Percentual de progresso (0-100) |

**Exemplo de uso:**
```tsx
<ProgressBar progress={50} />
```

---

## 🎯 Componentes de Feature

Ficam em `shared/components/features/`
São componentes que contêm lógica do projeto (mas não fazem chamadas diretas ao banco).

---

### `OnboardingForm`
**Objetivo:** Formulário para cadastro inicial do casal com validações robustas.

**Quando utilizar:** Na tela de onboarding (`/cadastro`).

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `onSubmit` | `(data: CoupleRegistration) => Promise<void>` | Callback ao submeter |
| `isLoading` | `boolean` | Estado de carregamento |
| `error` | `string` | Mensagem de erro externa |

**Campos do formulário:**
- Nome da Noiva (obrigatório)
- Email da Noiva (obrigatório, válido, distinto)
- Nome do Noivo (obrigatório)
- Email do Noivo (obrigatório, válido, distinto)
- Data do Casamento (obrigatória, futura)
- Orçamento Total (obrigatório, positivo)

**Validações:**
- Emails são obrigatórios e devem ser distintos
- Data do casamento deve ser futura
- Orçamento deve ser numérico e maior que zero
- Feedback visual em tempo real

**Exemplo de uso:**
```tsx
<OnboardingForm
  onSubmit={handleRegister}
  isLoading={isLoading}
  error={error}
/>
```

---

### `LoginForm`
**Objetivo:** Formulário de login do casal com validações de email e senha.

**Quando utilizar:** Na tela de login (`/login`).

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|----------|
| `onSubmit` | `(data: { email: string; password: string }) => Promise<void>` | Callback ao submeter |
| `isLoading` | `boolean` | Estado de carregamento |
| `error` | `string` | Mensagem de erro externa |

**Campos do formulário:**
- Email (obrigatório, válido)
- Senha (obrigatória, mínimo 6 caracteres)

**Validações:**
- Email é obrigatório e deve ter formato válido
- Senha é obrigatória e deve ter no mínimo 6 caracteres
- Feedback visual em tempo real
- Link "Não tem conta? Cadastre-se aqui" apontando para `/cadastro`

**Exemplo de uso:**
```tsx
<LoginForm
  onSubmit={handleLogin}
  isLoading={isLoading}
  error={error}
/>
```

---

### `CoupleHeader`
**Objetivo:** Exibe a saudação "Olá, [Noiva] & [Noivo]! 💍" com edição inline dos nomes.

**Quando utilizar:** No topo do Dashboard (`/inicio`).

**Quando NÃO utilizar:** Em outras telas — é exclusivo do cabeçalho do dashboard.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `couple` | `Couple` | Dados do casal vindos do Supabase |
| `onUpdate` | `(payload: CoupleUpdatePayload) => Promise<void>` | Callback para salvar nome editado |

**Comportamento:**
- Ao clicar no nome da noiva ou do noivo, abre campo de edição inline
- Confirma com Enter ou botão ✓; cancela com Escape ou botão ✕
- Salva no Supabase via `onUpdate`; exibe erro se falhar

**Exemplo de uso:**
```tsx
<CoupleHeader couple={couple} onUpdate={updateCoupleData} />
```

---

### `CountdownBar`
**Objetivo:** Exibe o countdown até o casamento com barra de progresso e alerta colorido.

**Quando utilizar:** No Dashboard (`/inicio`), quando `data_casamento` está definida.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `weddingDate` | `string` | Data do casamento (ISO 8601) |
| `createdAt` | `string` | Data de criação do casal (para calcular progresso) |

**Alertas:**
- 🟢 Verde: mais de 6 meses
- 🟡 Amarelo: entre 2 e 6 meses
- 🔴 Vermelho: menos de 2 meses

**Exemplo de uso:**
```tsx
<CountdownBar weddingDate={couple.data_casamento} createdAt={couple.created_at} />
```

---

### `FinancialBar`
**Objetivo:** Exibe o resumo financeiro (planejado, pago, faltando) com barra de progresso e alerta.

**Quando utilizar:** No Dashboard (`/inicio`).

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `totalBudget` | `number` | Orçamento total planejado |
| `totalPaid` | `number` | Valor já pago |

**Alertas:**
- 🟢 Verde: menos de 50% comprometido
- 🟡 Amarelo: entre 50% e 80%
- 🔴 Vermelho: acima de 80%

**Exemplo de uso:**
```tsx
<FinancialBar totalBudget={couple.total_budget ?? 0} totalPaid={couple.total_paid ?? 0} />
```

---

### `BottomNav`
**Objetivo:** Barra de navegação fixa no rodapé com ícones para as 5 seções do app.

**Quando utilizar:** No layout do dashboard — aparece em todas as telas protegidas.

**Quando NÃO utilizar:** Em telas de autenticação (`/login`, `/cadastro`).

**Props:** Nenhuma — usa `usePathname()` internamente para destacar a rota ativa.

**Rotas:**
| Ícone | Label | Rota |
|-------|-------|------|
| 🏠 Home | Início | `/inicio` |
| 💰 DollarSign | Financeiro | `/financeiro` |
| 👥 Users | Convidados | `/convidados` |
| ✅ CheckSquare | Tarefas | `/tarefas` |
| ⚙️ MoreHorizontal | Mais | `/mais` |

**Exemplo de uso:**
```tsx
<BottomNav />
```

---

### `VendorCard`
**Objetivo:** Exibe informações de um fornecedor (nome, categoria, valores e barra de progresso).

**Quando utilizar:** Na lista de fornecedores do dashboard.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `vendor` | `Vendor` | Objeto com os dados do fornecedor |
| `onClick` | `(vendor: Vendor) => void` | Callback ao clicar no card para editar |

**Exemplo de uso:**
```tsx
<VendorCard vendor={vendor} onClick={handleEdit} />
```

---

### `VendorForm`
**Objetivo:** Formulário modal para criação e edição de fornecedores.

**Quando utilizar:** Quando o usuário clica em adicionar (+) ou em um card de fornecedor.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `vendor` | `Vendor?` | Objeto para edição (opcional) |
| `onSubmit` | `(data) => Promise<void>` | Callback ao salvar |
| `onDelete` | `(id) => Promise<void>` | Callback ao excluir (opcional) |
| `onClose` | `() => void` | Fecha o modal |

---

### `VendorList`
**Objetivo:** Gerencia a exibição da lista de fornecedores ou estado vazio.

**Quando utilizar:** Na página `/fornecedores`.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `vendors` | `Vendor[]` | Lista de fornecedores |
| `onVendorClick` | `(vendor) => void` | Callback ao clicar em um item |

---

### `GuestCard`
**Objetivo:** Exibe resumo de um convidado (nome, status, mesa e telefone).

**Quando utilizar:** Nas listas por grupo da página `/convidados`.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `guest` | `Guest` | Dados do convidado |
| `onClick` | `(guest) => void` | Callback ao clicar no card |

---

### `GuestSummary`
**Objetivo:** Painel de contagem total (cadastrados vs esperados) e status (confirmados/pendentes). Permite editar o total esperado inline.

**Quando utilizar:** No topo da página `/convidados`.

---

### `GuestForm`
**Objetivo:** Modal para criar ou editar um convidado, com seleção de grupo e status.

**Quando utilizar:** Ao clicar no botão (+) ou em um card de convidado.

---

## 📐 Padrões de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componente base UI | PascalCase | `Button`, `Input`, `ProgressBar` |
| Componente de feature | PascalCase + contexto | `OnboardingForm` |
| Formulário | PascalCase + `Form` | `OnboardingForm` |
| Tela (Next.js page) | PascalCase + `Page` | `OnboardingPage` |
| Tela (React Native) | PascalCase + `Screen` | `OnboardingScreen` |

---

## ➕ Como Adicionar um Novo Componente

1. Verificar neste arquivo se já existe algo similar
2. Criar a pasta do componente em `shared/components/ui/` ou `features/`
3. Criar o arquivo `NomeDoComponente.tsx`
4. Tipar todas as props com interface
5. Exportar como named export: `export function NomeDoComponente`
6. **Documentar aqui neste arquivo** com: objetivo, quando usar, quando NÃO usar, props e exemplo

---

*Última atualização: Julho 2026 | Projeto: Noivos | IAs: Manus + Grok*
