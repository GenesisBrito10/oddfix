<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="sidebar-title">
        <SlidersHorizontal :size="14" />
        <span>Filtros</span>
      </div>
      <span class="sidebar-version">v0.1.6</span>
    </div>

    <div class="sidebar-scroll ofx-scroll">
      <!-- Stake -->
      <section class="fsection">
        <div class="fsection-head">
          <span class="fsection-label">Stake atual</span>
          <span class="fsection-hint">por aposta</span>
        </div>
        <div class="stake-card">
          <span class="stake-prefix">R$</span>
          <input
            class="stake-input tnum"
            :value="localFilters.investment"
            inputmode="numeric"
            placeholder="0,00"
            @input="onInvestmentInput"
          >
          <span class="stake-icon"><SlidersHorizontal :size="12" /></span>
        </div>
        <div class="stake-quick">
          <button v-for="v in quickStakes" :key="v" @click="setStakeQuick(v)">
            {{ v < 1000 ? (v / 1000).toFixed(1) : v / 1000 }}k
          </button>
        </div>
      </section>

      <!-- Options -->
      <section class="fsection">
        <div class="fsection-head"><span class="fsection-label">Quantidade de opções</span></div>
        <div class="seg">
          <button :class="{ active: localFilters.options === 2 }" @click="setOptions(2)">2 opções</button>
          <button :class="{ active: localFilters.options === 3 }" @click="setOptions(3)">3 opções</button>
        </div>
      </section>

      <!-- Profit range -->
      <section class="fsection">
        <div class="fsection-head">
          <span class="fsection-label">Faixa de lucro</span>
          <span class="range-value tnum">{{ localFilters.profitRange[0] }}% — {{ localFilters.profitRange[1] }}%</span>
        </div>
        <div class="dual-range">
          <input type="range" min="0" max="30" step="0.5" :value="localFilters.profitRange[0]" @input="setProfitMin">
          <input type="range" min="0" max="30" step="0.5" :value="localFilters.profitRange[1]" @input="setProfitMax">
          <div class="range-track">
            <div class="range-fill" :style="rangeFillStyle" />
          </div>
          <span class="range-thumb" :style="{ left: `calc(${loPct}% - 9px)` }" />
          <span class="range-thumb" :style="{ left: `calc(${hiPct}% - 9px)` }" />
        </div>
        <div class="range-scale">
          <span>0%</span><span>10%</span><span>20%</span><span>30%</span>
        </div>
      </section>

      <!-- Sports -->
      <section class="fsection">
        <div class="fsection-head">
          <span class="fsection-label">Esportes</span>
          <button v-if="availableSports.length > 0" class="link-btn" @click="toggleAllSports">
            {{ allSportsSelected ? 'Limpar' : 'Todos' }}
          </button>
        </div>
        <p v-if="availableSports.length === 0" class="hint">Nenhum esporte disponível ainda.</p>
        <div v-else class="sport-grid">
          <button
            v-for="sport in availableSports"
            :key="sport"
            class="sport-chip"
            :class="{ active: localFilters.selectedSports.includes(sport) }"
            :title="sport"
            @click="toggleSport(sport)"
          >
            <span class="sport-dot" />
            {{ sportLabel(sport) }}
          </button>
        </div>
      </section>

      <!-- Live: decay tolerance -->
      <section v-if="mode === 'live'" class="fsection">
        <div class="fsection-head">
          <span class="fsection-label">Tolerância de queda</span>
          <span class="range-value tnum">{{ localFilters.profitDecayTolerance }}%</span>
        </div>
        <input v-model.number="localFilters.profitDecayTolerance" type="range" min="10" max="90" step="5" class="single-range" @input="emitUpdate">
        <p class="hint">Ex: sinal a 5% lucro é removido ao cair para {{ decayExample }}%</p>
      </section>

      <!-- Bookmakers -->
      <section class="fsection">
        <div class="fsection-head">
          <span class="fsection-label">Casas de apostas</span>
          <button v-if="bookmakerNames.length > 0" class="link-btn" @click="toggleAllBookies">
            {{ allSelected ? 'Limpar' : 'Todas' }}
          </button>
        </div>
        <div class="book-search">
          <Search :size="12" />
          <input v-model="search" placeholder="Buscar casa...">
        </div>
        <div class="book-count">
          <span><span class="book-count-num">{{ localFilters.selectedBookies.length }}</span> selecionadas</span>
          <span>{{ bookmakerNames.length }} disponíveis</span>
        </div>
        <div class="book-grid">
          <button
            v-for="name in filteredBookmakers"
            :key="name"
            class="book-item"
            :class="{ active: localFilters.selectedBookies.includes(name) }"
            :title="name"
            @click="toggleBookie(name)"
          >
            <BookmakerLogo :bookmaker-name="name" :size="14" />
            <span class="book-item-name">{{ name }}</span>
          </button>
        </div>
        <p v-if="bookmakerNames.length === 0" class="hint">Nenhuma casa carregada. Inicie o backend.</p>
      </section>

      <!-- Markets -->
      <section class="fsection">
        <div class="fsection-head"><span class="fsection-label">Filtros de mercado</span></div>
        <button
          v-for="item in marketFilters"
          :key="item.id"
          class="market-toggle"
          :class="{ active: localFilters.disabledMarkets.includes(item.id) }"
          @click="toggleMarket(item.id)"
        >
          <span class="check-box"><Check v-if="localFilters.disabledMarkets.includes(item.id)" :size="10" /></span>
          {{ item.label }}
        </button>
      </section>

      <!-- Sort -->
      <section class="fsection">
        <div class="fsection-head"><span class="fsection-label">Ordenação</span></div>
        <select v-model="localFilters.sortBy" class="select" @change="emitUpdate">
          <option value="profit">Maior lucro</option>
          <option value="recent">Mais recente</option>
          <option value="start">Próximo início</option>
        </select>
      </section>

      <!-- Scanner status -->
      <div class="scanner-panel">
        <div class="scanner-panel-head">
          <Radar :size="14" />
          <span>Scanner ativo</span>
          <span class="scanner-spacer" />
          <span class="pulse-dot" />
        </div>
        <div class="scanner-row"><span>Última leitura</span><span class="tnum">há 2s</span></div>
        <div class="scanner-row"><span>Latência média</span><span class="tnum">184 ms</span></div>
      </div>

      <button class="btn btn-primary apply-btn" @click="$emit('apply')">
        Filtrar Resultados
        <SlidersHorizontal :size="16" />
      </button>
    </div>

    <div class="sidebar-footer">
      <NuxtLink to="/account" class="side-link"><User :size="14" /> Conta</NuxtLink>
      <NuxtLink to="/logout" class="side-link logout-link"><LogOut :size="14" /></NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Check, LogOut, Radar, Search, SlidersHorizontal, User } from 'lucide-vue-next'
import type { FilterState } from '~/composables/useFilters'
import { useAvailableSports } from '~/composables/useFilters'
import { useBookmakers } from '~/composables/useBookmakers'

const props = defineProps<{ filters: FilterState; mode: 'pre-live' | 'live' }>()
const emit = defineEmits<{ change: [filters: FilterState]; apply: [] }>()

// Real bookmakers from the backend catalog (synced from /user_bookmakers).
const { names: bookmakerNames, load: loadBookmakers } = useBookmakers()
onMounted(() => void loadBookmakers())

const search = ref('')
const quickStakes = [500, 1000, 3000, 5000]

const localFilters = reactive<FilterState>({ ...props.filters, profitRange: [...props.filters.profitRange] as [number, number], selectedBookies: [...props.filters.selectedBookies], selectedSports: [...props.filters.selectedSports], disabledMarkets: [...props.filters.disabledMarkets] })

watch(
  () => props.filters,
  (next) => Object.assign(localFilters, { ...next, profitRange: [...next.profitRange], selectedBookies: [...next.selectedBookies], selectedSports: [...next.selectedSports], disabledMarkets: [...next.disabledMarkets] }),
  { deep: true },
)

const marketFilters = [
  { id: 'handicap-gols', label: 'Desabilitar Handicap de Gols' },
  { id: 'escanteios', label: 'Desabilitar Escanteios' },
  { id: 'reembolso-gols-hc', label: 'Desabilitar sinais com reembolso' },
  { id: 'quartos', label: 'Desabilitar Mercado de Quartos' },
]

const emitUpdate = () => emit('change', { ...localFilters, profitRange: [...localFilters.profitRange] as [number, number], selectedBookies: [...localFilters.selectedBookies], selectedSports: [...localFilters.selectedSports], disabledMarkets: [...localFilters.disabledMarkets] })

// Money mask: digits are treated as cents and formatted pt-BR (1.500,00).
const onInvestmentInput = (event: Event) => {
  const digits = (event.target as HTMLInputElement).value.replace(/\D/g, '')
  const cents = Number(digits || '0')
  localFilters.investment = (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  emitUpdate()
}

const setStakeQuick = (value: number) => {
  localFilters.investment = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  emitUpdate()
}

const filteredBookmakers = computed(() =>
  bookmakerNames.value.filter((name) => name.toLowerCase().includes(search.value.toLowerCase())),
)

// Sports present in the current snapshot (filled by the active page). Empty selection = all.
const availableSports = useAvailableSports()

const SPORT_LABELS: Record<string, string> = {
  Soccer: 'Futebol',
  Football: 'Futebol',
  Tennis: 'Tênis',
  Basketball: 'Basquete',
  'Table Tennis': 'Tênis de Mesa',
  'Ice Hockey': 'Hóquei no Gelo',
  Volleyball: 'Vôlei',
  Baseball: 'Beisebol',
  Handball: 'Handebol',
  'American Football': 'Futebol Americano',
  Boxing: 'Boxe',
  Cricket: 'Críquete',
  Snooker: 'Sinuca',
  Darts: 'Dardos',
  Futsal: 'Futsal',
}
const sportLabel = (sport: string) => {
  const key = Object.keys(SPORT_LABELS).find((item) => item.toLowerCase() === sport.toLowerCase())
  return key ? SPORT_LABELS[key] : sport
}

const toggleSport = (sport: string) => {
  localFilters.selectedSports = localFilters.selectedSports.includes(sport)
    ? localFilters.selectedSports.filter((item) => item !== sport)
    : [...localFilters.selectedSports, sport]
  emitUpdate()
}

const allSportsSelected = computed(
  () => availableSports.value.length > 0 && localFilters.selectedSports.length === availableSports.value.length,
)

const selectAllSports = () => {
  localFilters.selectedSports = [...availableSports.value]
  emitUpdate()
}

const toggleAllSports = () => {
  localFilters.selectedSports = allSportsSelected.value ? [] : [...availableSports.value]
  emitUpdate()
}

// Default: all sports selected as soon as the available list appears (and not touched yet).
watch(
  availableSports,
  (sports) => {
    if (sports.length > 0 && localFilters.selectedSports.length === 0) selectAllSports()
  },
  { immediate: true },
)

// Default: all houses selected. Applies on first catalog load and whenever the
// tab (pre-live ⇆ live) changes, so each tab starts with every house selected.
const selectAllBookies = () => {
  if (bookmakerNames.value.length === 0) return
  localFilters.selectedBookies = [...bookmakerNames.value]
  emitUpdate()
}

watch(
  bookmakerNames,
  (names) => {
    if (names.length > 0 && localFilters.selectedBookies.length === 0) selectAllBookies()
  },
  { immediate: true },
)

// On tab change, default to all houses selected when that tab has none — so the
// list is never empty on switch, without clobbering a deliberate per-tab selection.
watch(
  () => props.mode,
  () => {
    if (props.filters.selectedBookies.length === 0) selectAllBookies()
  },
)

const allSelected = computed(
  () =>
    bookmakerNames.value.length > 0 &&
    localFilters.selectedBookies.length === bookmakerNames.value.length,
)

const toggleAllBookies = () => {
  localFilters.selectedBookies = allSelected.value ? [] : [...bookmakerNames.value]
  emitUpdate()
}

const setOptions = (value: 2 | 3) => {
  localFilters.options = value
  emitUpdate()
}

const setProfitMin = (event: Event) => {
  const value = Math.min(Number((event.target as HTMLInputElement).value), localFilters.profitRange[1] - 0.5)
  localFilters.profitRange = [value, localFilters.profitRange[1]]
  emitUpdate()
}

const setProfitMax = (event: Event) => {
  const value = Math.max(Number((event.target as HTMLInputElement).value), localFilters.profitRange[0] + 0.5)
  localFilters.profitRange = [localFilters.profitRange[0], value]
  emitUpdate()
}

const toggleBookie = (name: string) => {
  localFilters.selectedBookies = localFilters.selectedBookies.includes(name)
    ? localFilters.selectedBookies.filter((bookie) => bookie !== name)
    : [...localFilters.selectedBookies, name]
  emitUpdate()
}

const toggleMarket = (id: string) => {
  localFilters.disabledMarkets = localFilters.disabledMarkets.includes(id)
    ? localFilters.disabledMarkets.filter((market) => market !== id)
    : [...localFilters.disabledMarkets, id]
  emitUpdate()
}

const loPct = computed(() => (localFilters.profitRange[0] / 30) * 100)
const hiPct = computed(() => (localFilters.profitRange[1] / 30) * 100)
const rangeFillStyle = computed(() => ({
  left: `${loPct.value}%`,
  right: `${100 - hiPct.value}%`,
}))

const decayExample = computed(() => (5 * (1 - localFilters.profitDecayTolerance / 100)).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }))
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 304px;
  height: calc(100vh - 64px);
  flex: 0 0 auto;
  border-right: 1px solid var(--line);
  background: var(--chrome);
}

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.sidebar-version {
  font-size: 10px;
  color: var(--t3);
}

.sidebar-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 18px 16px;
}

.link-btn {
  border: 0;
  padding: 2px 6px;
  border-radius: var(--r-xs);
  background: transparent;
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}

.link-btn:hover {
  background: rgba(141, 255, 199, 0.1);
  color: var(--accent-2);
}

.fsection-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.fsection-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.1px;
  color: var(--t3);
  text-transform: uppercase;
}

.fsection-hint {
  font-size: 10px;
  color: var(--t4);
}

.range-value {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: 0.3px;
}

/* Stake */
.stake-card {
  display: flex;
  align-items: center;
  padding: 4px 4px 4px 12px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background: linear-gradient(180deg, rgba(32, 230, 154, 0.04) 0%, transparent 100%);
}

.stake-prefix {
  font-size: 12px;
  font-weight: 700;
  color: var(--t3);
  letter-spacing: 0.5px;
}

.stake-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  padding: 8px;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.stake-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: var(--card-2);
  color: var(--muted);
}

.stake-quick {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.stake-quick button {
  flex: 1;
  padding: 6px 0;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
}

.stake-quick button:hover {
  border-color: var(--border-mint-soft);
  color: var(--accent);
}

/* Segmented options */
.seg {
  display: flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--inner);
}

.seg button {
  flex: 1;
  height: 32px;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.seg button.active {
  background: var(--card-2);
  color: var(--accent);
  box-shadow: 0 1px 0 rgba(141, 255, 199, 0.1) inset, 0 0 0 1px rgba(141, 255, 199, 0.18);
}

/* Range */
.dual-range {
  position: relative;
  height: 24px;
}

.dual-range input {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  margin: 0;
  opacity: 0;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
  /* Track passes clicks through so BOTH thumbs stay grabbable — the min handle was
     unreachable because the max input overlay captured every drag. */
  pointer-events: none;
}

.dual-range input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 24px;
  border-radius: 50%;
  pointer-events: auto;
  cursor: pointer;
}

.dual-range input::-moz-range-thumb {
  width: 22px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  pointer-events: auto;
  cursor: pointer;
}

.range-track {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 2px;
  background: rgba(148, 163, 184, 0.1);
}

.range-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-2) 0%, var(--accent) 100%);
  box-shadow: 0 0 12px rgba(32, 230, 154, 0.45);
}

.range-thumb {
  position: absolute;
  top: 3px;
  z-index: 1;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f4f7fa;
  border: 3px solid var(--accent-2);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(32, 230, 154, 0.1);
  pointer-events: none;
}

.range-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 10px;
  color: var(--t3);
}

.single-range {
  width: 100%;
  accent-color: var(--accent);
}

/* Sports */
.sport-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sport-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--inner);
  color: var(--muted-2);
  font-size: 11.5px;
  font-weight: 700;
  transition: color 0.12s ease, background 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
}

.sport-chip:hover {
  border-color: var(--border-mint-soft);
  color: var(--text);
}

.sport-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--t4);
  transition: background 0.12s ease, box-shadow 0.12s ease;
}

.sport-chip.active {
  border-color: var(--border-mint);
  background: linear-gradient(135deg, rgba(32, 230, 154, 0.16), rgba(141, 255, 199, 0.08));
  color: var(--accent);
  box-shadow: 0 0 0 1px rgba(141, 255, 199, 0.2), 0 2px 10px rgba(32, 230, 154, 0.12);
}

.sport-chip.active .sport-dot {
  background: var(--accent-2);
  box-shadow: 0 0 6px var(--accent-2);
}

/* Bookmakers */
.book-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  margin-bottom: 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--inner);
  color: var(--t3);
}

.book-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  font-size: 12px;
}

.book-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 10px;
  color: var(--t3);
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.book-count-num {
  color: var(--accent);
  font-weight: 700;
}

/* All houses visible at once — no inner (nested) scroll. Auto-fill columns stay
   wide enough to show the FULL name (wraps to 2 lines when long). */
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
  gap: 5px;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 5px 8px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, 0.015);
  color: var(--muted);
}

.book-item.active {
  border-color: var(--border-mint-soft);
  background: rgba(141, 255, 199, 0.06);
  color: var(--text);
}

.book-item-name {
  flex: 1;
  min-width: 0;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.25;
  white-space: normal;
  overflow-wrap: anywhere;
}

.book-check {
  color: var(--accent);
  flex-shrink: 0;
}

/* Markets */
.market-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 6px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--inner);
  color: var(--muted-2);
  text-align: left;
  font-size: 12px;
}

.market-toggle.active {
  border-color: var(--border-mint);
  background: var(--mint-soft);
  color: var(--text);
  font-weight: 700;
}

.check-box {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-xs);
  color: var(--accent);
}

.market-toggle.active .check-box {
  border-color: var(--border-mint);
  background: var(--mint-soft);
}

.hint {
  margin: 6px 0 0;
  color: var(--t3);
  font-size: 11px;
  line-height: 1.45;
}

/* Scanner panel */
.scanner-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--inner);
}

.scanner-panel-head {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent-2);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.scanner-panel-head span:not(.scanner-spacer):not(.pulse-dot) {
  color: var(--text);
}

.scanner-spacer {
  flex: 1;
}

.scanner-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--t3);
}

.scanner-row span:last-child {
  color: var(--text);
  font-weight: 600;
}

.apply-btn {
  width: 100%;
  text-transform: uppercase;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid var(--line);
}

.side-link {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border-radius: var(--r-sm);
  color: var(--muted);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
}

.logout-link {
  flex: 0 0 auto;
  width: 36px;
  justify-content: center;
  border: 1px solid var(--line);
}

.side-link:hover {
  background: var(--card-2);
  color: var(--text);
}

@media (max-width: 900px) {
  .sidebar {
    display: none;
  }
}
</style>
