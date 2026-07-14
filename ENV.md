# ENV.md — Variáveis de Ambiente

> Nunca commitar valores reais. Este arquivo documenta apenas as **chaves** esperadas.
> Valores reais devem ficar em `.env` (local) e nas variáveis de ambiente da plataforma de deploy (ex: Vercel).
> Chaves e segredos reais ficam registrados separadamente na página "🔐 Credenciais & Chaves de API" do Notion — nunca aqui.

---

## 1. Aplicação Geral

```env
NODE_ENV=development | production
APP_URL=https://seuappdecasamento.com
API_BASE_URL=https://api.seuappdecasamento.com/v1
```

---

## 2. Banco de Dados

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## 3. Autenticação (JWT)

```env
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=30d
```

---

## 4. Notificações Push

```env
FCM_SERVER_KEY=
APNS_KEY_ID=
APNS_TEAM_ID=
APNS_PRIVATE_KEY=
```

---

## 5. IA — Manus IA

```env
MANUS_API_KEY=
MANUS_API_URL=
```

## 6. IA — Grok IA

```env
GROK_API_KEY=
GROK_API_URL=https://api.x.ai/v1
```

---

## 7. Armazenamento (imagens de fornecedores, trajes, manuais)

```env
STORAGE_PROVIDER=s3 | cloudinary | supabase
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_REGION=
```

---

## 8. Mobile (Expo / React Native)

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_ENV=development | production
```

---

## 9. Deploy (Vercel — Web)

```env
VERCEL_ENV=development | preview | production
```

---

## Checklist de configuração
- [ ] `.env.example` criado no repositório (sem valores reais)
- [ ] Variáveis configuradas no ambiente local (`.env`)
- [ ] Variáveis configuradas no painel da Vercel (produção)
- [ ] Chaves reais registradas na página "🔐 Credenciais & Chaves de API" do Notion

---

*Última atualização: gerado a partir da página "APP DE CASAMENTO — VISÃO COMPLETA" no Notion.*
