<template>
  <!-- Progresso do download (canto, não bloqueia) -->
  <Transition name="fade">
    <div v-if="state === 'downloading'" class="upd-toast">
      <span class="upd-toast-ic"><Download :size="16" /></span>
      <div class="upd-toast-tx">
        <strong>Baixando atualização…</strong>
        <div class="upd-bar"><i :style="{ width: percent + '%' }" /></div>
      </div>
      <span class="upd-pct">{{ percent }}%</span>
    </div>
  </Transition>

  <!-- Popup: pergunta se quer atualizar agora -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showModal" class="upd-modal">
        <button class="upd-backdrop" aria-label="Depois" @click="later" />
        <div class="upd-dialog">
          <span class="upd-dialog-ic"><Sparkles :size="22" /></span>
          <h3>Atualização disponível</h3>
          <p>A versão <strong>{{ version }}</strong> está pronta. Recomendamos atualizar para melhor performance e correções.</p>
          <div class="upd-dialog-actions">
            <button class="upd-btn-later" @click="later">Depois</button>
            <button class="upd-btn-now" @click="updateNow">Atualizar agora</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Adiou: botão flutuante persistente -->
  <Transition name="fade">
    <button v-if="showFab" class="upd-fab" title="Recomendado para melhor performance" @click="updateNow">
      <Download :size="15" />
      <span class="upd-fab-tx">
        <strong>Atualizar</strong>
        <span>Recomendado p/ melhor performance</span>
      </span>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { Download, Sparkles } from 'lucide-vue-next'
import type { UpdatePayload } from '~/types/electron'

const state = ref<UpdatePayload['state']>('none')
const version = ref('')
const percent = ref(0)
const deferred = ref(false)

const showModal = computed(() => state.value === 'downloaded' && !deferred.value)
const showFab = computed(() => state.value === 'downloaded' && deferred.value)

let stop: (() => void) | undefined

onMounted(() => {
  if (!import.meta.client || !window.oddfixElectron?.onUpdate) return

  stop = window.oddfixElectron.onUpdate((payload) => {
    if (payload.version) version.value = payload.version
    if (typeof payload.percent === 'number') percent.value = payload.percent
    // A new download resets the "depois" choice.
    if (payload.state === 'downloading' || payload.state === 'available') deferred.value = false
    state.value = payload.state
  })
})

onUnmounted(() => stop?.())

const updateNow = () => window.oddfixElectron?.installUpdate?.()
const later = () => {
  deferred.value = true
}
</script>

<style scoped>
/* Toast de progresso */
.upd-toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 300px;
  padding: 12px 14px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-md);
  background: linear-gradient(180deg, var(--chrome-2) 0%, var(--chrome) 100%);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  color: var(--text);
}
.upd-toast-ic {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-mint-soft);
  background: var(--green-soft);
  color: var(--accent-2);
}
.upd-toast-tx {
  flex: 1;
  min-width: 0;
}
.upd-toast-tx strong {
  font-size: 12.5px;
  font-weight: 700;
}
.upd-bar {
  margin-top: 6px;
  height: 4px;
  border-radius: 2px;
  background: var(--surface-3);
  overflow: hidden;
}
.upd-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent-2), var(--accent));
  transition: width 0.2s ease;
}
.upd-pct {
  font-family: var(--f-mono);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

/* Popup */
.upd-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
}
.upd-backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
}
.upd-dialog {
  position: relative;
  width: 380px;
  max-width: calc(100vw - 32px);
  padding: 24px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-lg);
  background: linear-gradient(180deg, var(--chrome-2) 0%, var(--chrome) 100%);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  text-align: center;
  color: var(--text);
}
.upd-dialog-ic {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto 14px;
  border-radius: 999px;
  border: 1px solid var(--border-mint-soft);
  background: var(--green-soft);
  color: var(--accent-2);
}
.upd-dialog h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
}
.upd-dialog p {
  margin: 0 0 20px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--muted);
}
.upd-dialog-actions {
  display: flex;
  gap: 10px;
}
.upd-btn-later,
.upd-btn-now {
  flex: 1;
  height: 42px;
  border-radius: var(--r-md);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
.upd-btn-later {
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--muted);
}
.upd-btn-later:hover {
  color: var(--text);
}
.upd-btn-now {
  border: 0;
  background: linear-gradient(135deg, var(--accent-2), var(--accent));
  color: var(--bg);
  box-shadow: 0 4px 12px rgba(32, 230, 154, 0.3);
}

/* Botão flutuante (adiou) */
.upd-fab {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--border-mint);
  border-radius: 999px;
  background: linear-gradient(180deg, var(--chrome-2) 0%, var(--chrome) 100%);
  color: var(--accent);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), var(--shadow-glow);
  cursor: pointer;
}
.upd-fab:hover {
  filter: brightness(1.08);
}
.upd-fab-tx {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  text-align: left;
}
.upd-fab-tx strong {
  font-size: 13px;
  font-weight: 800;
  color: var(--text);
}
.upd-fab-tx span {
  font-size: 10px;
  color: var(--muted);
}
</style>
