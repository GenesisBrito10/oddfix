<template>
  <div class="page-wide">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard de Afiliados</h1>
        <p class="page-subtitle">Bem-vindo, João Silva - Nível Ouro</p>
      </div>
      <div class="level-badge">🥇 Nível Ouro</div>
    </div>

    <div class="affiliate-link panel">
      <div>
        <span class="section-label">Seu Link de Indicação</span>
        <strong>{{ affiliateLink }}</strong>
      </div>
      <button class="btn btn-muted" @click="copyLink"><Copy :size="14" />{{ copied ? 'Copiado!' : 'Copiar' }}</button>
    </div>

    <div class="stat-grid">
      <div v-for="stat in stats" :key="stat.label" class="panel stat-card">
        <div><span class="section-label">{{ stat.label }}</span><component :is="stat.icon" :size="18" /></div>
        <strong>{{ stat.value }}</strong>
        <small :class="{ warn: !stat.positive }">{{ stat.sub }}</small>
      </div>
    </div>

    <div class="dashboard-grid">
      <section class="panel chart-panel">
        <div class="panel-title"><h2>Desempenho Mensal</h2><span>2026</span></div>
        <div class="bars">
          <div v-for="item in monthlyData" :key="item.month" class="bar-item">
            <i :style="{ height: `${(item.comissao / maxCommission) * 100}%` }" />
            <span>{{ item.month }}</span>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2 class="simple-title">Progresso de Nível</h2>
        <div class="levels">
          <div v-for="level in levels" :key="level.name">
            <div class="level-row"><span>{{ level.icon }} {{ level.name }}</span><small>{{ level.target }} conversões</small></div>
            <div class="level-track"><i :class="{ done: level.done }" :style="{ width: `${Math.min((64 / level.target) * 100, 100)}%` }" /></div>
          </div>
        </div>
        <p class="page-subtitle">Faltam <strong>36 conversões</strong> para Diamante</p>
      </section>
    </div>

    <section class="card table-card">
      <div class="table-head"><h2>Histórico de Indicados</h2><span>Últimos 30 dias</span></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Nome</th><th>Data</th><th>Comissão</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="ref in referrals" :key="ref.id">
              <td>{{ ref.name }}</td>
              <td><span class="muted">{{ ref.date }}</span></td>
              <td><strong>R$ {{ ref.commission.toFixed(2).replace('.', ',') }}</strong></td>
              <td><span class="status" :class="ref.status === 'Liberada' ? 'status-ok' : 'status-wait'">{{ ref.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel withdraw-row">
      <div>
        <strong>Solicitar Saque</strong>
        <p>Saldo disponível: <span>R$ 9.029,00</span></p>
      </div>
      <NuxtLink to="/afiliados/solicitar-saque" class="btn btn-primary"><DollarSign :size="15" />Solicitar Saque</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Clock, Copy, DollarSign, TrendingUp, Users } from 'lucide-vue-next'

const affiliateLink = 'https://oddfix.com.br/ref/joao-silva-2847'
const copied = ref(false)

const copyLink = async () => {
  await navigator.clipboard?.writeText(affiliateLink)
  copied.value = true
  window.setTimeout(() => (copied.value = false), 2000)
}

const stats = [
  { icon: Users, label: 'Cliques no Link', value: '1.847', sub: '+12% este mês', positive: true },
  { icon: TrendingUp, label: 'Conversões', value: '64', sub: 'Taxa: 3.46%', positive: true },
  { icon: DollarSign, label: 'Comissão Total', value: 'R$ 9.284', sub: 'R$ 1.380 este mês', positive: true },
  { icon: Clock, label: 'Comissão Pendente', value: 'R$ 255', sub: '3 aguardando', positive: false },
]

const monthlyData = [
  { month: 'Jan', comissao: 420 }, { month: 'Fev', comissao: 380 }, { month: 'Mar', comissao: 610 },
  { month: 'Abr', comissao: 520 }, { month: 'Mai', comissao: 790 }, { month: 'Jun', comissao: 650 },
  { month: 'Jul', comissao: 870 }, { month: 'Ago', comissao: 940 }, { month: 'Set', comissao: 1100 },
  { month: 'Out', comissao: 980 }, { month: 'Nov', comissao: 1240 }, { month: 'Dez', comissao: 1380 },
]
const maxCommission = Math.max(...monthlyData.map((item) => item.comissao))
const levels = [
  { icon: '🥈', name: 'Prata', target: 50, done: true },
  { icon: '🥇', name: 'Ouro', target: 100, done: false },
  { icon: '💎', name: 'Diamante', target: 200, done: false },
]
const referrals = [
  { id: '1', name: 'Carlos Mendes', date: '15/04/2026', status: 'Liberada', commission: 85 },
  { id: '2', name: 'Ana Lima', date: '13/04/2026', status: 'Aguardando', commission: 85 },
  { id: '3', name: 'Bruno Sousa', date: '10/04/2026', status: 'Liberada', commission: 85 },
  { id: '4', name: 'Fernanda Costa', date: '08/04/2026', status: 'Liberada', commission: 85 },
  { id: '5', name: 'Rodrigo Alves', date: '05/04/2026', status: 'Aguardando', commission: 85 },
]
</script>

<style scoped>
.level-badge {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border: 1px solid rgba(139, 242, 193, 0.25);
  border-radius: 8px;
  background: rgba(139, 242, 193, 0.08);
  color: var(--accent);
  font-weight: 800;
}

.affiliate-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.affiliate-link div {
  min-width: 0;
}

.affiliate-link strong {
  display: block;
  overflow: hidden;
  margin-top: 4px;
  color: var(--accent);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-grid {
  margin-bottom: 24px;
}

.stat-card div {
  display: flex;
  justify-content: space-between;
  color: var(--accent);
}

.stat-card strong {
  display: block;
  margin-top: 14px;
  font-family: Manrope, Inter, sans-serif;
  font-size: 24px;
}

.stat-card small {
  color: var(--accent);
  font-weight: 600;
}

.stat-card small.warn {
  color: var(--yellow);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.panel-title,
.table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.panel-title h2,
.table-head h2,
.simple-title {
  margin: 0;
  color: #fff;
  font-size: 14px;
}

.panel-title span,
.table-head span {
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
}

.bars {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  align-items: end;
  height: 190px;
  gap: 10px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  gap: 8px;
  height: 100%;
}

.bar-item i {
  width: 100%;
  min-height: 12px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, rgba(139, 242, 193, 0.9), rgba(139, 242, 193, 0.18));
}

.bar-item span,
.muted {
  color: var(--muted);
  font-size: 12px;
}

.levels {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 18px 0;
}

.level-row {
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 13px;
}

.level-row small {
  color: var(--muted);
}

.level-track {
  height: 4px;
  margin-top: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--surface-3);
}

.level-track i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--accent);
}

.level-track i.done {
  background: var(--muted);
}

.table-card {
  overflow: hidden;
  margin-bottom: 24px;
}

.table-head {
  margin: 0;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.withdraw-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.withdraw-row p {
  margin: 4px 0 0;
  color: var(--muted);
}

.withdraw-row p span {
  color: var(--accent);
  font-weight: 800;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .affiliate-link,
  .withdraw-row {
    align-items: stretch;
    flex-direction: column;
  }

  .bars {
    gap: 5px;
  }
}
</style>
