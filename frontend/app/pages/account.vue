<template>
  <div class="page-wide">
    <div class="page-header">
      <div>
        <h1 class="page-title">Configurações da conta</h1>
        <p class="page-subtitle">Gerencie seu perfil, segurança e preferências</p>
      </div>
    </div>

    <div class="account-layout">
      <aside class="account-tabs">
        <button v-for="tab in tabs" :key="tab.id" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
          <component :is="tab.icon" :size="15" />{{ tab.label }}
        </button>
      </aside>

      <div class="account-content">
        <section v-if="activeTab === 'perfil'" class="panel tab-panel">
          <h2>Informações pessoais</h2>
          <div class="profile-row">
            <div class="profile-avatar">{{ initials }}<button><Upload :size="11" /></button></div>
            <div><strong>{{ profile.name || 'Conta' }}</strong><p class="page-subtitle">Enviar nova foto</p></div>
          </div>
          <Field label="Nome completo" v-model="profile.name" />
          <Field label="E-mail" v-model="profile.email" readonly />
          <Field label="Telefone" v-model="profile.phone" />
          <button class="btn btn-primary" @click="save('perfil')">{{ saved === 'perfil' ? 'Salvo!' : 'Salvar alterações' }}</button>
        </section>

        <section v-if="activeTab === 'seguranca'" class="tab-stack">
          <div class="panel tab-panel">
            <h2>Alterar senha</h2>
            <Field label="Senha atual" v-model="security.current" type="password" />
            <Field label="Nova senha" v-model="security.next" type="password" />
            <Field label="Confirmar nova senha" v-model="security.confirm" type="password" />
            <button class="btn btn-primary" @click="save('seguranca')">{{ saved === 'seguranca' ? 'Salvo!' : 'Atualizar senha' }}</button>
          </div>
          <div class="panel tab-panel">
            <h2>Autenticação em dois fatores</h2>
            <ToggleRow title="2FA" description="Adicione uma camada extra de segurança à sua conta." v-model="twoFactor" />
          </div>
          <div class="panel tab-panel">
            <h2>Sessões ativas</h2>
            <div v-for="session in sessions" :key="session.device" class="session-row"><Monitor :size="14" /><div><strong>{{ session.device }}</strong><span>{{ session.location }} · {{ session.date }}</span></div><ChevronRight :size="14" /></div>
            <button class="btn btn-danger">Encerrar todas as sessões</button>
          </div>
        </section>

        <section v-if="activeTab === 'notificacoes'" class="panel tab-panel">
          <h2>Preferências de notificação</h2>
          <ToggleRow title="Novas oportunidades de surebet" description="Receba alertas em tempo real de novas surebets disponíveis" v-model="notifications.surebets" />
          <ToggleRow title="Oportunidades acima de % lucro" description="Notifique apenas surebets com lucro acima do percentual definido" v-model="notifications.threshold" />
          <label v-if="notifications.threshold" class="threshold-field"><span class="section-label">Lucro mínimo (%)</span><input v-model="notifications.thresholdValue" type="number" class="input"></label>
          <ToggleRow title="Resumo diário por e-mail" description="Receba um resumo das melhores oportunidades do dia" v-model="notifications.daily" />
          <ToggleRow title="Novidades e atualizações da plataforma" description="Fique por dentro de novas funcionalidades e melhorias" v-model="notifications.updates" />
          <ToggleRow title="Atividade de afiliados" description="Notifique quando indicados se converterem em membros ativos" v-model="notifications.affiliates" />
          <button class="btn btn-primary" @click="save('notificacoes')">{{ saved === 'notificacoes' ? 'Salvo!' : 'Salvar preferências' }}</button>
        </section>

        <section v-if="activeTab === 'plano'" class="tab-stack">
          <div class="panel tab-panel">
            <h2>Plano atual</h2>
            <div class="plan-card">
              <div><span class="section-label">Plano atual</span><strong>PRO Mensal</strong><p>Renova em <b>30/05/2026</b></p></div>
              <div><strong>R$ 97</strong><p>/mês</p></div>
            </div>
            <div class="button-row"><button class="btn btn-primary">Fazer upgrade para Anual</button><button class="btn btn-danger">Cancelar plano</button></div>
          </div>
          <div class="card table-card">
            <div class="table-head"><h2>Histórico de pagamentos</h2></div>
            <table class="data-table">
              <thead><tr><th>Data</th><th>Plano</th><th>Valor</th><th>Status</th></tr></thead>
              <tbody><tr v-for="payment in payments" :key="payment.date"><td>{{ payment.date }}</td><td>{{ payment.plan }}</td><td>{{ payment.amount }}</td><td><span class="status status-ok">{{ payment.status }}</span></td></tr></tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, ChevronRight, CreditCard, Monitor, Shield, Upload, User } from 'lucide-vue-next'

type Tab = 'perfil' | 'seguranca' | 'notificacoes' | 'plano'

const tabs = [
  { id: 'perfil' as Tab, label: 'Perfil', icon: User },
  { id: 'seguranca' as Tab, label: 'Segurança', icon: Shield },
  { id: 'notificacoes' as Tab, label: 'Notificações', icon: Bell },
  { id: 'plano' as Tab, label: 'Plano e assinatura', icon: CreditCard },
]
const activeTab = ref<Tab>('perfil')
const saved = ref('')
const { user } = useAuth()
const profile = reactive({
  name: user.value?.name ?? '',
  email: user.value?.email ?? '',
  phone: '',
})
const initials = computed(() => {
  const name = profile.name.trim()
  if (!name) return '–'
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})
const security = reactive({ current: '', next: '', confirm: '' })
const twoFactor = ref(false)
const notifications = reactive({ surebets: true, threshold: false, thresholdValue: 3, daily: true, updates: false, affiliates: true })
const sessions = [
  { device: 'Chrome · macOS', location: 'São Paulo, SP', date: 'Agora' },
  { device: 'Safari · iPhone 15', location: 'São Paulo, SP', date: 'Ontem, 22:14' },
  { device: 'Chrome · Windows 11', location: 'Campinas, SP', date: '18 abr 2026' },
]
const payments = [
  { date: '21 mar 2026', plan: 'PRO Mensal', amount: 'R$ 97,00', status: 'Pago' },
  { date: '21 fev 2026', plan: 'PRO Mensal', amount: 'R$ 97,00', status: 'Pago' },
  { date: '21 jan 2026', plan: 'PRO Mensal', amount: 'R$ 97,00', status: 'Pago' },
]
const save = (section: string) => {
  saved.value = section
  window.setTimeout(() => (saved.value = ''), 2000)
}
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    Field: {
      props: { label: String, modelValue: String, readonly: Boolean, type: { type: String, default: 'text' } },
      emits: ['update:modelValue'],
      template: `<label class="field-block"><span class="section-label">{{ label }}</span><input class="input" :type="type" :value="modelValue" :readonly="readonly" @input="$emit('update:modelValue', $event.target.value)"></label>`,
    },
    ToggleRow: {
      props: { title: String, description: String, modelValue: Boolean },
      emits: ['update:modelValue'],
      template: `<div class="toggle-row"><div><strong>{{ title }}</strong><p>{{ description }}</p></div><button :class="{ on: modelValue }" @click="$emit('update:modelValue', !modelValue)"><span /></button></div>`,
    },
  },
})
</script>

<style scoped>
.account-layout {
  display: flex;
  gap: 24px;
}
.account-tabs {
  display: flex;
  flex: 0 0 220px;
  flex-direction: column;
  gap: 4px;
}
.account-tabs button {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--muted-2);
  padding: 0 12px;
  text-align: left;
}
.account-tabs button.active {
  background: var(--accent);
  color: var(--bg);
  font-weight: 800;
}
.account-content {
  flex: 1;
  min-width: 0;
}
.tab-stack,
.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tab-stack {
  gap: 16px;
}
.tab-panel h2,
.table-head h2 {
  margin: 0 0 6px;
  font-size: 14px;
}
.profile-row,
.session-row,
.button-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.profile-avatar {
  position: relative;
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  border: 2px solid var(--accent);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--accent);
  font-family: Manrope, Inter, sans-serif;
  font-size: 24px;
  font-weight: 800;
}
.profile-avatar button {
  position: absolute;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 2px solid var(--bg);
  border-radius: 999px;
  background: var(--accent);
  color: var(--bg);
}
.field-block,
.threshold-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.toggle-row p,
.session-row span,
.plan-card p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 13px;
}
.toggle-row button {
  position: relative;
  width: 40px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  background: var(--surface-3);
}
.toggle-row button.on {
  background: var(--accent);
}
.toggle-row button span {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: var(--bg);
  transition: transform 0.2s;
}
.toggle-row button.on span {
  transform: translateX(18px);
}
.session-row {
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--surface-2);
}
.session-row div {
  flex: 1;
}
.plan-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border: 1px solid rgba(139, 242, 193, 0.2);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(139, 242, 193, 0.08), rgba(67, 229, 177, 0.04));
}
.plan-card strong {
  display: block;
  color: #fff;
  font-family: Manrope, Inter, sans-serif;
  font-size: 24px;
}
.plan-card > div:last-child {
  text-align: right;
}
.plan-card > div:last-child strong {
  color: var(--accent);
  font-size: 28px;
}
.table-card {
  overflow: hidden;
}
.table-head {
  padding: 16px 20px 0;
}
@media (max-width: 900px) {
  .account-layout {
    flex-direction: column;
  }
  .account-tabs {
    flex-basis: auto;
  }
}
</style>
