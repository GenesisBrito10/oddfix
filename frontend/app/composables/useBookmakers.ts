export interface CatalogBookmaker {
  externalBookmakerId: number
  name: string
}

/**
 * Real bookmakers from the backend catalog (synced from BetBurger
 * /user_bookmakers). Loaded once into shared state; used by the filter sidebar.
 */
export const useBookmakers = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const token = useCookie<string | null>('oddfix_token')
  const items = useState<CatalogBookmaker[]>('catalog_bookmakers', () => [])

  const load = async (): Promise<void> => {
    if (!token.value) return
    try {
      items.value = await $fetch<CatalogBookmaker[]>(
        `${apiBase}/catalog/bookmakers`,
        { headers: { Authorization: `Bearer ${token.value}` } },
      )
    } catch {
      // keep whatever we had; the filter just won't list houses
    }
  }

  const names = computed(() => items.value.map((b) => b.name))

  return { bookmakers: items, names, load }
}
