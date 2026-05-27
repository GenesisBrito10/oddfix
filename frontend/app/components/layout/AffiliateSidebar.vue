<template>
  <aside class="affiliate-sidebar">
    <div class="affiliate-badge">
      <span>Afiliado</span>
      <strong>Nível Ouro</strong>
    </div>

    <nav class="affiliate-nav">
      <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link" :class="{ active: isActive(item.to) }">
        <component :is="item.icon" :size="16" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="affiliate-footer">
      <NuxtLink to="/account" class="nav-link" :class="{ active: route.path === '/account' }"><User :size="15" /> Account</NuxtLink>
      <NuxtLink to="/logout" class="nav-link"><LogOut :size="15" /> Logout</NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { FileImage, LayoutDashboard, Link2, LogOut, Receipt, User, Users, Wallet } from 'lucide-vue-next'

const route = useRoute()
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/afiliados' },
  { icon: Link2, label: 'Meu link', to: '/afiliados/meu-link' },
  { icon: Receipt, label: 'Extrato', to: '/afiliados/extrato' },
  { icon: Users, label: 'Indicados', to: '/afiliados/indicados' },
  { icon: Wallet, label: 'Solicitar saque', to: '/afiliados/solicitar-saque' },
  { icon: FileImage, label: 'Material de divulgação', to: '/afiliados/material' },
]

const isActive = (path: string) => (path === '/afiliados' ? route.path === path : route.path.startsWith(path))
</script>

<style scoped>
.affiliate-sidebar {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: calc(100vh - 56px);
  flex: 0 0 auto;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background: var(--surface);
}

.affiliate-badge {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 20px 16px;
}

.affiliate-badge span {
  color: var(--accent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.affiliate-badge strong {
  color: var(--muted);
  font-size: 12px;
}

.affiliate-nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.affiliate-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 12px;
  border-radius: 4px;
  color: var(--muted-2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.nav-link:hover {
  color: #fff;
}

.nav-link.active {
  background: var(--accent);
  color: var(--bg);
  font-weight: 800;
}

@media (max-width: 900px) {
  .affiliate-sidebar {
    display: none;
  }
}
</style>
