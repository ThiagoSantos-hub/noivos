# API.md — Endpoints da API

> Base URL (exemplo): `https://api.seuappdecasamento.com/v1`
> Autenticação: Bearer Token (JWT) — cada conta vinculada a exatamente 2 usuários (noiva + noivo)

---

## 1. Autenticação & Onboarding

### `POST /auth/register`
Cria a conta do casal (onboarding inicial).
```json
{
  "nome_noiva": "string",
  "nome_noivo": "string",
  "email_noiva": "string",
  "email_noivo": "string",
  "data_casamento": "YYYY-MM-DD",
  "orcamento_total": 0
}
```
**Resposta:** `201 Created` + tokens de acesso para ambos os emails.

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

## 9. Checklist por Mês

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
