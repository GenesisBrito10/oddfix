<template>
  <div class="calc-page">
    <SurebetDetailModal :surebet="selected" @close="closeWindow" @dismiss="closeWindow" />
    <div v-if="!selected" class="calc-loading">Carregando operação…</div>
  </div>
</template>

<script setup lang="ts">
import SurebetDetailModal from '~/components/dashboard/SurebetDetailModal.vue'
import type { Surebet } from '~/data/surebets'
import { useSurebetsApi } from '~/composables/useSurebetsApi'

// Standalone OS window (opened by Electron). No app chrome — just the calculator.
definePageMeta({ layout: false })

const route = useRoute()
const id = computed(() => String(route.query.id || ''))
const type = String(route.query.type) === 'live' ? 'live' : 'prematch'

// Own live feed (same backend/session) so odds stay live in this separate window.
const { surebets } = useSurebetsApi(type)
const snapshot = ref<Surebet | null>(null)
const live = computed<Surebet | null>(() => surebets.value?.find((s) => s.id === id.value) ?? null)
watch(live, (value) => { if (value) snapshot.value = value }, { immediate: true })
const selected = computed<Surebet | null>(() => live.value ?? snapshot.value)

const closeWindow = () => {
  if (import.meta.client) window.close()
}

// Mark the document so the (page-split) override below only hits THIS window.
onMounted(() => import.meta.client && document.documentElement.classList.add('calc-window'))
onUnmounted(() => import.meta.client && document.documentElement.classList.remove('calc-window'))
</script>

<style scoped>
.calc-page {
  min-height: 100vh;
  background: var(--bg);
}
.calc-loading {
  display: grid;
  place-items: center;
  min-height: 100vh;
  color: var(--muted);
}
</style>

<!-- Non-scoped: the detail panel teleports to <body>, so scoped styles can't reach it.
     Gated by .calc-window (set above) so it only fills THIS window, never the main one. -->
<style>
.calc-window .modal-layer {
  pointer-events: auto;
}
.calc-window .detail-panel {
  inset: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
</style>
