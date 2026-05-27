<template>
  <div class="bookmaker-logo" :style="logoStyle">{{ glyph }}</div>
</template>

<script setup lang="ts">
// Colored chip with a short glyph, matching the React design's BookmakerLogo.
// Curated tints for known houses + deterministic fallback for the rest.
const props = withDefaults(
  defineProps<{ bookmakerName: string; size?: 'sm' | 'md' | 'lg' | number | string }>(),
  { size: 'md' },
)

const TINTS: Record<string, { bg: string; glyph?: string }> = {
  Blaze: { bg: '#FF4D2D', glyph: '◉' },
  Bet365: { bg: '#0F7C3A', glyph: '365' },
  Betano: { bg: '#FF6A00', glyph: 'B' },
  Stake: { bg: '#1B2330', glyph: 'S' },
  Pinnacle: { bg: '#D4202A', glyph: 'P' },
  Betfair: { bg: '#FFB80C', glyph: 'BF' },
  Novibet: { bg: '#1C2F6F', glyph: 'N' },
  Superbet: { bg: '#E11D48', glyph: 'SB' },
  Bet7k: { bg: '#7C5CFF', glyph: '7k' },
  BetNacional: { bg: '#FACC15', glyph: 'bN' },
  Betnacional: { bg: '#FACC15', glyph: 'bN' },
  KTO: { bg: '#0EA5E9', glyph: 'K' },
  ParliMatch: { bg: '#FACC15', glyph: 'P' },
  SportingBet: { bg: '#FACC15', glyph: 'SB' },
  EstrelaBet: { bg: '#1F3A8A', glyph: '★' },
  VaideBet: { bg: '#10B981', glyph: 'V' },
  EsportesDaSorte: { bg: '#16A34A', glyph: 'ES' },
  'Esportes da Sorte': { bg: '#16A34A', glyph: 'ES' },
  '1xBet': { bg: '#1E3A8A', glyph: '1x' },
  Betpix365: { bg: '#22C55E', glyph: 'bp' },
  Galerabet: { bg: '#8B5CF6', glyph: 'G' },
  Pixbet: { bg: '#00B884', glyph: 'px' },
  OnaBet: { bg: '#F43F5E', glyph: 'O' },
  REALS: { bg: '#2563EB', glyph: 'R' },
  Betão: { bg: '#EA580C', glyph: 'Bê' },
}

const FALLBACK_PALETTE = ['#374151', '#4338CA', '#0D9488', '#B45309', '#9333EA', '#0369A1', '#BE123C', '#15803D']

const sizePx = computed(() => {
  const s = props.size
  if (typeof s === 'number') return s
  if (s === 'sm') return 20
  if (s === 'lg') return 28
  if (s === 'md') return 22
  const n = Number(s)
  return Number.isFinite(n) && n > 0 ? n : 22
})

const initials = (name: string): string => {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) return `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`.toUpperCase()
  return (name.replace(/\s+/g, '').slice(0, 2) || '?').toUpperCase()
}

const hash = (str: string): number => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

const tint = computed(() => {
  const known = TINTS[props.bookmakerName]
  if (known) return { bg: known.bg, glyph: known.glyph ?? initials(props.bookmakerName) }
  const bg = FALLBACK_PALETTE[hash(props.bookmakerName) % FALLBACK_PALETTE.length] ?? '#64748b'
  return { bg, glyph: initials(props.bookmakerName) }
})

const glyph = computed(() => tint.value.glyph)

const isLightBg = computed(() => ['#FACC15', '#FFB80C'].includes(tint.value.bg))

const logoStyle = computed(() => ({
  width: `${sizePx.value}px`,
  height: `${sizePx.value}px`,
  background: tint.value.bg,
  color: isLightBg.value ? '#1B1B1B' : '#fff',
  fontSize: `${Math.round(sizePx.value * 0.45)}px`,
}))
</script>

<style scoped>
.bookmaker-logo {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 5px;
  font-weight: 800;
  letter-spacing: -0.3px;
  line-height: 1;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
}
</style>
