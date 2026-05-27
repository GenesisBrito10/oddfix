<template>
  <article
    class="op-card"
    :class="{ hot, live: isLive }"
    @click="$emit('select', surebet)"
  >
    <div v-if="hot" class="hot-rim" />

    <!-- Header -->
    <div class="card-header">
      <div class="title-area">
        <div class="title-row">
          <h3 class="match">
            <span>{{ home }}</span>
            <span v-if="away" class="vs">vs</span>
            <span v-if="away">{{ away }}</span>
          </h3>
          <span class="badge-pill neutral"><ShieldCheck :size="10" /> {{ isLive ? 'Ao vivo' : 'Pré-live' }}</span>
        </div>
        <div class="meta">
          <span class="meta-league"><span class="league-dot" />{{ surebet.league }}</span>
          <span class="sep" />
          <span class="tnum">{{ surebet.time }}</span>
          <span class="sep" />
          <span class="fresh"><span class="pulse-dot fresh-dot" /> Atualizado agora</span>
        </div>
        <div v-if="surebet.isNew" class="badges">
          <span class="badge-pill amber"><Flame :size="10" /> Nova</span>
        </div>
      </div>

      <div class="header-right">
        <div class="return-block">
          <span class="return-label">Lucro previsto</span>
          <span class="return-value tnum">+{{ surebet.profitPct.toFixed(2) }}%</span>
          <span class="return-net tnum">Retorno previsto R$ {{ formatCurrency(netProfit) }}</span>
        </div>

        <button
          class="open-books-btn"
          :disabled="!canOpenBooks"
          title="Abrir casas lado a lado"
          aria-label="Abrir casas"
          @click.stop="openAllBooks"
        ><ExternalLink :size="15" /></button>
        <button
          class="dismiss-card-btn"
          title="Excluir operação da tela"
          aria-label="Excluir operação"
          @click.stop="$emit('dismiss', surebet.id)"
        ><Trash2 :size="15" /></button>
        <button class="open-btn" aria-label="Detalhes"><ChevronRight :size="16" /></button>
      </div>
    </div>

    <!-- Bookmaker table -->
    <div class="book-table">
      <div class="book-row book-head">
        <span>Casa</span>
        <span>Mercado</span>
        <span class="ar">Odd</span>
        <span class="ar">Apostar</span>
      </div>
      <div
        v-for="(leg, index) in surebet.legs"
        :key="`${surebet.id}-${index}`"
        class="book-row leg"
      >
        <div class="cell-book">
          <BookmakerLogo :bookmaker-name="leg.bookmaker" :size="22" />
          <span class="book-name">{{ leg.bookmaker }}</span>
        </div>
        <div class="cell-market">
          <span class="market-name">{{ leg.market }}</span>
          <span class="market-crumb">{{ leg.instrucoes }}</span>
        </div>
        <div class="cell-odd ar">
          <span class="odd tnum">{{ leg.odds.toFixed(2) }}</span>
        </div>
        <div class="cell-stake ar">
          <span class="stake tnum">R$ {{ formatCurrency(stakeFor(leg)) }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ChevronRight, ExternalLink, Flame, ShieldCheck, Trash2 } from 'lucide-vue-next'
import type { BetLeg, Surebet } from '~/data/surebets'
import { formatCurrency } from '~/data/surebets'

const props = defineProps<{ surebet: Surebet; isLive?: boolean; investment?: number; hot?: boolean }>()
defineEmits<{ select: [surebet: Surebet]; dismiss: [id: string] }>()
const { openSurebetBookmakers } = useDesktopBookmakers()

// "Team A vs. Team B" → home / away (tolerates "vs", "vs.", "x", "-").
const teams = computed(() => props.surebet.game.split(/\s+(?:vs\.?|x|-)\s+/i))
const home = computed(() => teams.value[0] ?? props.surebet.game)
const away = computed(() => teams.value[1] ?? '')

// Stake per leg derived from the "Stake Atual" filter (investment) + odds.
const investment = computed(() =>
  props.investment && props.investment > 0 ? props.investment : props.surebet.investment,
)
const invSum = computed(() =>
  props.surebet.legs.reduce((sum, leg) => sum + (leg.odds > 0 ? 1 / leg.odds : 0), 0),
)
const stakeFor = (leg: BetLeg): number =>
  invSum.value > 0 && leg.odds > 0 ? investment.value / (leg.odds * invSum.value) : 0
const totalReturn = computed(() => investment.value * (1 + props.surebet.profitPct / 100))
const netProfit = computed(() => totalReturn.value - investment.value)

// Shortcut: open every leg's house in side-by-side popups (same as the modal).
const openableLegs = computed(() => props.surebet.legs.filter((leg) => Boolean(leg.bookmakerUrl)))
const canOpenBooks = computed(() => openableLegs.value.length > 0)
const openAllBooks = () => {
  if (!openableLegs.value.length) return
  void openSurebetBookmakers(props.surebet)
}
</script>

<style scoped>
.op-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  background: linear-gradient(180deg, var(--card-2) 0%, var(--surface) 100%);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.op-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.op-card.hot {
  border-color: var(--border-mint-soft);
}

.hot-rim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(120% 80% at 100% 0%, rgba(32, 230, 154, 0.08), transparent 50%);
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px 14px;
  border-bottom: 1px solid var(--line);
}

.title-area {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
}

.match {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0 4px;
  margin: 0;
  font-size: 15.5px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: var(--text);
}

.match .vs {
  color: var(--t3);
  font-weight: 500;
  padding: 0 4px;
}

.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--t3);
  font-size: 11.5px;
}

.meta-league {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.league-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--t4);
}

.fresh {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.fresh-dot {
  width: 5px;
  height: 5px;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: var(--r-sm);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.badge-pill.mint {
  background: var(--green-soft);
  color: var(--accent-2);
  border-color: var(--green-rim);
}

.badge-pill.neutral {
  background: rgba(148, 163, 184, 0.08);
  color: var(--muted);
  border-color: var(--line);
}

.badge-pill.amber {
  background: var(--amber-soft);
  color: var(--amber);
  border-color: rgba(246, 199, 107, 0.28);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.return-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  padding: 10px 14px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--surface-2);
  min-width: 168px;
}

.return-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--t3);
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.return-value {
  margin-top: 2px;
  font-size: 22px;
  font-weight: 700;
  color: var(--accent-2);
  letter-spacing: -0.6px;
}

.return-net {
  margin-top: 2px;
  font-size: 11px;
  font-weight: 600;
  color: var(--t3);
}

.open-books-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid var(--border-mint);
  border-radius: var(--r-sm);
  background: var(--mint-soft);
  color: var(--accent);
  transition: all 0.12s ease;
}

.open-books-btn:hover:not(:disabled) {
  background: rgba(141, 255, 199, 0.16);
}

.open-books-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dismiss-card-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--t3);
  transition: all 0.12s ease;
}

.dismiss-card-btn:hover {
  color: var(--danger);
  border-color: rgba(255, 99, 99, 0.4);
  background: rgba(255, 99, 99, 0.06);
}

.open-btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 0;
  border-radius: var(--r-sm);
  background: linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%);
  color: #070a0f;
  box-shadow: 0 4px 12px rgba(32, 230, 154, 0.3), 0 0 0 1px rgba(141, 255, 199, 0.4);
}

/* Bookmaker table */
.book-table {
  background: var(--surface-2);
}

.book-row {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.7fr) 64px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
}

.book-head {
  padding: 8px 20px;
  font-size: 10px;
  font-weight: 700;
  color: var(--t3);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  border-bottom: 1px solid var(--line);
}

.book-row .ar {
  text-align: right;
  justify-self: end;
}

.leg {
  border-bottom: 1px solid var(--line);
  transition: background 0.12s ease;
}

.leg:last-child {
  border-bottom: 0;
}

.leg:hover {
  background: rgba(255, 255, 255, 0.02);
}

.cell-book {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.book-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-market {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.market-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.market-crumb {
  font-size: 10.5px;
  color: var(--t3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.odd {
  font-size: 17px;
  font-weight: 700;
  color: var(--yellow);
  letter-spacing: -0.3px;
  text-shadow: 0 0 16px rgba(217, 248, 117, 0.25);
}

.stake {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

@media (max-width: 900px) {
  .card-header {
    flex-wrap: wrap;
  }

  .header-right {
    order: 3;
    width: 100%;
    justify-content: space-between;
  }

  .return-block {
    align-items: flex-start;
  }

  .book-row {
    grid-template-columns: minmax(0, 1.4fr) 56px minmax(0, 1fr);
    gap: 8px;
  }

  .book-head span:nth-child(2),
  .cell-market {
    display: none;
  }
}
</style>
