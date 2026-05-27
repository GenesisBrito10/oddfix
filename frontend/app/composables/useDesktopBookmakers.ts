import type { BetLeg, Surebet } from '~/data/surebets'
import type { BookmakerClickPayload, DesktopBookmakerLeg, OpenBookmakersPayload } from '~/types/electron'

const toDesktopLeg = (leg: BetLeg, index: number): DesktopBookmakerLeg | null => {
  if (!leg.bookmakerUrl) return null

  return {
    bookmaker: leg.bookmaker,
    bookmakerKey: leg.bookmaker.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    url: leg.bookmakerUrl,
    market: leg.market,
    odds: leg.odds,
    legIndex: index,
  }
}

const openWithBrowserFallback = (legs: DesktopBookmakerLeg[]) => {
  const scr = window.screen as Screen & { availLeft?: number; availTop?: number }
  const n = legs.length
  const w = Math.floor(scr.availWidth / n)
  const h = scr.availHeight
  const baseLeft = scr.availLeft ?? 0
  const top = scr.availTop ?? 0

  let blocked = 0

  legs.forEach((leg, i) => {
    const win = window.open(
      leg.url,
      `oddfix_casa_${i}`,
      `popup=yes,width=${w},height=${h},left=${baseLeft + i * w},top=${top}`,
    )
    if (!win) blocked += 1
  })

  return blocked
}

export const useDesktopBookmakers = () => {
  const isDesktop = computed(() => import.meta.client && Boolean(window.oddfixElectron?.openBookmakers))
  const lastClick = useState<BookmakerClickPayload | null>('desktop-bookmaker-last-click', () => null)
  const listening = useState<boolean>('desktop-bookmaker-listening', () => false)

  const openSurebetBookmakers = async (surebet: Surebet): Promise<{ blocked: number; desktop: boolean }> => {
    if (!import.meta.client) return { blocked: 0, desktop: false }

    const legs = surebet.legs
      .map((leg, index) => toDesktopLeg(leg, index))
      .filter((leg): leg is DesktopBookmakerLeg => Boolean(leg))

    if (!legs.length) return { blocked: 0, desktop: isDesktop.value }

    const payload: OpenBookmakersPayload = {
      contextId: surebet.id,
      surebetId: surebet.id,
      game: surebet.game,
      legs,
    }

    if (window.oddfixElectron?.openBookmakers) {
      await window.oddfixElectron.openBookmakers(payload)
      return { blocked: 0, desktop: true }
    }

    return { blocked: openWithBrowserFallback(legs), desktop: false }
  }

  const onBookmakerClick = (callback: (payload: BookmakerClickPayload) => void) => {
    if (!import.meta.client || !window.oddfixElectron?.onBookmakerClick) {
      return () => {}
    }

    return window.oddfixElectron.onBookmakerClick(callback)
  }

  const startBookmakerClickListener = () => {
    if (!import.meta.client || listening.value || !window.oddfixElectron?.onBookmakerClick) {
      return
    }

    listening.value = true
    window.oddfixElectron.onBookmakerClick((payload) => {
      lastClick.value = payload
    })
  }

  return {
    isDesktop,
    lastClick,
    openSurebetBookmakers,
    onBookmakerClick,
    startBookmakerClickListener,
  }
}
