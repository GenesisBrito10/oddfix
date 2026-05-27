<template>
  <div class="page-wide">
    <div class="page-header">
      <div>
        <h1 class="page-title">Extrato</h1>
        <p class="page-subtitle">Movimentações financeiras</p>
      </div>
    </div>

    <div class="stat-grid balance-grid">
      <div v-for="card in balanceCards" :key="card.label" class="panel balance-card" :class="{ accent: card.accent }">
        <span class="section-label">{{ card.label }}</span>
        <strong>R$ {{ formatBRL(card.value) }}</strong>
      </div>
    </div>

    <section class="card movements-card">
      <div class="movements-head">
        <strong>Movimentações</strong>
        <div class="segmented">
          <button v-for="option in periodOptions" :key="option.label" class="segment" :class="{ active: periodDays === option.days }" @click="periodDays = option.days">{{ option.label }}</button>
        </div>
      </div>

      <div class="tx-list">
        <div v-for="tx in filtered" :key="tx.id" class="tx-row">
          <div class="tx-icon" :class="{ entrada: tx.type === 'entrada' }">
            <component :is="tx.type === 'entrada' ? ArrowUpRight : ArrowDownLeft" :size="16" />
          </div>
          <div class="tx-main">
            <strong>{{ tx.description }}</strong>
            <span>{{ tx.datetime }}</span>
          </div>
          <span class="status" :class="statusClass(tx.status)">{{ tx.status }}</span>
          <strong class="tx-amount" :class="{ entrada: tx.type === 'entrada' }">{{ tx.type === 'entrada' ? '+' : '' }}R$ {{ formatBRL(Math.abs(tx.amount)) }}</strong>
        </div>
      </div>

      <div class="movement-footer">
        <NuxtLink to="/afiliados/solicitar-saque" class="btn btn-primary"><Wallet :size="15" />Solicitar saque</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-vue-next'

type TxStatus = 'Liberada' | 'Aguardando' | 'Sacado'

const today = new Date('2026-04-21')
const daysAgo = (n: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() - n)
  return date.toISOString()
}
const fmt = (iso: string) => `${new Date(iso).toLocaleDateString('pt-BR')} às ${new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
const formatBRL = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const transactions = [
  { id: '1', type: 'entrada', description: 'Comissão - Ca*** Mendes', isoDate: daysAgo(0), amount: 85, status: 'Liberada' as TxStatus },
  { id: '2', type: 'entrada', description: 'Comissão - An*** Lima', isoDate: daysAgo(1), amount: 249, status: 'Aguardando' as TxStatus },
  { id: '3', type: 'saque', description: 'Saque realizado', isoDate: daysAgo(2), amount: -500, status: 'Sacado' as TxStatus },
  { id: '4', type: 'entrada', description: 'Comissão - Br*** Sousa', isoDate: daysAgo(3), amount: 85, status: 'Liberada' as TxStatus },
  { id: '5', type: 'entrada', description: 'Comissão - Fe*** Costa', isoDate: daysAgo(5), amount: 139, status: 'Liberada' as TxStatus },
  { id: '6', type: 'entrada', description: 'Comissão - Ro*** Alves', isoDate: daysAgo(6), amount: 249, status: 'Aguardando' as TxStatus },
  { id: '7', type: 'saque', description: 'Saque realizado', isoDate: daysAgo(8), amount: -800, status: 'Sacado' as TxStatus },
  { id: '8', type: 'entrada', description: 'Comissão - Ju*** Pereira', isoDate: daysAgo(10), amount: 85, status: 'Liberada' as TxStatus },
  { id: '9', type: 'entrada', description: 'Comissão - Ma*** Ribeiro', isoDate: daysAgo(12), amount: 139, status: 'Liberada' as TxStatus },
  { id: '10', type: 'entrada', description: 'Comissão - Le*** Rocha', isoDate: daysAgo(14), amount: 85, status: 'Aguardando' as TxStatus },
].map((tx) => ({ ...tx, datetime: fmt(tx.isoDate) }))

const entradas = transactions.filter((tx) => tx.type === 'entrada').reduce((sum, tx) => sum + tx.amount, 0)
const sacado = transactions.filter((tx) => tx.type === 'saque').reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
const pendente = transactions.filter((tx) => tx.status === 'Aguardando').reduce((sum, tx) => sum + tx.amount, 0)
const disponivel = entradas - sacado - pendente

const balanceCards = [
  { label: 'Saldo disponível', value: disponivel, accent: true },
  { label: 'Total recebido', value: entradas, accent: false },
  { label: 'Total sacado', value: sacado, accent: false },
  { label: 'Saldo pendente', value: pendente, accent: false },
]
const periodOptions = [{ label: '7d', days: 7 }, { label: '30d', days: 30 }, { label: '3m', days: 90 }, { label: '12m', days: 365 }, { label: 'Tudo', days: 9999 }]
const periodDays = ref(30)
const filtered = computed(() => {
  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() - periodDays.value)
  return transactions.filter((tx) => new Date(tx.isoDate) >= cutoff)
})
const statusClass = (status: TxStatus) => status === 'Liberada' ? 'status-ok' : status === 'Aguardando' ? 'status-wait' : 'status-neutral'
</script>

<style scoped>
.balance-grid {
  margin-bottom: 24px;
}
.balance-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.balance-card.accent {
  border-color: rgba(139, 242, 193, 0.2);
}
.balance-card strong {
  color: #fff;
  font-family: Manrope, Inter, sans-serif;
  font-size: 24px;
}
.balance-card.accent strong {
  color: var(--accent);
  font-size: 32px;
}
.movements-card {
  overflow: hidden;
}
.movements-head,
.tx-row {
  display: flex;
  align-items: center;
}
.movements-head {
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.tx-row {
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.tx-icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--muted);
}
.tx-icon.entrada,
.tx-amount.entrada {
  color: var(--accent-2);
}
.tx-icon.entrada {
  background: rgba(67, 229, 177, 0.08);
}
.tx-main {
  min-width: 0;
  flex: 1;
}
.tx-main strong {
  display: block;
}
.tx-main span {
  color: var(--muted);
  font-size: 12px;
}
.tx-amount {
  min-width: 110px;
  color: var(--muted);
  font-family: Manrope, Inter, sans-serif;
  text-align: right;
}
.movement-footer {
  padding: 16px 20px;
}
.movement-footer .btn {
  width: 100%;
}
@media (max-width: 700px) {
  .movements-head,
  .tx-row {
    align-items: flex-start;
    flex-direction: column;
  }
  .tx-amount {
    text-align: left;
  }
}
</style>
