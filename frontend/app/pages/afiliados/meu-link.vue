<template>
  <div class="page-wide">
    <div class="page-header">
      <div>
        <h1 class="page-title">Meu Link de Afiliado</h1>
        <p class="page-subtitle">Compartilhe e ganhe comissão</p>
      </div>
    </div>

    <section class="panel stack">
      <span class="section-label">Seu link de indicação</span>
      <div class="link-box">
        <strong>{{ affiliateLink }}</strong>
        <button class="btn btn-primary" @click="copyLink"><component :is="copied ? Check : Copy" :size="14" />{{ copied ? 'Copiado!' : 'Copiar link' }}</button>
      </div>
      <span class="section-label">Compartilhar via</span>
      <div class="share-row">
        <a v-for="option in shareOptions" :key="option.label" :href="option.href" target="_blank" rel="noopener noreferrer" :style="{ color: option.color }">
          <component :is="option.icon" :size="15" />{{ option.label }}
        </a>
      </div>
    </section>

    <section class="panel stack">
      <span class="section-label">Estatísticas do link</span>
      <div class="two-grid">
        <div v-for="stat in stats" :key="stat.label" class="mini-stat">
          <span class="section-label">{{ stat.label }}</span>
          <component :is="stat.icon" :size="16" />
          <strong>{{ stat.value }}</strong>
        </div>
      </div>
    </section>

    <div class="two-grid">
      <section class="panel stack">
        <span class="section-label">QR Code</span>
        <div class="qr-box">QR Code</div>
        <button class="btn btn-secondary"><Download :size="14" />Baixar QR Code</button>
      </section>

      <section class="panel stack">
        <span class="section-label">Personalização do link</span>
        <p class="page-subtitle">Escolha um slug personalizado para o seu link.</p>
        <label class="slug-field"><span>/ref/</span><input v-model="slug"></label>
        <small>Funcionalidade disponível em breve.</small>
        <button class="btn btn-muted" disabled>Salvar</button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarDays, Check, Copy, Download, Mail, MessageCircle, MousePointerClick, Send, UserCheck, Users } from 'lucide-vue-next'

const affiliateLink = 'https://oddfix.com.br/ref/joao-silva-2847'
const slug = ref('joao-silva-2847')
const copied = ref(false)

const copyLink = async () => {
  await navigator.clipboard?.writeText(affiliateLink)
  copied.value = true
  window.setTimeout(() => (copied.value = false), 2000)
}

const stats = [
  { icon: MousePointerClick, label: 'Cliques hoje', value: '47' },
  { icon: CalendarDays, label: 'Cliques este mês', value: '1.847' },
  { icon: UserCheck, label: 'Conversões hoje', value: '2' },
  { icon: Users, label: 'Total conversões', value: '64' },
]

const shareOptions = [
  { icon: MessageCircle, label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(affiliateLink)}` },
  { icon: Send, label: 'Telegram', color: '#2AABEE', href: `https://t.me/share/url?url=${encodeURIComponent(affiliateLink)}` },
  { icon: Mail, label: 'E-mail', color: '#a1a1aa', href: `mailto:?subject=Oddfix&body=${encodeURIComponent(affiliateLink)}` },
]
</script>

<style scoped>
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.link-box {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 8px 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: var(--surface-2);
}

.link-box strong {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: var(--accent);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.share-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.share-row a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: var(--surface-2);
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
}

.mini-stat {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--accent);
}

.mini-stat strong {
  grid-column: 1 / -1;
  color: #fff;
  font-family: Manrope, Inter, sans-serif;
  font-size: 24px;
}

.qr-box {
  display: grid;
  place-items: center;
  width: 160px;
  height: 160px;
  align-self: center;
  border: 2px solid rgba(139, 242, 193, 0.35);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.slug-field {
  display: flex;
  overflow: hidden;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: var(--surface-2);
}

.slug-field span {
  display: grid;
  place-items: center;
  padding: 0 12px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--muted);
}

.slug-field input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  padding: 0 12px;
}

small {
  color: #3a3a3a;
}
</style>
