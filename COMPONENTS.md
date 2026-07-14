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
| `onPress` | `() => void` | — | Ação ao clicar |
| `icon` | `ReactNode` | `undefined` | Ícone opcional |

**Exemplo de uso:**
```tsx
<Button
  label="Adicionar convidado"
  variant="primary"
  onPress={handleAddGuest}
  loading={isLoading}
/>
```

**Componentes relacionados:** `IconButton`, `FloatingActionButton`

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
| `type` | `'text' \| 'email' \| 'password' \| 'tel'` | `'text'` | Tipo do input |
| `disabled` | `boolean` | `false` | Desabilita |
| `required` | `boolean` | `false` | Campo obrigatório |

**Exemplo de uso:**
```tsx
<Input
  label="Nome do convidado"
  placeholder="Ex: João Silva"
  value={name}
  onChange={setName}
  error={errors.name}
  required
/>
```

**Componentes relacionados:** `Textarea`, `Select`, `DatePicker`

---

### `Card`
**Objetivo:** Container com fundo, sombra e borda arredondada para agrupar informações.

**Quando utilizar:** Agrupar informações de um item (convidado, tarefa, padrinho).

**Quando NÃO utilizar:** Listas muito longas sem paginação (pode pesar a renderização).

**Props disponíveis:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `ReactNode` | — | Conteúdo interno |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` | Espaçamento interno |
| `onPress` | `() => void` | `undefined` | Torna o card clicável |
| `shadow` | `boolean` | `true` | Sombra |

**Exemplo de uso:**
```tsx
<Card onPress={() => openGuest(guest.id)}>
  <Text>{guest.name}</Text>
</Card>
```

**Componentes relacionados:** `GuestCard`, `TaskCard`, `GroomsmanCard`

---

### `Modal`
**Objetivo:** Janela flutuante sobre o conteúdo principal para ações ou formulários.

**Quando utilizar:** Formulários de criação/edição, confirmações de ação.

**Quando NÃO utilizar:** Informações que caberiam em um tooltip ou inline.

**Props disponíveis:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `visible` | `boolean` | — | Controla visibilidade |
| `onClose` | `() => void` | — | Fechar o modal |
| `title` | `string` | — | Título do modal |
| `children` | `ReactNode` | — | Conteúdo |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |

**Exemplo de uso:**
```tsx
<Modal
  visible={isAddGuestOpen}
  onClose={() => setIsAddGuestOpen(false)}
  title="Adicionar convidado"
>
  <GuestForm onSubmit={handleSubmit} />
</Modal>
```

**Componentes relacionados:** `ConfirmModal`, `GuestForm`, `TaskForm`

---

### `Badge`
**Objetivo:** Etiqueta colorida para indicar status ou categoria.

**Quando utilizar:** Status de convidado (confirmado/pendente), status de tarefa, tipo de padrinho.

**Quando NÃO utilizar:** Textos longos — badge é para 1-2 palavras.

**Props disponíveis:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | `string` | — | Texto da badge |
| `color` | `'green' \| 'yellow' \| 'red' \| 'blue' \| 'gray'` | `'gray'` | Cor |

**Exemplo de uso:**
```tsx
<Badge label="Confirmado" color="green" />
<Badge label="Pendente" color="yellow" />
```

**Componentes relacionados:** `GuestCard`, `TaskItem`

---

### `Avatar`
**Objetivo:** Exibir foto de perfil ou iniciais do usuário.

**Quando utilizar:** Perfil dos noivos, lista de padrinhos.

**Props disponíveis:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `name` | `string` | — | Nome (para gerar iniciais) |
| `imageUrl` | `string` | `undefined` | URL da foto |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho |

**Exemplo de uso:**
```tsx
<Avatar name="Thiago Santos" size="lg" />
```

---

### `EmptyState`
**Objetivo:** Tela vazia com mensagem e ação quando não há dados.

**Quando utilizar:** Listas sem itens (sem convidados, sem tarefas).

**Props disponíveis:**
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | `string` | — | Título da mensagem |
| `description` | `string` | — | Descrição |
| `actionLabel` | `string` | `undefined` | Texto do botão de ação |
| `onAction` | `() => void` | `undefined` | Ação do botão |
| `icon` | `ReactNode` | `undefined` | Ícone ilustrativo |

**Exemplo de uso:**
```tsx
<EmptyState
  title="Nenhum convidado ainda"
  description="Adicione os convidados do casamento aqui."
  actionLabel="Adicionar convidado"
  onAction={() => setIsAddGuestOpen(true)}
/>
```

---

## 🎯 Componentes de Feature

Ficam em `shared/components/features/`
São componentes que contêm lógica do projeto (mas não fazem chamadas diretas ao banco).

---

### `GuestCard`
**Objetivo:** Exibir as informações de um convidado na lista.

**Quando utilizar:** Na listagem de convidados.

**Quando NÃO utilizar:** Para exibir padrinhos (usar `GroomsmanCard`).

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `guest` | `IGuest` | Dados do convidado |
| `onEdit` | `(id: string) => void` | Abrir edição |
| `onRemove` | `(id: string) => void` | Remover convidado |
| `onConfirm` | `(id: string) => void` | Confirmar presença |

**Exemplo de uso:**
```tsx
<GuestCard
  guest={guest}
  onEdit={handleEdit}
  onRemove={handleRemove}
  onConfirm={handleConfirm}
/>
```

**Componentes relacionados:** `Badge`, `Card`, `Avatar`

---

### `GroomsmanCard`
**Objetivo:** Exibir as informações de um padrinho ou madrinha.

**Quando utilizar:** Na listagem de padrinhos/madrinhas.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `groomsman` | `IGroomsman` | Dados do padrinho |
| `onEdit` | `(id: string) => void` | Abrir edição |
| `onRemove` | `(id: string) => void` | Remover |

**Exemplo de uso:**
```tsx
<GroomsmanCard
  groomsman={groomsman}
  onEdit={handleEdit}
  onRemove={handleRemove}
/>
```

---

### `TaskItem`
**Objetivo:** Exibir uma tarefa com checkbox, título e prazo.

**Quando utilizar:** Na lista de tarefas do casal.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `task` | `ITask` | Dados da tarefa |
| `onToggle` | `(id: string) => void` | Marcar como feita/não feita |
| `onEdit` | `(id: string) => void` | Editar tarefa |
| `onRemove` | `(id: string) => void` | Remover tarefa |

**Exemplo de uso:**
```tsx
<TaskItem
  task={task}
  onToggle={handleToggle}
  onEdit={handleEdit}
  onRemove={handleRemove}
/>
```

---

### `SyncIndicator`
**Objetivo:** Mostrar se a sincronização em tempo real está ativa.

**Quando utilizar:** Header do dashboard — sempre visível para os noivos.

**Quando NÃO utilizar:** Telas de auth (login, cadastro).

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `connected` | `boolean` | Status da conexão real-time |
| `partnerOnline` | `boolean` | Se o(a) parceiro(a) está online |

**Exemplo de uso:**
```tsx
<SyncIndicator connected={isConnected} partnerOnline={partnerOnline} />
```

---

### `GuestForm`
**Objetivo:** Formulário para adicionar ou editar um convidado.

**Quando utilizar:** Dentro do `AddGuestModal` ou `EditGuestModal`.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `initialData` | `Partial<IGuest>` | Dados iniciais (edição) |
| `onSubmit` | `(data: IGuest) => void` | Callback ao salvar |
| `onCancel` | `() => void` | Callback ao cancelar |
| `loading` | `boolean` | Estado de envio |

**Exemplo de uso:**
```tsx
<GuestForm
  initialData={selectedGuest}
  onSubmit={handleSaveGuest}
  onCancel={() => setIsOpen(false)}
  loading={isSaving}
/>
```

---

### `TaskForm`
**Objetivo:** Formulário para adicionar ou editar uma tarefa.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `initialData` | `Partial<ITask>` | Dados iniciais (edição) |
| `onSubmit` | `(data: ITask) => void` | Callback ao salvar |
| `onCancel` | `() => void` | Callback ao cancelar |
| `loading` | `boolean` | Estado de envio |

---

### `ConfirmModal`
**Objetivo:** Modal de confirmação para ações destrutivas (remover convidado, deletar tarefa).

**Quando utilizar:** Sempre antes de uma ação irreversível.

**Quando NÃO utilizar:** Ações reversíveis — fazer direto sem confirmação.

**Props disponíveis:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `visible` | `boolean` | Controla visibilidade |
| `title` | `string` | Título da confirmação |
| `description` | `string` | Descrição do que será feito |
| `confirmLabel` | `string` | Texto do botão confirmar |
| `onConfirm` | `() => void` | Ação confirmada |
| `onCancel` | `() => void` | Ação cancelada |
| `loading` | `boolean` | Estado de carregamento |

**Exemplo de uso:**
```tsx
<ConfirmModal
  visible={isConfirmOpen}
  title="Remover convidado"
  description="Tem certeza que quer remover João Silva da lista?"
  confirmLabel="Remover"
  onConfirm={handleRemove}
  onCancel={() => setIsConfirmOpen(false)}
  loading={isRemoving}
/>
```

---

## 📐 Padrões de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componente base UI | PascalCase | `Button`, `Input`, `Card` |
| Componente de feature | PascalCase + contexto | `GuestCard`, `TaskItem` |
| Formulário | PascalCase + `Form` | `GuestForm`, `TaskForm` |
| Modal de ação | PascalCase + `Modal` | `AddGuestModal`, `ConfirmModal` |
| Tela (Next.js page) | PascalCase + `Page` | `GuestsPage`, `TasksPage` |
| Tela (React Native) | PascalCase + `Screen` | `GuestsScreen`, `HomeScreen` |
| Layout | PascalCase + `Layout` | `DashboardLayout`, `AuthLayout` |

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
