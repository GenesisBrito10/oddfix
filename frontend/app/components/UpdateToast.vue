<template>
  <Transition name="fade">
    <div v-if="visible" class="update-toast" :class="state">
      <span class="update-icon">
        <CheckCircle2 v-if="state === 'downloaded'" :size="18" />
        <AlertTriangle v-else-if="state === 'error'" :size="18" />
        <Download v-else :size="18" />
      </span>

      <div class="update-text">
        <strong>{{ title }}</strong>
        <span v-if="sub" class="update-sub">{{ sub }}</span>
        <div v-if="state === 'downloading'" class="update-bar"><i :style="{ width: percent + '%' }" /></div>
      </div>

      <button v-if="state === 'downloaded'" class="update-btn" @click="install">Reiniciar agora</button>
      <button class="update-close" aria-label="Fechar" @click="visible = false"><X :size="14" /></button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { AlertTriangle, CheckCircle2, Download, X } from 'lucide-vue-next'
import type { UpdatePayload } from '~/types/electron'

const visible = ref(false)
const state = ref<UpdatePayload['state']>('none')
const version = ref('')
const percent = ref(0)

let stop: (() => void) | undefined

onMounted(() => {
  if (!import.meta.client || !window.oddfixElectron?.onUpdate) return

  stop = window.oddfixElectron.onUpdate((payload) => {
    state.value = payload.state
    if (payload.version) version.value = payload.version
    if (typeof payload.percent === 'number') percent.value = payload.percent
    // Show only the states worth the user's attention.
    visible.value = ['available', 'downloading', 'downloaded', 'error'].includes(payload.state)
  })
})

onUnmounted(() => stop?.())

const title = computed(() => {
  switch (state.value) {
    case 'downloaded':
      return `Atualização ${version.value} pronta`
    case 'downloading':
      return 'Baixando atualização…'
    case 'available':
      return 'Atualização encontrada'
    case 'error':
      return 'Falha ao atualizar'
    default:
      return ''
  }
})

const sub = computed(() => {
  if (state.value === 'downloaded') return 'Reinicie para aplicar'
  if (state.value === 'downloading') return `${percent.value}%`
  if (state.value === 'available') return version.value ? `Versão ${version.value}` : 'Preparando download'
  if (state.value === 'error') return 'Tentaremos de novo automaticamente'
  return ''
})

const install = () => window.oddfixElectron?.installUpdate?.()
</script>

<style scoped>
.update-toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 360px;
  padding: 12px 14px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background: linear-gradient(180deg, var(--chrome-2) 0%, var(--chrome) 100%);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  color: var(--text);
}

.update-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-mint-soft);
  background: var(--green-soft);
  color: var(--accent-2);
}

.update-toast.error .update-icon {
  border-color: rgba(255, 99, 99, 0.4);
  background: rgba(255, 99, 99, 0.1);
  color: #ff6b6b;
}

.update-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.update-text strong {
  font-size: 13px;
  font-weight: 700;
}

.update-sub {
  font-size: 11px;
  color: var(--muted);
}

.update-bar {
  margin-top: 6px;
  height: 4px;
  border-radius: 2px;
  background: var(--surface-3);
  overflow: hidden;
}

.update-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-2), var(--accent));
  transition: width 0.2s ease;
}

.update-btn {
  flex-shrink: 0;
  padding: 7px 12px;
  border: 0;
  border-radius: var(--r-sm);
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: var(--bg);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.update-close {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border: 0;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
  cursor: pointer;
}

.update-close:hover {
  color: var(--text);
}
</style>
