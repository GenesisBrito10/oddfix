<template>
  <div class="page-shell ofx-scroll">
    <!-- Page header -->
    <div class="page-head">
      <div class="head-top">
        <div class="head-title">
          <div class="title-row">
            <h1>Sinais Pré-Live</h1>
            <span class="count-badge">{{ filteredData.length }} oportunidades</span>
          </div>
          <p class="head-desc">
            Oportunidades encontradas com base nos filtros ativos e stake configurada.
            Atualizadas continuamente conforme as odds mudam nas casas.
          </p>
        </div>

        <div class="summary-tiles">
          <div class="tile">
            <span class="tile-icon"><TrendingUp :size="13" /></span>
            <span class="tile-meta">
              <span class="tile-label">Maior lucro</span>
              <span class="tile-value tnum green">{{ maxProfit }}</span>
            </span>
          </div>
          <div class="tile">
            <span class="tile-icon"><Wallet :size="13" /></span>
            <span class="tile-meta">
              <span class="tile-label">Stake</span>
              <span class="tile-value tnum">R$ {{ stakeLabel }}</span>
            </span>
          </div>
          <div class="tile">
            <span class="tile-icon"><Zap :size="13" /></span>
            <span class="tile-meta">
              <span class="tile-label">Atualização</span>
              <span class="tile-value">Agora</span>
            </span>
            <span class="pulse-dot tile-pulse" />
          </div>
        </div>
      </div>

      <!-- Filter strip -->
      <div class="filter-strip">
        <div class="chips">
          <button
            v-for="chip in chips"
            :key="chip.id"
            class="chip"
            :class="{ active: activeChip === chip.id }"
            @click="activeChip = chip.id"
          >
            <component :is="chip.icon" v-if="chip.icon" :size="12" />
            {{ chip.label }}
          </button>
        </div>

        <label class="signal-search">
          <Search :size="14" />
          <input v-model="search" placeholder="Buscar time, evento, liga...">
        </label>

        <div class="strip-divider" />

        <div class="strip-sort">
          <span class="strip-sort-label">Ordenar</span>
          <span class="strip-sort-value">Maior lucro <ChevronDown :size="12" /></span>
        </div>

        <div class="view-toggle">
          <button :class="{ active: view === 'grid' }" aria-label="Grade" @click="view = 'grid'"><LayoutGrid :size="13" /></button>
          <button :class="{ active: view === 'list' }" aria-label="Lista" @click="view = 'list'"><List :size="13" /></button>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div class="op-grid" :class="view">
      <SurebetCard
        v-for="(surebet, index) in filteredData"
        :key="surebet.id"
        :surebet="surebet"
        :investment="investmentValue"
        :hot="index === 0"
        :stale="surebet.stale"
        :expiring-in="surebet.expiresInSeconds"
        @select="openDetail"
        @dismiss="dismiss"
      />
      <div v-if="filteredData.length === 0" class="empty-state">
        <strong>Nenhuma oportunidade encontrada</strong>
        <span>Ajuste os filtros para ver mais sinais</span>
      </div>
    </div>

    <SurebetDetailModal :surebet="selected" @close="closeModal" @dismiss="onModalDismiss" />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, Clock, Flame, LayoutGrid, List, Search, Star, TrendingUp, Wallet, Zap } from 'lucide-vue-next'
import SurebetCard from '~/components/dashboard/SurebetCard.vue'
import SurebetDetailModal from '~/components/dashboard/SurebetDetailModal.vue'
import type { Surebet } from '~/data/surebets'
import { useSurebetsApi } from '~/composables/useSurebetsApi'

const appliedFilters = useAppliedPreLiveFilters()
const selectedId = ref<string | null>(null)
const selectedSnapshot = ref<Surebet | null>(null)
const dismissedIds = ref<Set<string>>(new Set())
const { surebets } = useSurebetsApi('prematch')

// Keep games on screen for gameTtlSeconds after they leave the snapshot (yellow card).
const ttlSeconds = computed(() => appliedFilters.value.gameTtlSeconds ?? 30)
const retained = useTtlSurebets(surebets, ttlSeconds)

// Open the calculator: a separate OS window on desktop, the in-app modal on web.
const openDetail = (surebet: Surebet) => {
  if (import.meta.client && window.oddfixElectron?.openCalculator) {
    void window.oddfixElectron.openCalculator(surebet.id, 'prematch')
  } else {
    selectedId.value = surebet.id
  }
}

// Sports present in the current snapshot → feeds the sidebar's sport filter.
const availableSports = useAvailableSports()
watch(
  surebets,
  (list) => {
    availableSports.value = Array.from(new Set((list ?? []).map((item) => item.sport).filter(Boolean))).sort()
  },
  { immediate: true },
)

// Live version of the open surebet (fresh odds each tick), or null if it left the feed.
const liveSelected = computed<Surebet | null>(
  () => surebets.value?.find((item) => item.id === selectedId.value) ?? null,
)

// Persist the last known data so the calculator stays open even when the game leaves
// the feed; when it returns, the live version takes over again and odds/infos update.
watch(liveSelected, (value) => { if (value) selectedSnapshot.value = value }, { immediate: true })

const selected = computed<Surebet | null>(() => liveSelected.value ?? selectedSnapshot.value)

const closeModal = () => {
  selectedId.value = null
  selectedSnapshot.value = null
}

// Hide an operation for this session only (in-memory; a page reload brings it back).
const dismiss = (id: string) => {
  const next = new Set(dismissedIds.value)
  next.add(id)
  dismissedIds.value = next
}

const onModalDismiss = () => {
  if (selectedId.value) dismiss(selectedId.value)
}

const view = ref<'grid' | 'list'>('grid')
const activeChip = ref('all')
const search = ref('')
const chips = [
  { id: 'all', label: 'Todos', icon: null },
  { id: 'top', label: 'Maior lucro', icon: Flame },
  { id: 'new', label: 'Mais recentes', icon: Clock },
  { id: 'fav', label: 'Favoritos', icon: Star },
]

// "Stake Atual" (filter investment) → number, fed to the cards for stake calc.
const investmentValue = computed(
  () => Number.parseFloat(appliedFilters.value.investment.replace(/\./g, '').replace(',', '.')) || 0,
)
const stakeLabel = computed(() =>
  (investmentValue.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
)

const filteredData = computed(() => {
  let data = [...(retained.value ?? [])]
  const filters = appliedFilters.value

  data = data.filter((surebet) => !dismissedIds.value.has(surebet.id))
  if (search.value.trim()) {
    const query = search.value.trim().toLowerCase()
    data = data.filter((surebet) => `${surebet.game} ${surebet.league} ${surebet.sport}`.toLowerCase().includes(query))
  }
  data = data.filter((surebet) => surebet.legs.length === filters.options)
  data = data.filter((surebet) => surebet.profitPct >= filters.profitRange[0] && surebet.profitPct <= filters.profitRange[1])
  // % mínima por janela de tempo até o início.
  data = data.filter((surebet) => surebet.profitPct >= minPercentForStart(filters.minPercentByBracket, surebet.startsInMinutes))
  // Corte de % máxima (esconde odds absurdas).
  if (filters.maxPercentEnabled) {
    data = data.filter((surebet) => surebet.profitPct <= filters.maxPercent)
  }
  if ((filters.selectedSports?.length ?? 0) > 0) {
    data = data.filter((surebet) => !surebet.sport || filters.selectedSports.includes(surebet.sport))
  }
  // Only show a surebet when ALL its houses are selected. None selected = none.
  if (filters.selectedBookies.length === 0) {
    data = []
  } else {
    data = data.filter((surebet) => surebet.legs.every((leg) => filters.selectedBookies.includes(leg.bookmaker)))
  }

  if (filters.sortBy === 'profit') data.sort((a, b) => b.profitPct - a.profitPct)
  if (filters.sortBy === 'recent') data.reverse()
  if (filters.sortBy === 'start') data.sort((a, b) => a.startsInMinutes - b.startsInMinutes)

  return data
})

const maxProfit = computed(() => {
  if (filteredData.value.length === 0) return '—'
  const max = Math.max(...filteredData.value.map((s) => s.profitPct))
  return '+' + max.toFixed(2) + '%'
})
</script>

<style scoped>
.page-shell {
  width: 100%;
}

.page-head {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 28px 16px;
}

.head-top {
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.head-title {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.title-row h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.6px;
  color: var(--text);
}

.count-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: var(--r-sm);
  border: 1px solid var(--green-rim);
  background: var(--green-soft);
  color: var(--accent-2);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.head-desc {
  margin: 0;
  max-width: 720px;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}

.summary-tiles {
  display: flex;
  gap: 8px;
}

.tile {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--surface);
  min-width: 132px;
}

.tile-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 7px;
  border: 1px solid var(--line);
  background: rgba(141, 255, 199, 0.06);
  color: var(--accent);
}

.tile-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.tile-label {
  font-size: 10px;
  color: var(--t3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.tile-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.2px;
}

.tile-value.green {
  color: var(--accent-2);
}

.tile-pulse {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
}

/* Filter strip */
.filter-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
}

.chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1px;
  transition: all 0.14s ease;
}

.chip.active {
  background: rgba(141, 255, 199, 0.1);
  border-color: rgba(141, 255, 199, 0.35);
  color: var(--accent);
}

.strip-divider {
  width: 1px;
  height: 22px;
  background: var(--line);
}

.signal-search {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 180px;
  max-width: 320px;
  padding: 6px 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--inner);
  color: var(--t3);
}

.signal-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  font-size: 12.5px;
}

.strip-sort {
  display: flex;
  align-items: center;
  gap: 6px;
}

.strip-sort-label {
  font-size: 11px;
  color: var(--t3);
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.strip-sort-value {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--inner);
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
}

.view-toggle {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--inner);
}

.view-toggle button {
  display: grid;
  place-items: center;
  width: 28px;
  height: 26px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--muted);
}

.view-toggle button.active {
  background: var(--card-2);
  color: var(--accent);
  box-shadow: 0 0 0 1px rgba(141, 255, 199, 0.18);
}

/* Grid */
.op-grid {
  display: grid;
  gap: 16px;
  padding: 0 28px 28px;
}

.op-grid.grid {
  grid-template-columns: 1fr 1fr;
}

.op-grid.list {
  grid-template-columns: 1fr;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  background: var(--surface);
  color: var(--muted);
}

.empty-state strong {
  margin-bottom: 8px;
  color: var(--text);
}

@media (max-width: 1100px) {
  .op-grid.grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .page-head {
    padding: 16px;
  }

  .head-top {
    flex-direction: column;
    align-items: stretch;
  }

  .summary-tiles {
    flex-wrap: wrap;
  }

  .tile {
    flex: 1;
  }

  .op-grid {
    padding: 0 16px 24px;
  }

  .filter-strip {
    flex-wrap: wrap;
  }
}
</style>
