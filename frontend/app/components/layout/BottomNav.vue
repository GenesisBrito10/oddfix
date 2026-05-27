<template>
  <nav class="bottom-nav">
    <NuxtLink to="/dashboard" class="bottom-item" :class="{ active: route.path === '/dashboard' }">
      <Activity :size="18" />
      <span>Pré-live</span>
    </NuxtLink>
    <NuxtLink to="/live" class="bottom-item" :class="{ active: route.path === '/live' }">
      <Radio :size="18" />
      <span>Live</span>
    </NuxtLink>
    <button class="bottom-item" @click="$emit('filter')">
      <SlidersHorizontal :size="18" />
      <span>Filtros</span>
      <small v-if="(filterCount ?? 0) > 0">{{ filterCount ?? 0 }}</small>
    </button>
    <button class="bottom-item" @click="$emit('more')">
      <Menu :size="18" />
      <span>Mais</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { Activity, Menu, Radio, SlidersHorizontal } from 'lucide-vue-next'

defineProps<{ filterCount?: number }>()
defineEmits<{ filter: []; more: [] }>()

const route = useRoute()
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  display: none;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  min-height: calc(64px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid var(--line);
  background: rgba(11, 16, 24, 0.92);
  backdrop-filter: blur(18px);
}

.bottom-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  border: 0;
  background: transparent;
  color: var(--muted);
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}

.bottom-item.active {
  color: var(--accent);
}

.bottom-item small {
  position: absolute;
  top: 8px;
  right: 24%;
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--bg);
  font-size: 10px;
  font-weight: 800;
}

@media (max-width: 900px) {
  .bottom-nav {
    display: grid;
  }
}
</style>
