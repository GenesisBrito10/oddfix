<template>
  <div class="app-shell">
    <AppHeader @menu="mobileMenuOpen = true" />

    <div class="app-content">
      <AffiliateSidebar v-if="isAffiliate" />
      <SidebarFilters
        v-else
        :filters="filters"
        :mode="isLive ? 'live' : 'pre-live'"
        @change="setFilters"
        @apply="applyFilters"
      />

      <main class="page-main">
        <slot />
      </main>
    </div>

    <BottomNav :filter-count="filterCount" @filter="filterSheetOpen = true" @more="moreOpen = true" />

    <UpdateToast />

    <button v-if="!isAffiliate" class="floating-filter" @click="filterSheetOpen = true">
      <SlidersHorizontal :size="15" />
      Filtrar
      <span v-if="filterCount > 0">{{ filterCount }}</span>
    </button>

    <Transition name="fade">
      <div v-if="filterSheetOpen" class="sheet-backdrop" @click="filterSheetOpen = false">
        <div class="filter-sheet" @click.stop>
          <div class="sheet-head">
            <strong>Filtros</strong>
            <button @click="filterSheetOpen = false"><X :size="18" /></button>
          </div>
          <SidebarFilters
            :filters="filters"
            :mode="isLive ? 'live' : 'pre-live'"
            @change="setFilters"
            @apply="handleMobileApply"
          />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="moreOpen || mobileMenuOpen" class="sheet-backdrop" @click="closeMenus">
        <div class="more-sheet" @click.stop>
          <div class="sheet-head">
            <strong>Menu</strong>
            <button @click="closeMenus"><X :size="18" /></button>
          </div>
          <NuxtLink to="/historico" @click="closeMenus">Histórico</NuxtLink>
          <NuxtLink to="/account" @click="closeMenus">Conta</NuxtLink>
          <NuxtLink to="/login" @click="closeMenus">Sair</NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { SlidersHorizontal, X } from 'lucide-vue-next'
import AppHeader from '~/components/layout/AppHeader.vue'
import AffiliateSidebar from '~/components/layout/AffiliateSidebar.vue'
import BottomNav from '~/components/layout/BottomNav.vue'
import SidebarFilters from '~/components/layout/SidebarFilters.vue'
import UpdateToast from '~/components/UpdateToast.vue'
import type { FilterState } from '~/composables/useFilters'

const route = useRoute()
const preLiveFilters = usePreLiveFilters()
const appliedPreLiveFilters = useAppliedPreLiveFilters()
const liveFilters = useLiveFilters()
const appliedLiveFilters = useAppliedLiveFilters()

const mobileMenuOpen = ref(false)
const filterSheetOpen = ref(false)
const moreOpen = ref(false)

const isAffiliate = computed(() => route.path.startsWith('/afiliados') || route.path === '/account')
const isLive = computed(() => route.path === '/live')
const filters = computed(() => (isLive.value ? liveFilters.value : preLiveFilters.value))
const appliedFilters = computed(() => (isLive.value ? appliedLiveFilters.value : appliedPreLiveFilters.value))
const filterCount = computed(() => (isAffiliate.value ? 0 : activeFilterCount(appliedFilters.value, isLive.value)))

provide('appliedFilters', appliedFilters)
provide('activeTab', computed(() => (isLive.value ? 'live' : 'prelive')))

const setFilters = (next: FilterState) => {
  if (isLive.value) liveFilters.value = next
  else preLiveFilters.value = next
  // Live: reflect changes (stake, bookmakers, ranges) on the cards immediately.
  applyFilters()
}

const applyFilters = () => {
  if (isLive.value) appliedLiveFilters.value = { ...liveFilters.value, profitRange: [...liveFilters.value.profitRange], selectedBookies: [...liveFilters.value.selectedBookies], selectedSports: [...liveFilters.value.selectedSports], disabledMarkets: [...liveFilters.value.disabledMarkets] }
  else appliedPreLiveFilters.value = { ...preLiveFilters.value, profitRange: [...preLiveFilters.value.profitRange], selectedBookies: [...preLiveFilters.value.selectedBookies], selectedSports: [...preLiveFilters.value.selectedSports], disabledMarkets: [...preLiveFilters.value.disabledMarkets] }
}

const handleMobileApply = () => {
  applyFilters()
  filterSheetOpen.value = false
}

const closeMenus = () => {
  moreOpen.value = false
  mobileMenuOpen.value = false
}
</script>

<style scoped>
.floating-filter {
  position: fixed;
  right: 16px;
  bottom: calc(64px + env(safe-area-inset-bottom) + 12px);
  z-index: 35;
  display: none;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--border-mint);
  border-radius: var(--r-sm);
  background: var(--chrome);
  color: var(--accent);
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), var(--shadow-glow);
}

.floating-filter span {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--bg);
  font-size: 10px;
}

.sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(18px);
}

.filter-sheet,
.more-sheet {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  max-height: 88vh;
  overflow-y: auto;
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  border-top: 1px solid var(--line-strong);
  background: var(--chrome);
}

.filter-sheet :deep(.sidebar) {
  display: flex;
  width: 100%;
  height: auto;
  border-right: 0;
}

.filter-sheet :deep(.sidebar-footer) {
  display: none;
}

.sheet-head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--line);
  background: var(--chrome);
}

.sheet-head button {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: var(--r-md);
  background: var(--surface-3);
  color: var(--text);
}

.more-sheet {
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom);
}

.more-sheet a {
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  color: var(--text);
  text-decoration: none;
  font-weight: 700;
}

@media (max-width: 900px) {
  .floating-filter {
    display: flex;
  }
}
</style>
