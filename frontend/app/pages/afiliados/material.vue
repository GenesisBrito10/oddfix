<template>
  <div class="page-wide">
    <div class="page-header">
      <div>
        <h1 class="page-title">Material de Divulgação</h1>
        <p class="page-subtitle">Banners, textos e recursos para compartilhar</p>
      </div>
    </div>

    <div class="category-row">
      <button v-for="category in categories" :key="category" :class="{ active: active === category }" @click="active = category">{{ category }}</button>
    </div>

    <div class="three-grid">
      <article v-for="material in filtered" :key="material.id" class="material-card card">
        <div v-if="material.textContent" class="text-preview">{{ material.textContent }}</div>
        <div v-else class="media-preview" :style="{ '--material-color': categoryColor[material.category] }">
          <component :is="categoryIcon[material.category]" :size="30" />
          <span>{{ material.dimensions }} · {{ material.type }}</span>
        </div>
        <div class="material-footer">
          <strong>{{ material.name }}</strong>
          <span>{{ material.dimensions }} · {{ material.type }}</span>
          <button v-if="material.textContent" class="btn btn-secondary" @click="copyText(material.id, material.textContent)">
            <component :is="copiedId === material.id ? Check : Copy" :size="13" />{{ copiedId === material.id ? 'Copiado!' : 'Copiar texto' }}
          </button>
          <button v-else class="btn btn-secondary"><Download :size="13" />Baixar</button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Copy, Download, FileText, Image, Layers, Video } from 'lucide-vue-next'

type Category = 'Todos' | 'Banners' | 'Textos prontos' | 'Vídeos' | 'Logos'
type MaterialCategory = Exclude<Category, 'Todos'>

const categories: Category[] = ['Todos', 'Banners', 'Textos prontos', 'Vídeos', 'Logos']
const active = ref<Category>('Todos')
const copiedId = ref<string | null>(null)

const materials: { id: string; category: MaterialCategory; name: string; dimensions: string; type: string; textContent?: string }[] = [
  { id: '1', category: 'Banners', name: 'Banner Facebook', dimensions: '1200 x 628', type: 'PNG' },
  { id: '2', category: 'Banners', name: 'Banner Instagram Post', dimensions: '1080 x 1080', type: 'PNG' },
  { id: '3', category: 'Textos prontos', name: 'Texto - WhatsApp curto', dimensions: '189 palavras', type: 'TXT', textContent: 'Você sabia que é possível garantir lucro em apostas esportivas? A Oddfix identifica surebets em tempo real. Use meu link: oddfix.com.br/ref/joao-silva-2847' },
  { id: '4', category: 'Textos prontos', name: 'Texto - E-mail marketing', dimensions: '312 palavras', type: 'TXT', textContent: 'Olá! Quero te apresentar a Oddfix, a plataforma que identifica oportunidades de arbitragem esportiva. Acesse pelo meu link e teste grátis.' },
  { id: '5', category: 'Vídeos', name: 'Vídeo - Reels 15s', dimensions: '1080 x 1920', type: 'MP4' },
  { id: '6', category: 'Logos', name: 'Logo Oddfix - Fundo transparente', dimensions: '800 x 200', type: 'PNG' },
]

const categoryIcon = { Banners: Image, 'Textos prontos': FileText, Vídeos: Video, Logos: Layers }
const categoryColor = { Banners: '#8dffc7', 'Textos prontos': '#ddf76e', Vídeos: '#7dd3fc', Logos: '#c4b5fd' }
const filtered = computed(() => (active.value === 'Todos' ? materials : materials.filter((item) => item.category === active.value)))

const copyText = async (id: string, text: string) => {
  await navigator.clipboard?.writeText(text)
  copiedId.value = id
  window.setTimeout(() => (copiedId.value = null), 2000)
}
</script>

<style scoped>
.category-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}
.category-row button {
  height: 34px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background: transparent;
  color: var(--muted);
  font-weight: 800;
}
.category-row button.active {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--bg);
}
.material-card {
  overflow: hidden;
}
.media-preview,
.text-preview {
  min-height: 160px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: var(--surface-2);
}
.media-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--material-color);
}
.media-preview span {
  color: #525252;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}
.text-preview {
  padding: 20px;
  color: var(--muted-2);
  font-size: 12px;
  line-height: 1.6;
}
.material-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
}
.material-footer span {
  color: var(--muted);
  font-size: 12px;
}
</style>
