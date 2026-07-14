# DESIGN-SYSTEM.md — Padrão Visual do App

> Referência visual: inspirado no [Reportei](https://app.reportei.com) — clean, branco, cards com sombra suave, azul + verde como cores de ação.

---

## 1. Paleta de Cores

### Cores base
| Nome | Hex | Uso |
|---|---|---|
| Fundo (background) | `#FFFFFF` | Fundo geral das telas |
| Azul principal (dark) | `#1E3A8A` | Títulos, ícones ativos, elementos de destaque |
| Azul principal (padrão) | `#2563EB` | Links, botões secundários, elementos interativos |
| Azul claro (cards) | `#EFF6FF` | Fundo de cards, seções destacadas, badges neutras |
| Verde CTA (escuro) | `#16A34A` | Hover / estado pressionado dos botões primários |
| Verde CTA (padrão) | `#22C55E` | Botões primários, indicadores de sucesso |
| Texto principal | `#1E293B` | Títulos e textos de maior importância |
| Texto secundário | `#64748B` | Subtítulos, legendas, texto de apoio |

### Cores de status (alertas)
| Status | Cor | Hex sugerido | Uso |
|---|---|---|---|
| 🟢 Tranquilo | Verde | `#22C55E` | Tudo em dia, sem pendências |
| 🟡 Atenção | Amarelo | `#F59E0B` | Prazo se aproximando, pendência leve |
| 🔴 Urgente | Vermelho | `#EF4444` | Prazo vencido ou pendência crítica |

---

## 2. Tipografia

- **Família:** Sans-serif limpa (ex: Inter, SF Pro, Roboto — a definir na implementação)
- **Hierarquia sugerida:**
  - Título de tela (H1): 24–28px, bold, `#1E293B`
  - Título de seção (H2): 18–20px, semibold, `#1E293B`
  - Corpo de texto: 14–16px, regular, `#1E293B`
  - Texto secundário/legenda: 12–13px, regular, `#64748B`

---

## 3. Componentes

### Cards
- Bordas arredondadas (`border-radius: 12–16px`)
- Sombra suave (`box-shadow: 0 2px 8px rgba(0,0,0,0.06)`)
- Fundo branco `#FFFFFF` ou azul claro `#EFF6FF` para destaque

### Botões
- **Primário:** fundo verde sólido `#22C55E`, texto branco, cantos arredondados
  - Hover/pressed: `#16A34A`
- **Secundário:** fundo transparente, contorno azul `#2563EB`, texto azul
  - Hover: fundo `#EFF6FF`

### Badges (status)
- Pílula arredondada (`border-radius: full`)
- Verde `#22C55E` / Amarelo `#F59E0B` / Vermelho `#EF4444`
- Texto branco ou escuro, dependendo do contraste

### Barra de progresso
- Fina, no topo das telas (ex: onboarding, dashboard)
- Cor de preenchimento: verde `#22C55E`
- Fundo da trilha: cinza claro `#E2E8F0`

### Toggle Switches
- Estilo iOS (pill, bolinha deslizante)
- Estado ativo: verde `#22C55E`
- Estado inativo: cinza `#CBD5E1`

---

## 4. Ícones e Emojis
- Uso de emojis nativos para reforçar contexto visual (💍 🟢 🟡 🔴 👗 🤵 💸 ✅)
- Ícones de UI: linha fina (outline), estilo minimalista, cor `#64748B` (inativo) / `#2563EB` (ativo)

---

## 5. Espaçamento
- Grid base de 4px (usar múltiplos: 4, 8, 12, 16, 24, 32px)
- Padding padrão de card: 16–20px
- Espaçamento entre seções: 24–32px

---

## 6. Aplicação por Tela (resumo)
| Tela | Elementos-chave do design |
|---|---|
| Onboarding | Barra de progresso verde fina no topo, inputs com bordas arredondadas |
| Dashboard | 2 barras de progresso (countdown + financeiro), badges coloridas de alerta |
| Fornecedores | Cards em lista com valor total/pago/status (badge) |
| Trajes & Pessoas | Cards por pessoa/item com ícone representativo |
| Checklist por mês | Lista com checkboxes estilo iOS, agrupada por período |

---

*Última atualização: gerado a partir da página "APP DE CASAMENTO — VISÃO COMPLETA" no Notion.*
