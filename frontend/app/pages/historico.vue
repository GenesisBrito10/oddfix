<template>
  <div class="page-wide">
    <div class="page-header">
      <div>
        <h1 class="page-title">Histórico</h1>
        <p class="page-subtitle">Surebets registradas</p>
      </div>
    </div>

    <div v-if="items.length > 0" class="history-metrics">
      <div class="metric">
        <span class="metric-label">Lucro líquido</span>
        <strong class="metric-value tnum" :class="metrics.lucroTotal >= 0 ? 'pos' : 'neg'">
          {{ metrics.lucroTotal >= 0 ? '+' : '−' }} R$ {{ formatCurrency(Math.abs(metrics.lucroTotal)) }}
        </strong>
        <span class="metric-sub">{{ metrics.resolvedCount }} resolvidas</span>
      </div>
      <div class="metric">
        <span class="metric-label">ROI</span>
        <strong class="metric-value tnum" :class="metrics.roi >= 0 ? 'pos' : 'neg'">
          {{ metrics.roi >= 0 ? '+' : '' }}{{ metrics.roi.toFixed(2) }}%
        </strong>
        <span class="metric-sub">apostado R$ {{ formatCurrency(metrics.totalApostado) }}</span>
      </div>
      <div class="metric">
        <span class="metric-label">Taxa de acerto</span>
        <strong class="metric-value tnum">{{ metrics.winRate.toFixed(0) }}%</strong>
        <span class="metric-sub">{{ metrics.winCount }}/{{ metrics.resolvedCount }} green</span>
      </div>
      <div class="metric">
        <span class="metric-label">Status</span>
        <div class="metric-counts">
          <span class="mc is-pending">{{ metrics.counts.pending }} pend</span>
          <span class="mc is-green">{{ metrics.counts.won }} ganhas</span>
          <span class="mc is-red">{{ metrics.counts.lost }} perdidas</span>
          <span class="mc is-void">{{ metrics.counts.neutral }} anul</span>
        </div>
      </div>
    </div>

    <div class="panel filters-bar">
      <label class="filter-field">
        <span class="section-label">Status</span>
        <select v-model="statusFilter" class="input">
          <option value="">Todos</option>
          <option value="PENDING">Pendentes</option>
          <option value="FINALIZED">Finalizadas</option>
        </select>
      </label>
      <label class="filter-field">
        <span class="section-label">Tipo</span>
        <select v-model="typeFilter" class="input">
          <option value="">Todos</option>
          <option value="LIVE">LIVE</option>
          <option value="PREMATCH">PREMATCH</option>
        </select>
      </label>
      <label class="filter-field grow">
        <span class="section-label">Buscar</span>
        <input v-model="search" class="input" placeholder="Evento, liga, esporte, casa, mercado">
      </label>
    </div>

    <p v-if="errorMsg" class="history-error">{{ errorMsg }}</p>

    <div v-if="pending" class="empty-state">Carregando...</div>
    <div v-else-if="items.length === 0" class="empty-state">
      <strong>Nenhuma surebet registrada</strong>
      <span>Registre uma surebet pelo modal para vê-la aqui.</span>
    </div>

    <div v-else class="history-list">
      <article v-for="item in items" :key="item.id" class="card history-card">
        <header class="history-head">
          <div class="history-meta">
            <span class="type-badge" :class="item.type === 'LIVE' ? 'live' : 'prematch'">{{ item.type }}</span>
            <span v-if="item.percent !== null" class="profit-badge">+{{ item.percent.toFixed(2) }}%</span>
            <span class="status-chip" :class="isFinalized(item) ? 'is-finalized' : 'is-pending'">{{ isFinalized(item) ? 'Finalizado' : 'Pendente' }}</span>
          </div>
          <span class="history-date">{{ formatDate(item.registeredAt) }}</span>
        </header>

        <h2 class="history-event">{{ item.eventName }}</h2>
        <p class="history-league">{{ [item.leagueName, item.sportName].filter(Boolean).join(' · ') }}</p>

        <div class="history-money">
          <label class="stake-field">
            <span class="section-label">Stake total</span>
            <div class="money-input">
              <span>R$</span>
              <input class="tnum" type="number" min="0" step="50" :value="stakeFor(item)" @input="setStake(item, $event)">
            </div>
          </label>
          <div class="result-field">
            <span class="section-label">Resultado</span>
            <strong class="result-value tnum" :class="resultClass(item)">{{ resultLabel(item) }}</strong>
          </div>
        </div>

        <div class="marker-row">
          <span class="section-label">Status geral</span>
          <div class="marker-buttons">
            <button
              class="marker-btn is-pending"
              :class="{ active: !isFinalized(item) }"
              :disabled="busy === item.id"
              @click="setPending(item)"
            >Pendente</button>
            <button
              class="marker-btn is-green"
              :class="{ active: isFinalized(item) }"
              :disabled="busy === item.id"
              @click="finalize(item)"
            >Finalizado</button>
          </div>
        </div>

        <div class="legs">
          <div v-for="(leg, li) in item.legs" :key="leg.id" class="leg-row">
            <div class="leg-info">
              <strong>{{ leg.bookmakerName }}</strong>
              <span>{{ leg.marketName }}</span>
            </div>
            <span class="leg-odd">{{ leg.odd.toFixed(2) }}</span>
            <span class="leg-stake tnum" title="Stake nesta casa">R$ {{ formatCurrency(legStake(item, li)) }}</span>
            <div class="marker-buttons">
              <button
                v-for="r in STATUSES"
                :key="r"
                class="marker-btn small"
                :class="[statusClass(r), { active: leg.result === r }]"
                :disabled="busyLeg === leg.id"
                @click="setLeg(item, leg, r)"
              >{{ statusText(r) }}</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  HistoryItem,
  HistoryLeg,
  HistoryPagination,
  SurebetResultValue,
} from '~/composables/useSurebetHistory'
import { formatCurrency } from '~/data/surebets'

const STATUSES: SurebetResultValue[] = ['GREEN', 'RED', 'VOID', 'CANCELLED']

const { listHistory, updateSurebetStatus, updateLegResult } = useSurebetHistory()

const statusFilter = ref<'' | 'PENDING' | 'FINALIZED'>('')
const typeFilter = ref<'' | 'LIVE' | 'PREMATCH'>('')
const search = ref('')

const items = ref<HistoryItem[]>([])
const pagination = ref<HistoryPagination>({ page: 1, limit: 50, total: 0, totalPages: 0 })
const pending = ref(false)
const errorMsg = ref('')
const busy = ref('')
const busyLeg = ref('')

// --- Stake por surebet (local, persistido em localStorage; backend não guarda) ---
const STAKES_KEY = 'oddfix_history_stakes'
const DEFAULT_STAKE = 1000
const stakes = ref<Record<string, number>>({})

onMounted(() => {
  try {
    const raw = localStorage.getItem(STAKES_KEY)
    if (raw) stakes.value = JSON.parse(raw)
  } catch {
    // armazenamento corrompido/indisponível: ignora
  }
})

watch(
  stakes,
  (value) => {
    try {
      localStorage.setItem(STAKES_KEY, JSON.stringify(value))
    } catch {
      // ignora cota/indisponível
    }
  },
  { deep: true },
)

const stakeFor = (item: HistoryItem): number => {
  const value = stakes.value[item.id]
  return value === undefined ? DEFAULT_STAKE : value
}

const setStake = (item: HistoryItem, event: Event) => {
  const raw = Number((event.target as HTMLInputElement).value)
  stakes.value = { ...stakes.value, [item.id]: Number.isFinite(raw) && raw > 0 ? raw : 0 }
}

// --- Lucro pelo resultado das pernas (stakes balanceados pelas odds) ---
const balancedStakes = (item: HistoryItem, total: number): number[] => {
  const invSum = item.legs.reduce((sum, leg) => sum + (leg.odd > 0 ? 1 / leg.odd : 0), 0)
  if (invSum <= 0) return item.legs.map(() => 0)
  return item.legs.map((leg) => (leg.odd > 0 ? total / (leg.odd * invSum) : 0))
}

const legStake = (item: HistoryItem, index: number): number =>
  balancedStakes(item, stakeFor(item))[index] ?? 0

const legReturn = (leg: HistoryLeg, stake: number): number => {
  if (leg.result === 'GREEN') return stake * leg.odd
  if (leg.result === 'VOID' || leg.result === 'CANCELLED') return stake
  return 0 // RED ou PENDING
}

type OutcomeState = 'pending' | 'resolved' | 'void' | 'excluded'
interface Outcome { state: OutcomeState; profit: number; staked: number }

const outcomeFor = (item: HistoryItem): Outcome => {
  const total = stakeFor(item)
  if (item.status === 'CANCELLED') return { state: 'excluded', profit: 0, staked: 0 }
  if (item.status === 'VOID') return { state: 'void', profit: 0, staked: 0 }
  if (item.status === 'PENDING') return { state: 'pending', profit: 0, staked: 0 }

  // GREEN/RED: usa o resultado das pernas quando todas marcadas; senão cai no status geral.
  const legsResolved = item.legs.length > 0 && item.legs.every((leg) => leg.result !== 'PENDING')
  if (legsResolved) {
    const distribution = balancedStakes(item, total)
    const returns = item.legs.reduce((sum, leg, index) => sum + legReturn(leg, distribution[index] ?? 0), 0)
    return { state: 'resolved', profit: returns - total, staked: total }
  }

  const profit = item.status === 'GREEN' ? (total * (item.percent ?? 0)) / 100 : -total
  return { state: 'resolved', profit, staked: total }
}

const resultLabel = (item: HistoryItem): string => {
  const outcome = outcomeFor(item)
  if (outcome.state === 'pending') return 'Pendente'
  if (outcome.state === 'excluded') return 'Cancelada'
  if (outcome.state === 'void') return 'Anulada · R$ 0,00'
  const sign = outcome.profit >= 0 ? '+' : '−'
  return `${sign} R$ ${formatCurrency(Math.abs(outcome.profit))}`
}

const resultClass = (item: HistoryItem): string => {
  const outcome = outcomeFor(item)
  if (outcome.state === 'pending') return 'is-pending'
  if (outcome.state === 'excluded' || outcome.state === 'void') return 'is-void'
  return outcome.profit >= 0 ? 'pos' : 'neg'
}

const metrics = computed(() => {
  let lucroTotal = 0
  let totalApostado = 0
  let resolvedCount = 0
  let winCount = 0
  const counts = { pending: 0, won: 0, lost: 0, neutral: 0 }

  for (const item of items.value) {
    const outcome = outcomeFor(item)
    if (outcome.state === 'pending') {
      counts.pending += 1
      continue
    }
    if (outcome.state === 'excluded' || outcome.state === 'void') {
      counts.neutral += 1
      continue
    }
    // resolved
    lucroTotal += outcome.profit
    totalApostado += outcome.staked
    resolvedCount += 1
    if (outcome.profit > 0) {
      winCount += 1
      counts.won += 1
    } else if (outcome.profit < 0) {
      counts.lost += 1
    } else {
      counts.neutral += 1
    }
  }

  const roi = totalApostado > 0 ? (lucroTotal / totalApostado) * 100 : 0
  const winRate = resolvedCount > 0 ? (winCount / resolvedCount) * 100 : 0
  return { lucroTotal, totalApostado, roi, winRate, winCount, resolvedCount, counts }
})

const load = async () => {
  pending.value = true
  errorMsg.value = ''
  try {
    const res = await listHistory({
      // Backend só conhece os status crus; "Finalizadas" = qualquer não-PENDING (filtra no cliente).
      status: statusFilter.value === 'PENDING' ? 'PENDING' : undefined,
      type: typeFilter.value || undefined,
      search: search.value.trim() || undefined,
      sort: 'registeredAt_desc',
      page: 1,
      limit: 50,
    })
    items.value = statusFilter.value === 'FINALIZED'
      ? res.items.filter((item) => item.status !== 'PENDING')
      : res.items
    pagination.value = res.pagination
  } catch {
    errorMsg.value = 'Não foi possível carregar o histórico.'
  } finally {
    pending.value = false
  }
}

onMounted(load)

let debounce: ReturnType<typeof setTimeout> | undefined
watch([statusFilter, typeFilter, search], () => {
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(load, 300)
})

const setStatus = async (item: HistoryItem, status: SurebetResultValue) => {
  if (item.status === status) return
  busy.value = item.id
  try {
    const updated = await updateSurebetStatus(item.id, status)
    Object.assign(item, updated)
  } catch {
    errorMsg.value = 'Não foi possível atualizar o status.'
  } finally {
    busy.value = ''
  }
}

// Overall status is just Pendente vs Finalizado. The win/loss detail comes from the
// per-leg results + computed profit; "Finalizado" stores a backend status derived from
// that profit (GREEN/RED/VOID) so the status filter and counts remain valid.
const isFinalized = (item: HistoryItem): boolean => item.status !== 'PENDING'

const setPending = (item: HistoryItem) => void setStatus(item, 'PENDING')

const finalize = (item: HistoryItem) => {
  const total = stakeFor(item)
  const distribution = balancedStakes(item, total)
  const profit = item.legs.reduce((sum, leg, index) => sum + legReturn(leg, distribution[index] ?? 0), 0) - total
  const status: SurebetResultValue = profit > 0.009 ? 'GREEN' : profit < -0.009 ? 'RED' : 'VOID'
  void setStatus(item, status)
}

const setLeg = async (item: HistoryItem, leg: HistoryLeg, result: SurebetResultValue) => {
  if (leg.result === result) return
  busyLeg.value = leg.id
  try {
    const updated = await updateLegResult(item.id, leg.id, result)
    Object.assign(item, updated)
  } catch {
    errorMsg.value = 'Não foi possível atualizar a aposta.'
  } finally {
    busyLeg.value = ''
  }
}

const statusClass = (value: SurebetResultValue): string => `is-${value.toLowerCase()}`

const STATUS_LABELS: Record<SurebetResultValue, string> = {
  GREEN: 'Green',
  RED: 'Red',
  VOID: 'Anulada',
  CANCELLED: 'Cancelada',
}
const statusText = (value: SurebetResultValue): string => STATUS_LABELS[value]

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>

<style scoped>
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 16px;
}
.filter-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
}
.filter-field.grow {
  flex: 1;
  min-width: 220px;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.history-card {
  padding: 18px 20px;
}
.history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.history-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.history-date {
  color: var(--muted);
  font-size: 12px;
}
.history-event {
  margin: 12px 0 2px;
  font-size: 18px;
}
.history-league {
  margin: 0 0 14px;
  color: var(--muted);
  font-size: 13px;
}
.type-badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.4px;
  background: var(--surface-3);
  color: #fff;
}
.type-badge.live {
  background: rgba(255, 107, 107, 0.18);
  color: #ff6b6b;
}
.profit-badge {
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--accent);
  color: var(--bg);
  font-size: 12px;
  font-weight: 800;
}
.marker-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.marker-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.marker-btn {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3px;
}
.marker-btn.small {
  padding: 4px 8px;
  font-size: 10px;
}
.marker-btn:disabled {
  opacity: 0.5;
}
.marker-btn.active.is-green {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--bg);
}
.marker-btn.active.is-red {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}
.marker-btn.active.is-pending {
  border-color: var(--muted);
  color: #fff;
}
.marker-btn.active.is-void,
.marker-btn.active.is-cancelled {
  border-color: #d9b34a;
  color: #d9b34a;
}
.status-chip {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  background: var(--surface-3);
  color: var(--muted);
}
.status-chip.is-finalized {
  background: var(--green-soft);
  color: var(--accent-2);
}
.status-chip.is-pending {
  background: var(--surface-3);
  color: var(--muted);
}
.status-chip.is-green {
  background: var(--green-soft);
  color: var(--accent-2);
}
.status-chip.is-red {
  background: rgba(255, 107, 107, 0.16);
  color: #ff6b6b;
}
.status-chip.is-void,
.status-chip.is-cancelled {
  background: rgba(217, 179, 74, 0.16);
  color: #d9b34a;
}
.legs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 14px;
}
.leg-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.leg-info {
  display: flex;
  flex-direction: column;
  min-width: 160px;
  flex: 1;
}
.leg-info span {
  color: var(--muted);
  font-size: 12px;
}
.leg-odd {
  color: var(--yellow, #d9b34a);
  font-family: Manrope, Inter, sans-serif;
  font-size: 18px;
  font-weight: 800;
}
.history-error {
  margin: 0 0 12px;
  color: #ff6b6b;
  font-size: 13px;
}

/* Metrics bar */
.history-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}
.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  background: var(--surface);
}
.metric-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--t3);
}
.metric-value {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: var(--text);
}
.metric-value.pos {
  color: var(--accent-2);
}
.metric-value.neg {
  color: #ff6b6b;
}
.metric-sub {
  font-size: 11px;
  color: var(--muted);
}
.metric-counts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}
.mc {
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--surface-3);
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}
.mc.is-green {
  background: var(--green-soft);
  color: var(--accent-2);
}
.mc.is-red {
  background: rgba(255, 107, 107, 0.16);
  color: #ff6b6b;
}
.mc.is-void {
  background: rgba(217, 179, 74, 0.16);
  color: #d9b34a;
}

/* Stake + result per card */
.history-money {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 22px;
  margin: 0 0 16px;
}
.stake-field,
.result-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.history-money .money-input {
  display: flex;
  align-items: center;
  overflow: hidden;
  max-width: 170px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  background: var(--inner);
}
.history-money .money-input span {
  padding: 0 10px;
  border-right: 1px solid var(--line);
  color: var(--muted);
  font-weight: 700;
}
.history-money .money-input input {
  min-width: 0;
  width: 120px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text);
  padding: 8px 10px;
  font-size: 16px;
  font-weight: 700;
}
.result-value {
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
}
.result-value.pos {
  color: var(--accent-2);
}
.result-value.neg {
  color: #ff6b6b;
}
.result-value.is-void {
  color: #d9b34a;
}
.result-value.is-pending {
  color: var(--muted);
}
.leg-stake {
  min-width: 96px;
  text-align: right;
  color: var(--text);
  font-family: Manrope, Inter, sans-serif;
  font-weight: 700;
}

@media (max-width: 720px) {
  .history-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 200px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--muted);
}
.empty-state strong {
  color: #fff;
}
</style>
