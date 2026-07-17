# ENV.md — Variáveis de Ambiente

> **Nunca** commitar valores reais em texto puro no repositório.
> Valores reais devem ficar **somente** em:
> - `.env` / `.env.local` (local — nunca versionado)
> - Variáveis de ambiente da Vercel (produção e preview)
> - Secrets do Notion / gerenciador de senhas do time
>
> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` e `DATABASE_URL` **nunca** devem ser commitados. Copie manualmente do dashboard do Supabase.

---

## 1. Aplicação Geral

```env
NODE_ENV=development
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 2. Supabase — PRODUÇÃO

Projeto: `app-casamento` — região `sa-east-1` (São Paulo)

```env
NEXT_PUBLIC_SUPABASE_URL=https://gbmlhrvmkqwelgomxenk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<< cole a anon key do dashboard >>
SUPABASE_SERVICE_ROLE_KEY=<< cole a service_role key do dashboard >>
DATABASE_URL=<< connection string do dashboard >>
```

---

## 3. Supabase — STAGING

Projeto: `app-casamento-staging` — região `sa-east-1` (São Paulo)

```env
NEXT_PUBLIC_SUPABASE_URL=https://yqhhznojfmtdhqacehsc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<< cole a anon key do dashboard >>
SUPABASE_SERVICE_ROLE_KEY=<< cole a service_role key do dashboard >>
DATABASE_URL=<< connection string do dashboard >>
```

---

## 4. E-mail Transacional — Brevo

```env
BREVO_API_KEY=<< sua chave Brevo >>
BREVO_SENDER_NAME=Noivos
BREVO_SENDER_EMAIL=seu-email-verificado@dominio.com
```

---

## 5. Autenticação (se usar JWT próprio no futuro)

```env
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=30d
```

---

## 6. Notificações Push (futuro)

```env
FCM_SERVER_KEY=
APNS_KEY_ID=
APNS_TEAM_ID=
APNS_PRIVATE_KEY=
```

---

## 7. IA (opcional)

```env
MANUS_API_KEY=
GROK_API_KEY=
GROK_API_URL=https://api.x.ai/v1
```

---

## 8. Armazenamento

> Preferir Supabase Storage.

```env
STORAGE_PROVIDER=supabase
STORAGE_BUCKET=
```

---

## 9. Mobile (quando existir)

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_ENV=development
```

---

## Checklist de configuração

- [x] Projeto Supabase de produção criado
- [x] Projeto Supabase de staging criado
- [x] `.env.example` criado no repositório (sem valores reais)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` e `DATABASE_URL` configuradas na Vercel
- [ ] Variáveis configuradas no ambiente local (`.env.local`)
- [ ] Variáveis configuradas no painel da Vercel (produção e preview)
- [ ] Chaves reais registradas apenas no gerenciador de segredos / Notion privado

---

*Última atualização: 17/07/2026 | Projeto: Noivos | Limpeza de segurança*
