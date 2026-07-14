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
