# API.md — Endpoints da API

> Base URL (exemplo): `https://api.seuappdecasamento.com/v1`
> Autenticação: Bearer Token (JWT) — cada conta vinculada a exatamente 2 usuários (noiva + noivo)

---

## 1. Autenticação & Onboarding

### `POST /auth/register`
Cria a conta do casal (onboarding inicial).

**Request:**
```json
{
  "nome_noiva": "string",
  "nome_noivo": "string",
  "email_noiva": "string",
  "email_noivo": "string",
  "data_casamento": "YYYY-MM-DD",
  "orcamento_total": number
}
```

**Validações (frontend + backend):**
- `nome_noiva` e `nome_noivo`: obrigatórios, não-vazios
- `email_noiva` e `email_noivo`: obrigatórios, formato válido, distintos
- `data_casamento`: obrigatória, deve ser uma data futura
- `orcamento_total`: obrigatório, numérico, maior que zero

**Resposta:** `201 Created`
```json
{
  "success": true,
  "access_token": "string",
  "refresh_token": "string"
}
```

**Erros possíveis:**
- `400 Bad Request`: Validação falhou (email inválido, emails iguais, data no passado, orçamento inválido)
- `409 Conflict`: Email já cadastrado
- `500 Internal Server Error`: Erro ao criar conta

### `POST /auth/login`
```json
{ "email": "string", "senha": "string" }
```
**Resposta:** `200 OK` — `{ "access_token": "...", "refresh_token": "..." }`

### `POST /auth/refresh`
Renova o token de acesso.

### `POST /auth/logout`
Invalida a sessão do dispositivo atual.

> ⚠️ Regra de negócio: máximo 2 dispositivos ativos por conta (1 por noivo). Login em um 3º dispositivo deve ser bloqueado ou exigir remoção de um dispositivo existente.

**Implementação (frontend):**
- Componente `OnboardingForm` em `shared/components/features/OnboardingForm.tsx`
- Validações em `shared/utils/validations.ts`
- Página em `app/(auth)/cadastro/page.tsx`
- Barra de progresso durante submissão
- Redirecionamento para `/inicio` após sucesso

---

## 2. Conta / Casal

### `GET /couple`
Retorna dados do casal (nomes, emails, data do casamento, orçamento).

### `PATCH /couple`
Atualiza dados gerais (ex: data do casamento, orçamento total).

### `GET /couple/devices`
Lista dispositivos conectados (máx. 2).

### `DELETE /couple/devices/:device_id`
Remove um dispositivo (libera vaga para novo login).

---

## 3. Dashboard

### `GET /dashboard`
Retorna dados consolidados para a tela principal:
```json
{
  "dias_restantes": 0,
  "percentual_tempo_decorrido": 0,
  "orcamento_total": 0,
  "valor_pago": 0,
  "percentual_pago": 0,
  "status_geral": "verde | amarelo | vermelho"
}
```

---

## 4. Fornecedores

### `GET /fornecedores`
Lista todos os fornecedores cadastrados.

### `POST /fornecedores`
```json
{
  "categoria": "buffet | fotografo | musica | decoracao | convites | bolo | carro | local_cerimonia | local_festa",
  "nome_fornecedor": "string",
  "valor_total": 0,
  "valor_pago": 0,
  "status": "pendente | parcial | pago",
  "observacoes": "string"
}
```

### `GET /fornecedores/:id`
Detalhe de um fornecedor.

### `PATCH /fornecedores/:id`
Atualiza dados (ex: novo pagamento, status).

### `DELETE /fornecedores/:id`
Remove um fornecedor.

---

## 5. Trajes & Pessoas

### `GET /trajes`
Lista todos os itens de traje (vestido, terno, roupas de pais, padrinhos, etc.)

### `POST /trajes`
```json
{
  "tipo": "vestido_noiva | terno_noivo | pais_noiva | pais_noivo | padrinhos | madrinhas | pajens | daminhas | aliancas",
  "descricao": "string",
  "valor": 0,
  "status": "pendente | encomendado | pronto | entregue"
}
```

### `PATCH /trajes/:id`
Atualiza status/valor de um item.

---

## 6. Gestão de Pessoas

### `GET /pessoas`
Lista pessoas por grupo (padrinhos, madrinhas, convidados, pais).

### `POST /pessoas`
```json
{
  "grupo": "padrinho | madrinha | convidado | pai_noiva | pai_noivo",
  "nome": "string",
  "contato": "string"
}
```

### `PATCH /pessoas/:id`
### `DELETE /pessoas/:id`

---

## 7. Cerimônia

### `GET /cerimonia`
Retorna dados do celebrante, cronograma e música da cerimônia.

### `PATCH /cerimonia`
```json
{
  "celebrante_nome": "string",
  "celebrante_contato": "string",
  "celebrante_valor": 0,
  "celebrante_confirmado": true,
  "cronograma": "string ou lista de itens",
  "musica_entrada": "string"
}
```

---

## 8. Manuais & Convites

### `GET /manuais`
Lista os manuais disponíveis (padrinhos, madrinhas, noivos, pais).

### `POST /manuais`
```json
{
  "tipo": "padrinhos | madrinhas | noivos | pais_noiva | pais_noivo",
  "conteudo_url": "string",
  "titulo": "string"
}
```

### `GET /convites`
Lista convites (celebrante, pais, padrinhos/madrinhas).

### `POST /convites`
```json
{
  "destinatario": "celebrante | pais | padrinhos_madrinhas",
  "status": "nao_enviado | enviado | confirmado"
}
```

---

## 9. Tarefas do Casamento

> Implementação via Supabase direto (sem API Route própria).
> Service: `shared/services/taskService.ts` | Hook: `shared/hooks/useTasks.ts`

### `GET tasks` (Supabase)
Busca todas as tarefas do casal autenticado, excluindo soft deletes.

**Filtros aplicados:** `deleted_at IS NULL`, ordenado por `created_at DESC`

**Campos retornados:** `id`, `couple_id`, `title`, `status`, `category`, `priority`, `assignee`, `due_date`, `notes`, `deleted_at`, `created_at`, `updated_at`

### `INSERT tasks` (Supabase)
```json
{
  "title": "string (obrigatório)",
  "status": "pending | done",
  "category": "ceremony | party",
  "priority": "high | medium | low | null",
  "assignee": "bride | groom | null",
  "due_date": "YYYY-MM-DD | null",
  "notes": "string | null",
  "couple_id": "uuid (preenchido automaticamente pelo service)"
}
```

### `UPDATE tasks` (Supabase)
Atualiza qualquer campo da tarefa. Sempre atualiza `updated_at` automaticamente.

### `UPDATE tasks (soft delete)` (Supabase)
Preenche `deleted_at` com timestamp atual — nunca deleta fisicamente.

**Realtime:** Subscription ativa na tabela `tasks` via `supabase.channel('tasks-changes')` — sincroniza automaticamente entre os dois dispositivos do casal.

**Componentes relacionados:**
- Página: `app/(dashboard)/tarefas/page.tsx`
- Card: `shared/components/features/TaskCard/TaskCard.tsx`
- Formulário: `shared/components/features/TaskForm/TaskForm.tsx`
- Tipos: `shared/types/task.types.ts`

---

## 10. Checklist por Mês

### `GET /checklist`
Retorna todas as tarefas, agrupadas por período (12, 9, 6, 3, 1 mês, 1 semana antes).

### `POST /checklist`
```json
{
  "periodo": "12_meses | 9_meses | 6_meses | 3_meses | 1_mes | 1_semana",
  "tarefa": "string",
  "concluida": false
}
```

### `PATCH /checklist/:id`
Marca tarefa como concluída/pendente.

---

## 10. Notificações

### `GET /notificacoes`
Lista notificações push enviadas/agendadas.

### `POST /notificacoes/registrar-dispositivo`
Registra token do dispositivo para push (FCM/APNs).
```json
{ "device_token": "string", "plataforma": "ios | android | web" }
```

> Gatilhos automáticos sugeridos (lado servidor / cron job):
> - X dias antes do casamento com pendências financeiras
> - Itens de fornecedores não pagos próximos da data
> - Confirmação final na semana do casamento

---

## 11. Convenções Gerais

- Todas as rotas (exceto `/auth/*`) exigem header `Authorization: Bearer <token>`
- Toda rota é escopada à conta do casal autenticado — nunca expor dados de outra conta
- Datas em formato ISO 8601 (`YYYY-MM-DD`)
- Valores monetários em número decimal (ex: `1500.00`), moeda BRL implícita
- Códigos de erro padrão: `400` (validação), `401` (não autenticado), `403` (sem permissão / limite de dispositivos), `404` (não encontrado), `500` (erro interno)

---

*Última atualização: gerado a partir da página "APP DE CASAMENTO — VISÃO COMPLETA" no Notion.*
