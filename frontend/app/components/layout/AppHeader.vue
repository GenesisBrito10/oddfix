<template>
  <header class="app-header">
    <div class="scanline" />

    <div class="header-logo">
      <NuxtLink to="/dashboard" aria-label="Oddfix">
        <OddFixLogo size="sm" />
      </NuxtLink>
    </div>

    <nav class="header-tabs" :class="{ dimmed: isAffiliate }">
      <button class="top-tab" :class="{ active: activeTab === 'prelive' }" @click="navigateTo('/dashboard')">Pré-live</button>
      <button class="top-tab" :class="{ active: activeTab === 'live' }" @click="navigateTo('/live')">
        Live<span class="live-dot" />
      </button>
      <button class="top-tab" :class="{ active: activeTab === 'historico' }" @click="navigateTo('/historico')">Histórico</button>
    </nav>

    <div class="scanner-status desktop-only">
      <Radar :size="14" />
      <span class="scanner-label">Scanner ativo</span>
      <span class="scanner-dot">· 2s</span>
    </div>

    <div class="spacer" />

    <div class="header-actions">
      <button class="icon-button" aria-label="Notificações">
        <Bell :size="16" /><span class="notif-dot" />
      </button>
      <button class="icon-button desktop-only" aria-label="Histórico" @click="navigateTo('/historico')"><History :size="16" /></button>
      <button class="icon-button desktop-only" aria-label="Configurações" @click="navigateTo('/account')"><Settings :size="16" /></button>
      <button class="user-chip desktop-only" @click="navigateTo('/account')">
        <span class="avatar">{{ initials }}</span>
        <span class="user-meta">
          <span class="user-name">{{ displayName }}</span>
          <span class="user-plan">Plano Pro</span>
        </span>
        <ChevronDown :size="14" />
      </button>
      <button class="icon-button mobile-only" aria-label="Abrir menu" @click="$emit('menu')"><Menu :size="20" /></button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bell, ChevronDown, History, Menu, Radar, Settings } from 'lucide-vue-next'

defineEmits<{ menu: [] }>()

const route = useRoute()
const { user } = useAuth()
const isAffiliate = computed(() => route.path.startsWith('/afiliados') || route.path === '/account')
const activeTab = computed(() => {
  if (route.path === '/live') return 'live'
  if (route.path === '/historico') return 'historico'
  return 'prelive'
})

const displayName = computed(() => user.value?.name ?? 'Conta')
const initials = computed(() => {
  const name = user.value?.name?.trim()
  if (!name) return '–'
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})
</script>

<style scoped>
.app-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 64px;
  flex: 0 0 auto;
  padding: 0 18px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(16, 21, 28, 0.92) 0%, rgba(11, 16, 24, 0.88) 100%);
  backdrop-filter: blur(18px);
  z-index: 30;
}

.scanline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(141, 255, 199, 0.6), transparent);
  background-size: 40% 100%;
  background-repeat: no-repeat;
  animation: ofx-scan 6s ease-in-out infinite;
  opacity: 0.5;
  pointer-events: none;
}

.header-logo {
  display: flex;
  align-items: center;
}

.header-logo a {
  text-decoration: none;
}

.header-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  transition: opacity 0.2s;
}

.header-tabs.dimmed {
  opacity: 0.3;
  pointer-events: none;
}

.top-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 64px;
  border: 0;
  background: transparent;
  color: var(--muted);
  padding: 0 11px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.top-tab.active {
  color: var(--accent);
}

.top-tab.active::after {
  content: "";
  position: absolute;
  left: 11px;
  right: 11px;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 10px rgba(141, 255, 199, 0.6);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--danger);
  box-shadow: 0 0 8px var(--danger);
}

.signal-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 6px 10px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--inner);
}

.signal-pill-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.signal-count {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

.signal-sub {
  font-size: 10px;
  color: var(--t3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.scanner-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: var(--r-sm);
  border: 1px solid var(--green-rim);
  background: rgba(32, 230, 154, 0.04);
  color: var(--accent-2);
}

.scanner-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.scanner-dot {
  font-size: 11px;
  color: var(--t3);
}

.spacer {
  flex: 1;
}

.mode-toggle {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: var(--r-sm);
  border: 1px solid var(--line);
  background: var(--inner);
}

.mode-toggle button {
  height: 28px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  padding: 0 11px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.mode-toggle button.active {
  background: var(--card-2);
  color: var(--accent);
  box-shadow: 0 1px 0 rgba(141, 255, 199, 0.1) inset, 0 0 0 1px rgba(141, 255, 199, 0.18);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-button {
  position: relative;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
}

.icon-button:hover {
  background: var(--card-2);
  color: var(--text);
}

.notif-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-2);
  box-shadow: 0 0 6px var(--accent-2);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background: var(--card-2);
  color: var(--text);
}

.avatar {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #20e69a, #6a4dff);
  color: #070a0f;
  font-size: 12px;
  font-weight: 800;
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  text-align: left;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
}

.user-plan {
  font-size: 10px;
  color: var(--t3);
}

.mobile-only {
  display: none;
}

/* Progressively shed decorative status as width tightens, so nav + actions always fit. */
@media (max-width: 1300px) {
  .signal-sub,
  .scanner-label {
    display: none;
  }
}

@media (max-width: 1120px) {
  .signal-pill,
  .scanner-status {
    display: none;
  }
}

@media (max-width: 900px) {
  .app-header {
    gap: 12px;
    padding: 0 16px;
  }

  .header-tabs,
  .mode-toggle,
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: grid;
  }

  .spacer {
    flex: 1;
  }
}
</style>
