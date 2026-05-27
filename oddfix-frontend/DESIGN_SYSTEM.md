# Design System — Oddfix / Surebet

## 1. Conceito e Estilo

Oddfix é uma plataforma de arbitragem esportiva dark-mode-first para apostadores brasileiros. A linguagem visual é intencionalmente austera: uma família de fundos quase negros pontuada por um único verde menta vibrante que sinaliza lucro, ação e oportunidade ao vivo. A densidade de dados é alta — a interface apresenta múltiplas dimensões numéricas simultaneamente — por isso o sistema tipográfico é otimizado para layouts tabulares escaneáveis, não leitura expressiva. A estética geral é fintech profissional com um toque moderno e afiado, comunicando precisão matemática acima da emoção do jogo.

**Keywords:** `dark-mode-first` · `data-dense` · `fintech-precision` · `monochromatic-base` · `mint-accent`

---

## 2. Sistema de Cores

### Paleta Primitiva
| Token | HEX | Uso |
|-------|-----|-----|
| `gray-950` | `#080b0f` | Fundo da página |
| `gray-900` | `#0d0d0d` | Painel landing/marketing |
| `gray-875` | `#0e0e0e` | Tiles de logo de bookmaker, superfícies aninhadas escuras |
| `gray-850` | `#0e1116` | Painéis de superfície aninhada |
| `gray-800` | `#15181e` | Sidebar, drawers, fundos de card |
| `gray-700` | `#2c2f34` | Fundos abafados, containers de badge |
| `gray-500` | `#525252` | Texto de label divisor |
| `gray-400` | `#71717a` | Texto UI secundário, metadata |
| `gray-300` | `#a1a1aa` | Texto terciário |
| `gray-200` | `#e5e2e1` | Texto corpo quente quase branco |
| `gray-0` | `#ffffff` | Texto primário, headlines |
| `green-500` | `#8bf2c1` | Acento de marca primário — CTAs, estados ativos |
| `green-400` | `#43e5b1` | Teal — brilho de lucro, indicador live |
| `green-600` | `#01c896` | Verde profundo — links, badge "Liberada" |
| `yellow-400` | `#e0ea87` | Números de odds, estado "Aguardando" |

### Cores Semânticas
| Papel | HEX | Descrição |
|-------|-----|-----------|
| Background Page | `#080b0f` | Fundo/root da página |
| Surface Card | `#15181e` | Cards, sidebar, painéis |
| Surface Nested | `#0e1116` | Superfícies aninhadas dentro de cards |
| Muted BG | `#2c2f34` | Containers de badge, fundo de toggle |
| Brand Primary | `#8bf2c1` | CTAs, nav ativa, destaques |
| Brand Teal | `#43e5b1` | Brilho de lucro, status live |
| Odds | `#e0ea87` | Display numérico de odds |
| Text Primary | `#ffffff` | Headlines, dados-chave |
| Text Secondary | `#71717a` | Labels, metadata, sub-info |
| Text Tertiary | `#a1a1aa` | Hints no nível de placeholder |
| Text Accent | `#8bf2c1` | Links, texto interativo |
| Text Profit | `#43e5b1` | Figuras de lucro, dados ao vivo |
| Text On-Brand | `#080b0f` | Texto em fundos verdes |
| Border Default | `rgba(255,255,255,0.2)` | Inputs, contornos de card |
| Border Subtle | `rgba(255,255,255,0.05)` | Divisores, separadores suaves |
| Border Active | `#8bf2c1` | Estado de foco, input ativo |
| Success BG | `rgba(1,200,150,0.1)` | Fill do badge "Liberada" |
| Success Text | `#01c896` | Estados confirmados/liberados |
| Warning BG | `rgba(255,209,102,0.1)` | Fill do badge "Aguardando" |
| Warning Text | `#e0ea87` | Estados pendentes |

---

## 3. Tipografia

### Fontes
- **Fonte Primária:** Inter — Sans-serif humanista · Usado para todo texto de UI, labels, body copy e headings
- **Fonte Display:** Manrope — Sans-serif geométrica · Usado exclusivamente para dados numéricos (odds, valores de lucro, figuras da calculadora)

### Escala de Tipos
| Token | Tamanho | Peso | Altura de Linha | Espaçamento | Caso | Uso |
|-------|---------|------|-----------------|-------------|------|-----|
| `text-h1` | 32px | 800 ExtraBold | 40px | −1.6px | Normal | Títulos de seção de página |
| `text-h2` | 20px | 800 ExtraBold | 28px | −0.5px | Normal | Headers de card, títulos de modal |
| `text-h3` | 18px | 800 ExtraBold | 28px | −0.9px | Normal | Headers de sub-seção |
| `text-body-lg` | 16px | 500 Medium | 24px | 0 | Normal | Texto corpo primário |
| `text-body-md` | 14px | 500 Medium | 20px | 0 | Normal | Texto UI padrão, linhas de tabela |
| `text-body-sm` | 12px | 500 Medium | 16px | 0 | Normal | Texto de detalhe secundário |
| `text-label-lg` | 16px | 700 Bold | 24px | −0.8px | UPPER | Labels de ação primária |
| `text-label-md` | 14px | 700 Bold | 20px | 0 | Normal | Labels de botão, valores nomeados |
| `text-label-sm` | 11px | 700 Bold | 16.5px | +0.55px | UPPER | Labels de campo de formulário |
| `text-label-xs` | 10px | 700 Bold | 15px | +1px | UPPER | Overlines de categoria, badges |
| `text-numeric-lg` | 18px | 800 ExtraBold | 28px | −0.9px | Normal | Métricas financeiras-chave |
| `text-numeric-md` | 16px | 700 Bold | 24px | 0 | Normal | Dados numéricos secundários |
| `text-numeric-sm` | 12px | 700 Bold | 16px | 0 | Normal | Figuras pequenas |

---

## 4. Espaçamento e Layout

### Escala de Espaçamento
| Token | Valor | Uso |
|-------|-------|-----|
| `spacing-1` | 4px | Gaps ícone-para-label, indicadores de ponto |
| `spacing-2` | 8px | Padding interno de botão, gaps de elemento apertados |
| `spacing-3` | 12px | Itens de lista compactos, padding de badge |
| `spacing-4` | 16px | Gaps de campo de formulário, seções internas de card |
| `spacing-5` | 20px | Gaps de seção do sidebar |
| `spacing-6` | 24px | Padding interno de card, espaçamento de seção |
| `spacing-7` | 32px | Padding de card principal, padding de área de conteúdo |
| `spacing-8` | 40px | Seções superiores do sidebar, gaps de seção do drawer |
| `spacing-9` | 48px | Padding vertical nível de página |
| `spacing-10` | 64px | Espaçamento hero, separação de nível superior |

### Regras de Layout
- **Grid base:** 4pt — todos os valores de espaçamento são múltiplos de 4px
- **Largura do Sidebar:** ~220px fixo (nav esquerda)
- **Largura do Drawer:** 480px (painel de detalhe direito)
- **Margens da Página:** 32px horizontal (área de conteúdo), 48px (drawers e formulário de login)
- **Densidade:** Compacta-média. Tabelas do dashboard e painéis de filtro são compactos; seções de card usam espaçamento equilibrado.
- **Padrão de alinhamento:** Conteúdo alinhado à esquerda; valores de dados alinhados à direita em tabelas

---

## 5. Formas e Linguagem de UI

### Raio de Borda
| Token | Valor | Aplicado em |
|-------|-------|-------------|
| `radius-xs` | 4px | Botões CTA primários, pills de filtro, tiles de bookie, tags pequenas |
| `radius-sm` | 8px | Cards, inputs de formulário, botões OAuth, painéis de informação |
| `radius-md` | 12px | Badges de status, pills de indicador live, switches de toggle, indicadores de ponto |
| `radius-lg` | 16px | Containers de painel grande |
| `radius-full` | 999px | Círculos de avatar, shapes full-pill |

### Traços e Bordas
- **Borda padrão:** 1px · `rgba(255,255,255,0.2)` · Sólida — usada em inputs, contornos de card, separadores de modal
- **Divisor sutil:** 1px · `rgba(255,255,255,0.05)` · Sólida — usada em separadores de regra horizontal
- **Borda ativa/foco:** 2px · `#8bf2c1` · Sólida apenas na parte inferior — usada no input de investimento da calculadora
- **Botão ghost de contorno:** 1px · `#8bf2c1` · Sólida — variante de botão ghost

### Estilo de Componente
- **Abordagem de elevação:** Flat-to-layered. Páginas usam estratificação de cor de fundo (3–4 níveis de quase-preto) em vez de box shadows para profundidade.
- **Peso visual:** Bordas leves em superfícies escuras; a paleta quase-preta cria profundidade por tom, não por decoração.

---

## 6. Detalhes Visuais

### Sombras
| Token | Valor CSS | Uso |
|-------|-----------|-----|
| `shadow-card` | `0 4px 24px rgba(0,0,0,0.4)` | Superfícies de card elevadas |
| `glow-brand` | `0 0 8px rgba(67,229,177,0.6)` | Brilho de marca em elementos interativos-chave |
| `glow-brand-lg` | `0 0 24px rgba(67,229,177,0.4)` | Brilho de marca maior para ênfase |
| `shadow-overlay` | `inset 0 1px 0 rgba(255,255,255,0.05)` | Destaque sutil de borda superior em overlays |

### Animações
- **Entrada de card:** opacity 0→1, translateY 20→0, stagger 0.05s por item
- **Hover de card:** scale 1.005, translateY -2px, transition 200ms ease
- **Contador live:** incremento animado a cada ~5s
- **Pulse de novo sinal:** ring verde pulsante por 2s
- **Transição de tab:** underline slide animado
- **Toggle de plataforma:** background slide com spring physics

---

## 7. Padrões de Componente

### Botões
- **Primário:** `bg #8bf2c1` · texto `#080b0f` · `radius-xs (4px)` · py-16px · Bold 16px
- **Outline/Ghost:** `border 1px #8bf2c1` · texto `#8bf2c1` · `radius-xs (4px)`
- **Escuro/Neutro:** `bg rgba(8,11,15,0.5)` borda `rgba(255,255,255,0.2)` · `radius-sm (8px)`
- **Pill de filtro:** bg escuro, `radius-xs (4px)` · SemiBold 14px · Estado ativo destacado com bg verde de marca

### Cards de Surebet
- **Card primário:** `bg #15181e` · `radius-sm (8px)` · p-24px · sem borda · `shadow-card`
- **Legs de aposta:** `bg rgba(8,11,15,0.5)` · `radius-sm (8px)` · divisores verticais sutis

### Badges de Status
| Estado | Fundo | Cor do Texto | Forma |
|--------|-------|--------------|-------|
| Liberada (sucesso) | `rgba(1,200,150,0.1)` | `#01c896` | `radius-xs`, px-8px py-4px |
| Aguardando (aviso) | `rgba(255,209,102,0.1)` | `#e0ea87` | `radius-xs`, px-8px py-4px |
| Live (pulse) | `#2c2f34` | `#8bf2c1` | `radius-md (12px)`, dot animado |
| Lucro % | borda `#8bf2c1` | `#ffffff` | `radius-md (12px)` |

### Navegação
- **Nav superior:** Tabs horizontais com indicador underline ativo
- **Nav sidebar:** Links ícone+label alinhados à esquerda; item ativo destacado com `bg #8bf2c1` texto `#080b0f` `radius-xs`
- **Toggle plataforma/afiliado:** Pill switcher com slide animado

---

## 8. Decisões de Design e Exceções

| Problema | Encontrado em | Recomendação |
|----------|---------------|--------------|
| Manrope usado para números de display sem definições de estilo de texto | Modal, calculadora, dashboard afiliado | Definir estilos oficiais `Numeric/Display` usando Manrope |
| Inconsistência de raio de botão: 4px (CTA login) vs 8px (botão afiliado) | Login + Afiliado | Decidir por um raio; recomendo `radius-xs (4px)` |
| Brilho do botão CTA usa `rgba(192,245,0,0.1)` (chartreuse) não verde de marca | Botão login | Alinhar ao estilo `glow-brand` ou criar efeito `glow-cta` dedicado |
| Anel de foco para navegação por teclado não definido | Todos elementos interativos | Implementar anel de foco usando `color-border-active` (`#8bf2c1`) como outline de 2px |

---

*Referência do Design System — Oddfix Surebet*  
*Telas analisadas: Login · Dashboard Principal · Modal de Oportunidade · Dashboard de Afiliados*  
*Versão: 1.0.0*
