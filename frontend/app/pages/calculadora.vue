<template>
  <div class="calc-page">
    <SurebetDetailModal :key="reappearKey" :surebet="selected" inline @close="closeWindow" @dismiss="closeWindow" />
    <div v-if="!selected" class="calc-loading">Carregando operação…</div>
  </div>
</template>

<script setup lang="ts">
import SurebetDetailModal from '~/components/dashboard/SurebetDetailModal.vue'
import type { Surebet } from '~/data/surebets'
import { useSurebetsApi } from '~/composables/useSurebetsApi'

// Standalone OS window (opened by Electron). No app chrome — just the calculator,
// rendered inline so the window scrolls naturally and opens at the top.
definePageMeta({ layout: false })

const route = useRoute()
const id = computed(() => String(route.query.id || ''))
const type = String(route.query.type) === 'live' ? 'live' : 'prematch'

// Own live feed (same backend/session) so odds stay live in this separate window.
const { surebets } = useSurebetsApi(type)
const snapshot = ref<Surebet | null>(null)
const live = computed<Surebet | null>(() => surebets.value?.find((s) => s.id === id.value) ?? null)

// Mantém os dados se o jogo sumir do feed; quando reaparece (ausente -> presente),
// bumpa a key pra remontar a calculadora com as ODDS NOVAS (refresh completo).
// Durante a presença contínua a key não muda — o watch de odds do modal atualiza
// sem remontar, preservando os stakes digitados.
const present = ref(false)
const reappearKey = ref(0)
watch(
  live,
  (value) => {
    if (value) {
      snapshot.value = value
      if (!present.value) reappearKey.value += 1
      present.value = true
    } else {
      present.value = false
    }
  },
  { immediate: true },
)

const selected = computed<Surebet | null>(() => live.value ?? snapshot.value)

const closeWindow = () => {
  if (import.meta.client) window.close()
}
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
