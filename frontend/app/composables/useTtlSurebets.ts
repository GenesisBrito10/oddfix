import type { Ref } from 'vue'
import type { Surebet } from '~/data/surebets'

export interface TtlSurebet extends Surebet {
  // true = sumiu do último snapshot, mas ainda dentro do TTL (mostrar em amarelo).
  stale: boolean
  // segundos restantes até sair da tela (só relevante quando stale).
  expiresInSeconds: number
}

/**
 * Mantém os surebets na tela por `ttlSeconds` após sumirem do snapshot do backend.
 * Um jogo que sai do feed vira `stale` (amarelo) e só é removido quando o TTL expira.
 * Quando reaparece no feed, volta a `stale:false` com os dados atualizados.
 */
export const useTtlSurebets = (
  source: Ref<Surebet[] | null | undefined>,
  ttlSeconds: Ref<number>,
) => {
  // id -> { dados mais recentes, momento em que foi visto pela última vez }
  const retained = new Map<string, { surebet: Surebet; lastSeen: number }>()
  const now = ref(Date.now())

  const sync = (list: Surebet[]) => {
    const t = Date.now()
    for (const surebet of list) {
      retained.set(surebet.id, { surebet, lastSeen: t })
    }
    now.value = t
  }

  watch(
    source,
    (list) => sync(list ?? []),
    { immediate: true },
  )

  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now()
      // poda os expirados pra o Map não crescer pra sempre
      const ttlMs = Math.max(0, ttlSeconds.value || 0) * 1000
      const liveIds = new Set((source.value ?? []).map((s) => s.id))
      for (const [id, entry] of retained) {
        if (!liveIds.has(id) && now.value - entry.lastSeen > ttlMs) {
          retained.delete(id)
        }
      }
    }, 1000)
  })
  onScopeDispose(() => {
    if (timer) clearInterval(timer)
  })

  const items = computed<TtlSurebet[]>(() => {
    const ttlMs = Math.max(0, ttlSeconds.value || 0) * 1000
    const t = now.value
    const liveIds = new Set((source.value ?? []).map((s) => s.id))
    const out: TtlSurebet[] = []

    for (const [id, entry] of retained) {
      const stale = !liveIds.has(id)
      const age = t - entry.lastSeen
      if (stale && age > ttlMs) continue
      out.push({
        ...entry.surebet,
        stale,
        expiresInSeconds: stale ? Math.max(0, Math.ceil((ttlMs - age) / 1000)) : 0,
      })
    }

    return out
  })

  return items
}
