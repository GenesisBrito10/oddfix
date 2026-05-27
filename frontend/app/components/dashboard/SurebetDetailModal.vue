<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="surebet" class="modal-layer">
        <aside class="detail-panel">
          <header class="detail-head">
            <div class="detail-actions">
              <button class="icon-btn danger" title="Excluir operação" aria-label="Excluir operação" @click="dismissOperation"><Trash2 :size="16" /></button>
              <button class="icon-btn" title="Fechar" aria-label="Fechar" @click="$emit('close')"><X :size="18" /></button>
            </div>
            <p>{{ surebet.league }}</p>
            <h2>{{ surebet.game }}</h2>
            <span>{{ isLive ? 'Ao Vivo' : surebet.time }}</span>
            <div class="profit-row">
              <strong><TrendingUp :size="15" /> +{{ surebet.profitPct.toFixed(2) }}%</strong>
              <div>
                <small>Retorno Estimado</small>
                <span>Lucro sobre R$ {{ formatCurrency(surebet.investment) }}</span>
              </div>
            </div>
          </header>

          <section class="detail-section">
            <h3><Building2 :size="12" /> Casas Envolvidas</h3>
            <div class="detail-legs">
              <article v-for="(leg, index) in calculatedLegs" :key="index" class="detail-leg">
                <div class="detail-leg-top">
                  <BookmakerLogo :bookmaker-name="leg.bookmaker" size="sm" />
                  <Info :size="12" />
                </div>
                <p>{{ leg.market }}</p>
                <strong class="leg-odds">{{ leg.odds.toFixed(2) }}</strong>
                <strong>R$ {{ formatCurrency(leg.calculatedStake) }}</strong>
                <small>Retorno: R$ {{ formatCurrency(leg.legReturn) }}</small>
                <div class="instruction"><Navigation :size="12" /> {{ leg.instrucoes }}</div>
              </article>
            </div>
            <button
              class="btn btn-secondary open-books"
              :disabled="!canOpenBooks"
              @click="openBooks"
            >
              Abrir casas <ExternalLink :size="12" />
            </button>
            <p v-if="openBlocked" class="register-feedback err">
              Permita pop-ups para este site para abrir todas as casas lado a lado.
            </p>
            <p v-if="capturedClick" class="register-feedback ok">
              Capturado em {{ capturedClick.bookmaker }}: {{ capturedClick.text }}
            </p>
            <button
              class="btn btn-primary open-books register-btn"
              :disabled="!canRegister || registering"
              @click="handleRegister"
            >
              {{ registering ? 'Registrando...' : 'Registrar surebet' }} <Bookmark :size="12" />
            </button>
            <p v-if="registerSuccess" class="register-feedback ok">Surebet registrada com sucesso.</p>
            <p v-else-if="registerError" class="register-feedback err">{{ registerError }}</p>
            <p v-else-if="!canRegister" class="register-feedback err">Não foi possível registrar esta surebet. Atualize a lista.</p>
          </section>

          <section class="detail-section">
            <h3><Calculator :size="15" /> Calculadora</h3>

            <div class="calc-table">
              <div class="calc-row calc-head">
                <span class="calc-sel" />
                <span>Casa</span>
                <span class="ar">Odd</span>
                <span class="ar">Stake</span>
                <span class="ar">Lucro</span>
              </div>

              <label
                v-for="(row, index) in rows"
                :key="index"
                class="calc-row leg-row"
                :class="{ selected: selected === index }"
              >
                <input class="calc-sel" type="radio" name="calc-sel" :checked="selected === index" @change="selected = index">
                <span class="calc-house" :class="lucroClass(index)">{{ legName(index) }}</span>
                <input v-model.number="row.odd" class="calc-input ar" type="number" step="0.01" min="0" inputmode="decimal">
                <input v-model.number="row.stake" class="calc-input ar" type="number" step="1" min="0" inputmode="decimal">
                <span class="calc-lucro ar" :class="lucroClass(index)">R$ {{ formatCurrency(legLucro(index)) }}</span>
              </label>

              <label class="calc-row total-row" :class="{ selected: selected === 'total' }">
                <input class="calc-sel" type="radio" name="calc-sel" :checked="selected === 'total'" @change="selected = 'total'">
                <span class="calc-house">Calculadora</span>
                <span class="calc-total-label ar">Total:</span>
                <input v-model.number="totalModel" class="calc-input ar" type="number" step="1" min="0" inputmode="decimal">
                <span class="calc-pct ar" :class="pctClass">{{ rentabilidade.toFixed(2).replace('.', ',') }}%</span>
              </label>
            </div>

            <button class="toggle-row" @click="roundStakes = !roundStakes">
              <span>
                Arredondar stakes
                <small>Múltiplos de R$ 5 ao distribuir</small>
              </span>
              <i :class="{ on: roundStakes }"><b /></i>
            </button>

            <div class="result-box calc-summary">
              <div class="result-row muted"><span>Investimento total</span><strong>R$ {{ formatCurrency(totalStake) }}</strong></div>
              <div class="divider" />
              <div class="result-row profit" :class="pctClass">
                <span>Lucro garantido</span>
                <strong>R$ {{ formatCurrency(profitReal) }} · {{ rentabilidade.toFixed(2).replace('.', ',') }}%</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Bookmark, Building2, Calculator, ExternalLink, Info, Navigation, Trash2, TrendingUp, X } from 'lucide-vue-next'
import type { BetLeg, Surebet } from '~/data/surebets'
import { formatCurrency } from '~/data/surebets'

type CalcSelection = number | 'total'
interface CalculatedLeg extends BetLeg {
  calculatedStake: number
  legReturn: number
}

const props = defineProps<{ surebet: Surebet | null }>()
const emit = defineEmits<{ close: []; dismiss: [] }>()
const { lastClick, openSurebetBookmakers, startBookmakerClickListener } = useDesktopBookmakers()

const dismissOperation = () => {
  emit('dismiss')
  emit('close')
}

const rows = ref<{ odd: number; stake: number }[]>([])
const selected = ref<CalcSelection>('total')
const roundStakes = ref(true)

const {
  register: registerSurebet,
  reset: resetRegister,
  loading: registering,
  error: registerError,
  success: registerSuccess,
} = useRegisterSurebet()

// Only registrable when the real adapter supplied snapshotId/arbHash/type
// (mock fallback surebets lack these → button stays disabled).
const canRegister = computed(() =>
  Boolean(props.surebet?.type && props.surebet?.snapshotId && props.surebet?.arbHash),
)

const handleRegister = async () => {
  const surebet = props.surebet
  if (!surebet || !canRegister.value || registering.value) return
  await registerSurebet({
    type: surebet.type!,
    snapshotId: surebet.snapshotId!,
    arbHash: surebet.arbHash!,
  })
}

// "Abrir casas": one positioned popup per leg, side by side. Mock surebets lack
// bookmakerUrl → no openable legs → button disabled.
const openableLegs = computed(() =>
  (props.surebet?.legs ?? []).filter((leg) => Boolean(leg.bookmakerUrl)),
)
const canOpenBooks = computed(() => openableLegs.value.length > 0)
const openBlocked = ref(false)
const capturedClick = computed(() => {
  if (!props.surebet || lastClick.value?.contextId !== props.surebet.id) {
    return null
  }

  return lastClick.value
})

onMounted(() => {
  startBookmakerClickListener()
})

const openBooks = () => {
  const surebet = props.surebet
  if (!surebet || !openableLegs.value.length) return
  openBlocked.value = false

  void openSurebetBookmakers(surebet).then(({ blocked }) => {
    if (blocked > 0) openBlocked.value = true
  })
}

// Reseed only when a DIFFERENT surebet opens (id changes) — never on live odd
// ticks of the same surebet, so manual stakes survive the feed updates.
watch(
  () => props.surebet?.id,
  () => {
    resetRegister()
    openBlocked.value = false
    selected.value = 'total'
    if (props.surebet) {
      seedRows()
    } else {
      rows.value = []
    }
  },
  { immediate: true },
)

// Item 1: odds change live. Always sync the odd fields to the latest live odds
// without touching stakes — only Lucro / % / total recompute (no cascade to the
// other house's stake).
watch(
  () => (props.surebet?.legs ?? []).map((leg) => leg.odds).join(','),
  () => {
    const legs = props.surebet?.legs ?? []
    if (!legs.length) return
    if (rows.value.length !== legs.length) {
      seedRows()
      return
    }
    legs.forEach((leg, index) => {
      const row = rows.value[index]
      if (row) row.odd = leg.odds
    })
  },
)

const isLive = computed(() => props.surebet?.time.startsWith('AO VIVO'))

const legName = (index: number) => props.surebet?.legs[index]?.bookmaker ?? `Casa ${index + 1}`

// Distribute a total investment across rows, balanced by their (live) odds.
// Called on open (seed) and when the user types the Total — never on a single
// odd/stake edit, so editing one house never moves another.
function distribuir(total: number) {
  const localInv = rows.value.reduce((sum, row) => sum + (row.odd > 0 ? 1 / row.odd : 0), 0)
  if (localInv <= 0) return
  rows.value.forEach((row) => {
    let stake = row.odd > 0 ? total / (row.odd * localInv) : 0
    if (roundStakes.value) stake = Math.round(stake / 5) * 5
    row.stake = stake
  })
}

function seedRows() {
  const legs = props.surebet?.legs ?? []
  rows.value = legs.map((leg) => ({ odd: leg.odds, stake: 0 }))
  distribuir(props.surebet?.investment ?? 0)
}

const totalStake = computed(() => rows.value.reduce((sum, row) => sum + (Number(row.stake) || 0), 0))
const legReturn = (index: number) => (Number(rows.value[index]?.stake) || 0) * (Number(rows.value[index]?.odd) || 0)
const legLucro = (index: number) => legReturn(index) - totalStake.value
const minReturn = computed(() => (rows.value.length ? Math.min(...rows.value.map((_, index) => legReturn(index))) : 0))
const profitReal = computed(() => minReturn.value - totalStake.value)
const rentabilidade = computed(() => (totalStake.value > 0 ? (profitReal.value / totalStake.value) * 100 : 0))

// Item 3: red/green indicators.
const lucroClass = (index: number) => (legLucro(index) >= 0 ? 'pos' : 'neg')
const pctClass = computed(() => (profitReal.value >= 0 ? 'pos' : 'neg'))

// Editable Total field: shows the live sum; typing it re-distributes balanced.
const totalModel = computed({
  get: () => Number(totalStake.value.toFixed(2)),
  set: (value: number) => distribuir(Number(value) || 0),
})

const calculatedLegs = computed<CalculatedLeg[]>(() => {
  const legs = props.surebet?.legs ?? []
  return legs.map((leg, index) => {
    const odd = rows.value[index]?.odd ?? leg.odds
    const stake = Number(rows.value[index]?.stake) || 0
    return { ...leg, odds: odd, calculatedStake: stake, legReturn: stake * odd }
  })
})
</script>

<style scoped>
/* Non-blocking layer: only the panel catches clicks, so the games list behind
   stays visible AND interactive (click a card to swap the open operation). */
.modal-layer {
  position: fixed;
  inset: 0;
  z-index: 80;
  pointer-events: none;
}

.detail-panel {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 480px;
  max-width: 100%;
  overflow-y: auto;
  border-right: 1px solid var(--line-strong);
  background: linear-gradient(180deg, var(--chrome-2) 0%, var(--chrome) 100%);
  box-shadow: 24px 0 64px rgba(0, 0, 0, 0.5);
  padding: 32px 24px;
  pointer-events: auto;
}

.detail-head {
  position: relative;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 14px;
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: var(--surface-2);
  color: var(--muted);
  transition: color 0.12s ease, background 0.12s ease, border-color 0.12s ease;
}

.icon-btn:hover {
  background: var(--card-2);
  color: var(--text);
}

.icon-btn.danger:hover {
  color: var(--danger);
  border-color: rgba(255, 99, 99, 0.4);
}

.detail-head p,
.detail-head span,
.detail-leg p,
.detail-leg small {
  color: var(--muted);
}

.detail-head p {
  margin: 0 0 4px;
  font-size: 13px;
  text-transform: uppercase;
}

.detail-head h2 {
  max-width: 380px;
  margin: 0 0 12px;
  font-size: 22px;
  letter-spacing: -0.6px;
}

.profit-row {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 22px;
}

.profit-row > strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--r-md);
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: var(--bg);
  font-family: var(--f-mono);
  font-variant-numeric: tabular-nums;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(32, 230, 154, 0.3);
}

.profit-row small {
  display: block;
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.detail-section {
  margin-top: 34px;
}

.detail-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.detail-legs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.detail-leg {
  display: flex;
  flex-direction: column;
  min-height: 230px;
  padding: 16px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--inner);
}

.detail-leg-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  margin-bottom: 12px;
}

.detail-leg p {
  min-height: 36px;
  margin: 0 0 12px;
  font-size: 11px;
  line-height: 1.45;
}

.detail-leg strong {
  color: var(--text);
}

.leg-odds {
  color: var(--yellow) !important;
  font-family: var(--f-mono);
  font-variant-numeric: tabular-nums;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -1px;
}

.instruction {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: auto;
  padding: 10px;
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  font-size: 12px;
  line-height: 1.45;
}

.open-books {
  width: 100%;
  margin-top: 12px;
}

.open-books:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.register-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register-feedback {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.45;
}

.register-feedback.ok {
  color: var(--accent-2);
}

.register-feedback.err {
  color: var(--danger);
}

.calc-table {
  margin-top: 4px;
  padding: 6px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--surface-2);
}

.calc-row {
  display: grid;
  grid-template-columns: 22px minmax(0, 1.1fr) 66px 84px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  padding: 5px 6px;
}

.calc-row.calc-head {
  padding: 4px 6px 8px;
  color: var(--t3);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.calc-row .ar {
  text-align: right;
  justify-self: end;
}

.leg-row.selected,
.total-row.selected {
  background: var(--surface-3);
  border-radius: var(--r-sm);
}

.total-row {
  margin-top: 2px;
  border-top: 1px solid var(--line);
  padding-top: 8px;
}

.calc-sel {
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: var(--accent);
  cursor: pointer;
}

.calc-house {
  padding: 5px 8px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  color: var(--text);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calc-house.pos {
  border-color: var(--green-rim);
  background: var(--green-soft);
  color: var(--accent-2);
}

.calc-house.neg {
  border-color: rgba(255, 99, 99, 0.4);
  background: rgba(255, 99, 99, 0.08);
  color: var(--danger);
}

.calc-input {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  background: var(--inner);
  color: var(--text);
  padding: 6px 8px;
  font-family: var(--f-mono);
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  font-weight: 700;
  text-align: right;
  outline: 0;
}

.calc-input:focus {
  border-color: var(--accent);
}

.calc-lucro,
.calc-pct {
  font-family: var(--f-mono);
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.calc-total-label {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.calc-lucro.pos,
.calc-pct.pos {
  color: var(--accent-2);
}

.calc-lucro.neg,
.calc-pct.neg {
  color: var(--danger);
}

.calc-summary {
  margin-top: 4px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
  padding: 14px 0;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: transparent;
  color: #a1a1aa;
  text-align: left;
}

.toggle-row small {
  display: block;
  color: #525252;
}

.toggle-row i {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: var(--surface-3);
}

.toggle-row i.on {
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
}

.toggle-row b {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: var(--bg);
  transition: transform 0.2s;
}

.toggle-row i.on b {
  transform: translateX(18px);
}

.result-box {
  margin-top: 4px;
  padding: 16px 18px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--surface-2);
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
  color: var(--muted);
  font-size: 13px;
}

.result-row span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-row i {
  width: 7px;
  height: 7px;
  border-radius: 999px;
}

.result-row strong {
  color: var(--text);
  font-family: var(--f-mono);
  font-variant-numeric: tabular-nums;
}

.result-row.profit,
.result-row.profit strong {
  color: var(--accent-2);
  font-weight: 800;
}

.result-row.profit.neg,
.result-row.profit.neg strong {
  color: var(--danger);
}

.divider {
  height: 1px;
  margin: 8px 0;
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 700px) {
  .detail-panel {
    top: auto;
    left: 0;
    width: 100%;
    max-height: 90vh;
    border-right: 0;
    border-radius: 12px 12px 0 0;
    padding: 20px 16px;
  }

  .detail-legs {
    grid-template-columns: 1fr;
  }
}
</style>
