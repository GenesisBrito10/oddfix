# Design System — Oddfix / Surebet

## 1. Concept and Style

Oddfix is a dark-mode-first sports arbitrage platform for Brazilian bettors. The visual language is deliberately austere: a near-black background family punctuated by a single vibrant mint green that signals profit, action, and live opportunity. Data density is high — the interface presents multiple numerical dimensions simultaneously — so the type system is optimized for scannable tabular layouts, not expressive reading. The overall aesthetic is professional fintech with a sharp, modern edge, communicating mathematical precision over gambling excitement.

**Keywords:** `dark-mode-first` · `data-dense` · `fintech-precision` · `monochromatic-base` · `mint-accent`

---

## 2. Color System

### Primitive Palette
| Token | HEX | RGB (0–1) | Usage |
|-------|-----|-----------|-------|
| `gray-950` | `#080b0f` | 0.031, 0.043, 0.059 | Page background |
| `gray-900` | `#0d0d0d` | 0.051, 0.051, 0.051 | Landing/marketing panel |
| `gray-875` | `#0e0e0e` | 0.055, 0.055, 0.055 | Bookie logo tiles, nested dark surfaces |
| `gray-850` | `#0e1116` | 0.055, 0.067, 0.086 | Nested surface panels |
| `gray-800` | `#15181e` | 0.082, 0.094, 0.118 | Sidebar, drawers, card backgrounds |
| `gray-700` | `#2c2f34` | 0.173, 0.184, 0.204 | Muted backgrounds, badge containers |
| `gray-500` | `#525252` | 0.322, 0.322, 0.322 | Divider label text |
| `gray-400` | `#71717a` | 0.443, 0.443, 0.478 | Secondary UI text, metadata |
| `gray-300` | `#a1a1aa` | 0.631, 0.631, 0.667 | Tertiary text |
| `gray-200` | `#e5e2e1` | 0.898, 0.886, 0.882 | Warm near-white body text |
| `gray-0` | `#ffffff` | 1, 1, 1 | Primary text, headlines |
| `green-500` | `#8bf2c1` | 0.545, 0.949, 0.757 | Primary brand accent — CTAs, active states |
| `green-400` | `#43e5b1` | 0.263, 0.898, 0.694 | Teal — profit glow, live indicator |
| `green-600` | `#01c896` | 0.004, 0.784, 0.588 | Deep green — links, "Liberada" badge |
| `yellow-400` | `#e0ea87` | 0.878, 0.918, 0.529 | Odds numbers, "Aguardando" state |

### Semantic Colors
| Role | Token | HEX | Description |
|------|-------|-----|-------------|
| Background | `color-bg-page` | `#080b0f` | Page/root background |
| Surface | `color-bg-card` | `#15181e` | Cards, sidebar, panels |
| Surface Nested | `color-bg-surface` | `#0e1116` | Nested surfaces within cards |
| Muted | `color-bg-muted` | `#2c2f34` | Badge containers, toggle bg |
| Brand Primary | `color-brand-primary` | `#8bf2c1` | CTAs, active nav, highlights |
| Brand Teal | `color-brand-teal` | `#43e5b1` | Profit glow, live status |
| Odds | `color-brand-odds` | `#e0ea87` | Numerical odds display |
| Text Primary | `color-text-primary` | `#ffffff` | Headlines, key data |
| Text Secondary | `color-text-secondary` | `#71717a` | Labels, metadata, sub-info |
| Text Tertiary | `color-text-tertiary` | `#a1a1aa` | Placeholder-level hints |
| Text Accent | `color-text-accent` | `#8bf2c1` | Links, interactive text |
| Text Profit | `color-text-profit` | `#43e5b1` | Profit figures, live data |
| Text On-Brand | `color-text-onBrand` | `#080b0f` | Text on green backgrounds |
| Border Default | `color-border-default` | `rgba(255,255,255,0.2)` | Inputs, card outlines |
| Border Subtle | `color-border-subtle` | `rgba(255,255,255,0.05)` | Dividers, faint separators |
| Border Active | `color-border-active` | `#8bf2c1` | Focus state, active input |
| Success BG | `color-success-bg` | `rgba(1,200,150,0.1)` | "Liberada" badge fill |
| Success Text | `color-success-text` | `#01c896` | Confirmed/released states |
| Warning BG | `color-warning-bg` | `rgba(255,209,102,0.1)` | "Aguardando" badge fill |
| Warning Text | `color-warning-text` | `#e0ea87` | Pending states |

---

## 3. Typography

### Typeface
- **Primary Font:** Inter — Humanist sans-serif · Used for all UI text, labels, body copy, and headings
- **Display Font:** Manrope — Geometric sans-serif · Used exclusively for numerical data (odds, profit values, calculator figures) — not defined in the official style library but consistently applied in data display contexts

### Type Scale (Official Style Library)
| Token | Size | Weight | Line Height | Letter Spacing | Case | Usage |
|-------|------|--------|-------------|----------------|------|-------|
| `text-h1` | 32px | 800 ExtraBold | 40px (1.25) | −1.6px | Normal | Page section titles |
| `text-h2` | 20px | 800 ExtraBold | 28px (1.4) | −0.5px | Normal | Card headers, modal titles |
| `text-h3` | 18px | 800 ExtraBold | 28px (1.56) | −0.9px | Normal | Sub-section headers |
| `text-body-lg` | 16px | 500 Medium | 24px (1.5) | 0 | Normal | Primary body text |
| `text-body-md` | 14px | 500 Medium | 20px (1.43) | 0 | Normal | Default UI text, table rows |
| `text-body-sm` | 12px | 500 Medium | 16px (1.33) | 0 | Normal | Secondary detail text |
| `text-label-lg` | 16px | 700 Bold | 24px (1.5) | −0.8px | UPPER | Primary action labels |
| `text-label-md` | 14px | 700 Bold | 20px (1.43) | 0 | Normal | Button labels, named values |
| `text-label-sm` | 11px | 700 Bold | 16.5px (1.5) | +0.55px | UPPER | Form field labels |
| `text-label-xs` | 10px | 700 Bold | 15px (1.5) | +1px | UPPER | Category overlines, badges |
| `text-numeric-lg` | 18px | 800 ExtraBold | 28px (1.56) | −0.9px | Normal | Key financial metrics |
| `text-numeric-md` | 16px | 700 Bold | 24px (1.5) | 0 | Normal | Secondary numeric data |
| `text-numeric-sm` | 12px | 700 Bold | 16px (1.33) | 0 | Normal | Small figures |

### Display Numbers (Manrope — Ad-hoc, not in style library)
| Usage | Size | Weight | Letter Spacing |
|-------|------|--------|----------------|
| Odds display in modal | 30px | 800 ExtraBold | −1.5px |
| Calculator input value | 24px | 800 ExtraBold | −1.2px |
| Profit badge (e.g. +8.86%) | 20px | 800 ExtraBold | −1.0px |
| Profit summary total | 18px | 800 ExtraBold | −0.9px |

### Typography Rules
- **Hierarchy:** Weight and size are the primary contrast levers; color is secondary. ExtraBold (800) is reserved for data-critical numbers and top-level headings. Medium (500) anchors readable body text.
- **Numeric distinction:** Manrope is used for bet odds and financial figures to visually separate mathematical data from prose labels.
- **Label convention:** Labels above form fields use `text-label-sm` (11px, Bold, UPPER, +0.55px tracking). Overline category headings use `text-label-xs` (10px, Bold, UPPER, +1px tracking).
- **Spacing tendency:** Tight. Heading letter-spacing is negative for display sizes; labels use positive tracking for legibility at small sizes.

---

## 4. Spacing and Layout

### Spacing Scale (Official Token Library)
| Token | Value | Usage |
|-------|-------|-------|
| `spacing-1` | 4px | Icon-to-label gaps, dot indicators |
| `spacing-2` | 8px | Inner button padding, tight element gaps |
| `spacing-3` | 12px | Compact list items, badge padding |
| `spacing-4` | 16px | Form field gaps, card inner sections |
| `spacing-5` | 20px | Sidebar section gaps |
| `spacing-6` | 24px | Card internal padding, section spacing |
| `spacing-7` | 32px | Major card padding, content area padding |
| `spacing-8` | 40px | Sidebar top sections, drawer section gaps |
| `spacing-9` | 48px | Page-level vertical padding (drawers, login form) |
| `spacing-10` | 64px | Hero spacing, top-level separation |

### Layout Rules
- **Base grid:** 4pt — all spacing values are multiples of 4px
- **Columns:** Flexible sidebar-content layout; no explicit column grid defined
- **Sidebar width:** ~220px fixed (left nav)
- **Drawer width:** 480px (right detail panel)
- **Page margins:** 32px horizontal (content area), 48px (drawers and login form)
- **Density:** Compact–medium. Dashboard tables and filter panels are compact; card sections use balanced spacing.
- **Alignment pattern:** Left-aligned content throughout; data values right-aligned in tables

---

## 5. Shapes and UI Language

### Border Radius (Official Token Library)
| Token | Value | Applied to |
|-------|-------|------------|
| `radius-xs` | 4px | Primary CTA buttons, filter pills, bookie tiles, small tags |
| `radius-sm` | 8px | Cards, form inputs, OAuth buttons, info panels |
| `radius-md` | 12px | Status badges, live indicator pills, toggle switches, dot indicators |
| `radius-lg` | 16px | Large panel containers |
| `radius-full` | 999px | Avatar circles, full-pill shapes |

### Strokes and Borders
- **Default border:** 1px · `rgba(255,255,255,0.2)` · Solid — used on inputs, card outlines, modal separators, OAuth buttons
- **Subtle divider:** 1px · `rgba(255,255,255,0.05)` · Solid — used on horizontal rule separators
- **Active/focus border:** 2px · `#8bf2c1` · Solid bottom-only — used on the calculator investment input
- **Accent outline button:** 1px · `#8bf2c1` · Solid — ghost button variant ("Abrir casas")
- **Usage:** Borders are used sparingly. Most card boundaries are implied by background color difference rather than explicit strokes.

### Component Style
- **Elevation approach:** Flat-to-layered. Pages use background-color stratification (3–4 levels of near-black) rather than box shadows for depth. Shadows reserved for the largest overlay surfaces.
- **Visual weight:** Light borders on dark surfaces; the near-black palette creates depth through tone, not decoration.
- **Consistency pattern:** All interactive surfaces share the same semi-transparent input background (`rgba(8,11,15,0.5)`) with `rgba(255,255,255,0.2)` border — creating a unified input/button family.

---

## 6. Visual Details

### Shadows (Official Effect Style Library)
| Token | CSS Value | Usage |
|-------|-----------|-------|
| `shadow-card` | `0 4px 24px rgba(0,0,0,0.4)` | Elevated card surfaces |
| `glow-brand` | `0 0 8px rgba(67,229,177,0.6)` | Brand glow on key interactive elements |
| `glow-brand-lg` | `0 0 24px rgba(67,229,177,0.4)` | Larger brand glow for emphasis |
| `shadow-overlay` | `inset 0 1px 0 rgba(255,255,255,0.05)` | Subtle top-edge highlight on overlays |

### Additional Shadows (Screen-level, not in library)
| Usage | Value |
|-------|-------|
| Primary CTA button glow | `0 10px 15px -3px rgba(192,245,0,0.1), 0 4px 6px -4px rgba(192,245,0,0.1)` |
| Progress bar fill glow | `0 0 15px rgba(200,255,0,0.3)` |
| Metric card | `0 1px 2px rgba(0,0,0,0.05)` |

### Decorative Elements
- **Gradients:** None used. Color transitions achieved through layered solid backgrounds.
- **Background mesh:** A single large circle (`rgba(1,200,150,0.1)`, 800px, 80px blur) placed off-screen on the landing page creates a subtle green ambient glow — the only decorative effect in the system.
- **Blur / Backdrop:** `backdrop-blur: 4px` on the login trust badge footer bar. `blur: 10px` for the modal backdrop overlay on dashboard content.
- **Noise / Texture:** None.
- **Glow / Highlight:** Brand glow (`glow-brand`) appears on profit figures and progress bars. CTA button carries a subtle chartreuse glow shadow. These are used intentionally to draw attention to financial outcomes.

---

## 7. Contrast and Accessibility

- **Contrast level:** High — primary text on page background achieves ~16:1 (WCAG AAA)
- **Primary text contrast:** `#ffffff` on `#080b0f` ≈ 16:1
- **Secondary text contrast:** `#71717a` on `#080b0f` ≈ 4.6:1 (WCAG AA for normal text)
- **Brand green contrast:** `#8bf2c1` on `#080b0f` ≈ 9:1 (AAA)
- **Odds yellow contrast:** `#e0ea87` on `#080b0f` ≈ 11:1 (AAA)
- **Caution zone:** `#525252` (divider label text, ~3.5:1) — below AA for small text; acceptable for decorative divider labels but should not carry critical information
- **Color-only signals:** Used with caution. "Liberada" (green) and "Aguardando" (yellow) badges rely on color but include text labels — compliant.
- **Focus states:** Not fully defined in the design file. Active border token (`#8bf2c1`) should be implemented as a focus ring for keyboard navigation.

---

## 8. Component Patterns

### Buttons
- **Primary:** `bg #8bf2c1` · text `#080b0f` · `radius-xs (4px)` · py-16px · Bold 16px · Glow shadow on hover. Full-width in forms; fixed-width with icon in dashboard header.
- **Outline/Ghost:** `border 1px #8bf2c1` · text `#8bf2c1` · `radius-xs (4px)` · py-9px · SemiBold 12px. Used for secondary actions in modals ("Abrir casas →").
- **Dark/Neutral:** `bg rgba(8,11,15,0.5)` border `rgba(255,255,255,0.2)` · `radius-sm (8px)` · icon-only or icon+label. Used for OAuth login buttons.
- **Filter pill:** Dark bg, `radius-xs (4px)` · SemiBold 14px · Active state highlighted with brand green bg.
- **Size variants:** lg (py-16px, 16px text), md (py-9–10px, 12–14px text), icon-only (fixed square, no py variance)

### Inputs
| State | Background | Border | Notes |
|-------|------------|--------|-------|
| Default | `rgba(8,11,15,0.5)` | 1px `rgba(255,255,255,0.2)` | `radius-sm`, left icon, py-13px pl-40px |
| Focus (calculator) | Transparent | 2px bottom `#8bf2c1` | Underline style only |
| Placeholder | — | — | `#404040` placeholder text |
| Disabled | — | — | Not defined; infer reduced opacity |
| Error | — | — | Not found; recommend 1px `color-error` border |

### Cards
- **Surebet card (primary):** `bg #15181e` · `radius-sm (8px)` · p-24–32px · no border · `shadow-card` for elevation
- **Bookie tile:** `bg #0e0e0e` · `radius-xs (4px)` · px-9px py-21px · no border · grid-6-col layout
- **Stat card (affiliate):** `bg #15181e` · `radius-sm (8px)` · p-20–24px · no border · value in Manrope ExtraBold 24px
- **Detail card (modal):** `bg #080b0f` · `radius-sm (8px)` · p-17px · no border · contains odds + stake breakdown

### Status Badges
| State | Background | Text Color | Shape |
|-------|------------|------------|-------|
| Liberada (success) | `rgba(1,200,150,0.1)` | `#01c896` | `radius-xs`, px-8px py-4px |
| Aguardando (warning) | `rgba(255,209,102,0.1)` | `#e0ea87` | `radius-xs`, px-8px py-4px |
| Live (pulse) | `#2c2f34` | `#8bf2c1` | `radius-md (12px)`, animated dot + text |
| Profit % | `#8bf2c1` bg | `#080b0f` | `radius-sm (8px)`, icon prefix |

### Navigation
- **Top nav:** Horizontal tabs — "PRE-LIVE" / "LIVE" with underline active indicator; platform/affiliate toggle as a pill switcher
- **Sidebar nav:** Left-aligned icon+label links; active item highlighted with `bg #8bf2c1` text `#080b0f` `radius-xs`
- **Active state pattern:** Brand green background fill for active nav items; no border or underline

### Toggle / Switch
- **On:** `bg #8bf2c1` · `radius-full` · 40×20px · knob `#080b0f` right-aligned
- **Off:** (not shown) — infer `bg #2c2f34`

### Progress Bar
- **Track:** `bg #353534` (not in token system — recommend `color-bg-muted`)
- **Fill:** `bg #8bf2c1` · glow: `0 0 15px rgba(200,255,0,0.3)`
- **Labels:** percentage right-aligned, `text-label-xs`, secondary text color

---

## 9. Design Decisions and Exceptions

| Issue | Found In | Recommendation |
|-------|----------|----------------|
| Hero text 43px not in style library | Login — marketing panel | Add as `text-display` (43px, ExtraBold, −2.4px LS) or treat as a one-off and don't tokenize |
| "Bem-vindo de volta" is 30px, style library H1 is 32px | Login form heading | Standardize to `text-h1` (32px) or add `text-h0` (30px) as a defined step |
| Manrope used for display numbers but has no text style definitions | Modal, calculator, affiliate dashboard | Define official `Numeric/Display` styles using Manrope in the style library |
| Button radius inconsistency: 4px (login CTA) vs 8px (affiliate button) | Login + Affiliate | Decide on one radius for primary buttons; recommend `radius-xs (4px)` per the token |
| CTA button glow uses `rgba(192,245,0,0.1)` (chartreuse) not brand green | Login button, affiliate button | Align to `glow-brand` style or create a dedicated `glow-cta` effect style |
| `#0d0d0d` on login left panel vs `#080b0f` page bg token | Login screen | Use `color-bg-page` (`#080b0f`) for consistency; difference is imperceptible |
| Progress bar track `#353534` not in color token system | Affiliate dashboard | Map to `color-bg-muted` (`#2c2f34`) or add a `color-bg-track` primitive |
| `color/bg/card` and `color/bg/sidebar` are the same value (`#15181e`) | Variable definitions | Merge into one token or keep separate for semantic clarity |
| Focus ring for keyboard navigation not defined | All interactive elements | Implement focus ring using `color-border-active` (`#8bf2c1`) as 2px outline |

---

*Generated by Claude Code — Figma MCP Extraction*  
*Source file: Oddfix — Surebet (`eHFqIQPbCSg4lxqFZk1hQQ`)*  
*Screens analyzed: Login · Dashboard · Opportunity Modal · Affiliate Dashboard*  
*File: `design-system.md`*