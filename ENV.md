# ENV.md — Variáveis de Ambiente

> Nunca commitar valores reais em texto puro num repositório público.
> Valores reais devem ficar em `.env` (local) e nas variáveis de ambiente da plataforma de deploy (Vercel).
> ⚠️ `SERVICE_ROLE_KEY` e `DATABASE_URL` (senha do banco) **não são expostas por integração automática** — copie manualmente do dashboard do Supabase (Project Settings → API / Database) e cole nos campos indicados abaixo.

---

## 1. Aplicação Geral

```env
NODE_ENV=development | production
APP_URL=https://seuappdecasamento.com
API_BASE_URL=https://api.seuappdecasamento.com/v1
```

---

## 2. Supabase — PRODUÇÃO (main)

Projeto: `app-casamento` — região `sa-east-1` (São Paulo)

```env
SUPABASE_URL=https://gbmlhrvmkqwelgomxenk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibWxocnZta3F3ZWxnb214ZW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDYzODMsImV4cCI6MjA5OTYyMjM4M30.MsGPO1ctUlwr1-9QmJMa4Y4CXQQR6OeMLDojdIMKB2E
SUPABASE_PUBLISHABLE_KEY=sb_publishable_qw3_UJLWwI--eOtI4eeQQg_MkeHUcyX
SUPABASE_SERVICE_ROLE_KEY=<< copiar manualmente do dashboard: Project Settings → API >>
DATABASE_URL=<< copiar manualmente do dashboard: Project Settings → Database → Connection string >>
```

---

## 3. Supabase — STAGING

Projeto: `app-casamento-staging` — região `sa-east-1` (São Paulo)

```env
SUPABASE_URL=https://yqhhznojfmtdhqacehsc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaGh6bm9qZm10ZGhxYWNlaHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNDY1ODMsImV4cCI6MjA5OTYyMjU4M30.p5LctKirkFAfN8VGweMrxeOu0-57OmmEVI5_kU8CI8Y
SUPABASE_PUBLISHABLE_KEY=sb_publishable_EwhnuAlOWL0-uCHateiAxw_TMZlrPlw
SUPABASE_SERVICE_ROLE_KEY=<< copiar manualmente do dashboard: Project Settings → API >>
DATABASE_URL=<< copiar manualmente do dashboard: Project Settings → Database → Connection string >>
```

---

## 4. Autenticação (JWT)

```env
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=30d
```

---

## 5. Notificações Push

```env
FCM_SERVER_KEY=
APNS_KEY_ID=
APNS_TEAM_ID=
APNS_PRIVATE_KEY=
```

---

## 6. IA — Manus IA

```env
MANUS_API_KEY=
MANUS_API_URL=
```

## 7. IA — Grok IA

```env
GROK_API_KEY=
GROK_API_URL=https://api.x.ai/v1
```

---

## 8. Armazenamento (imagens de fornecedores, trajes, manuais)

> Recomendado usar o próprio Supabase Storage (já incluso no projeto acima), a menos que prefira outro provedor.

```env
STORAGE_PROVIDER=supabase | s3 | cloudinary
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_REGION=
```

---

## 9. Mobile (Expo / React Native)

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_ENV=development | production
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 10. Deploy (Vercel — Web)

Time: `Thiago-noivos` (`team_wvB1lhYW9E7UmAyPxFFOK9Wg`)

```env
VERCEL_ENV=development | preview | production
```

---

## Checklist de configuração
- [x] Projeto Supabase de produção criado (`app-casamento`)
- [x] Projeto Supabase de staging criado (`app-casamento-staging`)
- [ ] `.env.example` criado no repositório (sem valores reais)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` e `DATABASE_URL` copiadas manualmente (produção + staging)
- [ ] Variáveis configuradas no ambiente local (`.env`)
- [ ] Variáveis configuradas no painel da Vercel (produção e preview/staging)
- [ ] Chaves reais registradas na página "🔐 Credenciais & Chaves de API" do Notion

---

*Última atualização: gerado a partir da página "APP DE CASAMENTO — VISÃO COMPLETA" no Notion + integração ativa com Supabase e Vercel.*

---

## 11. E-mail Transacional — Brevo

```env
BREVO_API_KEY=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
BREVO_SENDER_NAME=Noivos
BREVO_SENDER_EMAIL=digitalalpha24@gmail.com
```

143	---
144	
145	## 12. Pagamentos — Asaas
146	
147	```env
148	ASAAS_API_KEY=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
149	ASAAS_API_URL=https://www.asaas.com/api/v3
150	PLAN_PRICE=9.90
151	```
152	
