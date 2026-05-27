<template>
  <div class="page-wide">
    <div class="page-header">
      <div>
        <h1 class="page-title">Indicados</h1>
        <p class="page-subtitle">Histórico completo de indicações</p>
      </div>
    </div>

    <div class="stat-grid">
      <div v-for="stat in summary" :key="stat.label" class="panel summary-card">
        <div><span class="section-label">{{ stat.label }}</span><component :is="stat.icon" :size="16" /></div>
        <strong>{{ stat.value }}</strong>
      </div>
    </div>

    <section class="card table-card">
      <div class="filters-row">
        <div class="search-box"><Search :size="14" /><input v-model="search" placeholder="Buscar por nome ou e-mail..."></div>
        <div class="segmented">
          <button v-for="status in statuses" :key="status" class="segment" :class="{ active: statusFilter === status }" @click="statusFilter = status">{{ status }}</button>
        </div>
        <select v-model="period" class="select">
          <option value="all">Todo período</option>
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
        </select>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Nome</th><th>Plano</th><th>Data de cadastro</th><th>Comissão</th><th>Status</th><th /></tr></thead>
          <tbody>
            <tr v-for="ref in pageRows" :key="ref.id">
              <td><strong>{{ ref.name }}</strong><br><span class="muted">{{ ref.email }}</span></td>
              <td><span class="plan-pill">{{ ref.plan }}</span></td>
              <td><span class="muted">{{ ref.date }}</span></td>
              <td><strong>R$ {{ ref.commission.toFixed(2).replace('.', ',') }}</strong></td>
              <td><span class="status" :class="ref.status === 'Liberada' ? 'status-ok' : 'status-wait'">{{ ref.status }}</span></td>
              <td><button class="icon-action"><Info :size="13" /></button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span>{{ filtered.length === 0 ? '0 resultados' : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filtered.length)} de ${filtered.length} indicados` }}</span>
        <div>
          <button class="icon-action" :disabled="page <= 1" @click="page--"><ChevronLeft :size="14" /></button>
          <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === page }" @click="page = p">{{ p }}</button>
          <button class="icon-action" :disabled="page >= totalPages" @click="page++"><ChevronRight :size="14" /></button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Activity, ChevronLeft, ChevronRight, Info, Search, TrendingUp, UserCheck, Users } from 'lucide-vue-next'

const referrals = [
  { id: '1', name: 'Carlos Mendes', email: 'ca***@gmail.com', plan: 'Mensal PRO', date: '15/04/2026', commission: 85, status: 'Liberada' },
  { id: '2', name: 'Ana Lima', email: 'an***@hotmail.com', plan: 'Anual Elite', date: '13/04/2026', commission: 249, status: 'Aguardando' },
  { id: '3', name: 'Bruno Sousa', email: 'br***@gmail.com', plan: 'Mensal PRO', date: '10/04/2026', commission: 85, status: 'Liberada' },
  { id: '4', name: 'Fernanda Costa', email: 'fe***@outlook.com', plan: 'Trimestral', date: '08/04/2026', commission: 139, status: 'Liberada' },
  { id: '5', name: 'Rodrigo Alves', email: 'ro***@gmail.com', plan: 'Anual Elite', date: '05/04/2026', commission: 249, status: 'Aguardando' },
  { id: '6', name: 'Juliana Pereira', email: 'ju***@gmail.com', plan: 'Mensal PRO', date: '02/04/2026', commission: 85, status: 'Liberada' },
  { id: '7', name: 'Marcos Ribeiro', email: 'ma***@yahoo.com.br', plan: 'Trimestral', date: '28/03/2026', commission: 139, status: 'Liberada' },
  { id: '8', name: 'Leticia Rocha', email: 'le***@gmail.com', plan: 'Mensal PRO', date: '25/03/2026', commission: 85, status: 'Aguardando' },
  { id: '9', name: 'Diego Carvalho', email: 'di***@icloud.com', plan: 'Anual Elite', date: '20/03/2026', commission: 249, status: 'Liberada' },
]

const statuses = ['Todos', 'Liberada', 'Aguardando'] as const
const search = ref('')
const statusFilter = ref<(typeof statuses)[number]>('Todos')
const period = ref('all')
const page = ref(1)
const pageSize = 8

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return referrals.filter((ref) => (!q || ref.name.toLowerCase().includes(q) || ref.email.toLowerCase().includes(q)) && (statusFilter.value === 'Todos' || ref.status === statusFilter.value))
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const pageRows = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))

watch([search, statusFilter, period], () => (page.value = 1))

const activeCount = referrals.filter((ref) => ref.status === 'Liberada').length
const summary = [
  { icon: Users, label: 'Total indicados', value: String(referrals.length) },
  { icon: Activity, label: 'Ativos', value: String(activeCount) },
  { icon: UserCheck, label: 'Convertidos', value: String(activeCount) },
  { icon: TrendingUp, label: 'Taxa de conversão', value: `${((activeCount / referrals.length) * 100).toFixed(1)}%` },
]
</script>

<style scoped>
.stat-grid {
  margin-bottom: 24px;
}
.summary-card div,
.filters-row,
.pagination,
.pagination div {
  display: flex;
  align-items: center;
  gap: 12px;
}
.summary-card div {
  justify-content: space-between;
  color: var(--accent);
}
.summary-card strong {
  display: block;
  margin-top: 14px;
  font-family: Manrope, Inter, sans-serif;
  font-size: 28px;
}
.table-card {
  overflow: hidden;
}
.filters-row {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--muted);
}
.search-box input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
}
.muted {
  color: var(--muted);
  font-size: 12px;
}
.plan-pill {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(224, 234, 135, 0.08);
  color: var(--yellow);
  font-size: 11px;
  font-weight: 800;
}
.icon-action,
.page-btn {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  background: transparent;
  color: var(--muted);
}
.icon-action:disabled {
  opacity: 0.35;
}
.pagination {
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--muted);
  font-size: 12px;
}
.page-btn.active {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--bg);
  font-weight: 800;
}
@media (max-width: 900px) {
  .filters-row {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
