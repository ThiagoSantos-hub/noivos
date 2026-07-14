# Noivos - TODO

## Tela de Onboarding (MVP - Item 1)

### Funcionalidades Principais
- [x] Criar componente OnboardingForm com formulário de cadastro do casal
- [x] Implementar campos do formulário: nome_noiva, nome_noivo, email_noiva, email_noivo, data_casamento, orcamento_total
- [x] Criar validações robustas para todos os campos
- [x] Implementar barra de progresso verde no topo
- [x] Adicionar feedback visual (loading, erro, sucesso)
- [ ] Integrar com endpoint POST /auth/register (backend)
- [ ] Redirecionar para Dashboard após sucesso
- [x] Seguir DESIGN-SYSTEM.md rigorosamente

### Componentes Criados
- [x] OnboardingPage.tsx - Página principal do onboarding (`app/(auth)/cadastro/page.tsx`)
- [x] OnboardingForm.tsx - Componente do formulário (`shared/components/features/OnboardingForm.tsx`)
- [x] ProgressBar.tsx - Barra de progresso verde (`shared/components/ui/ProgressBar.tsx`)
- [x] Button.tsx - Componente de botão reutilizável (`shared/components/ui/Button.tsx`)
- [x] Input.tsx - Componente de input reutilizável (`shared/components/ui/Input.tsx`)

### Tipos e Validações
- [x] Criar tipos para CoupleRegistration (`shared/types/couple.types.ts`)
- [x] Implementar validações de email (formato + distinctos)
- [x] Implementar validações de data (futura)
- [x] Implementar validações de orçamento (numérico > 0)
- [x] Criar arquivo de validações (`shared/utils/validations.ts`)

### Integração com API
- [ ] Criar procedure tRPC para POST /auth/register
- [ ] Implementar chamada à API com tratamento de erros
- [ ] Configurar redirecionamento pós-sucesso

### Documentação
- [x] Atualizar COMPONENTS.md com novos componentes
- [x] Atualizar API.md com detalhes da implementação
- [x] Criar estrutura de pastas seguindo ARCHITECTURE.md

### Próximas Etapas
- [ ] Implementar backend do endpoint POST /auth/register
- [ ] Integrar com Supabase Auth
- [ ] Criar tabela `couples` no banco de dados
- [ ] Testar fluxo completo de onboarding
- [ ] Implementar tela de login
- [ ] Implementar tela do Dashboard

---

*Última atualização: Julho 2026 | Projeto: Noivos | Status: Onboarding frontend implementado*
