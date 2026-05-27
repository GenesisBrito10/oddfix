export interface DesktopBookmakerLeg {
  bookmaker: string
  bookmakerKey?: string
  url: string
  market?: string
  odds?: number
  legIndex?: number
}

export interface OpenBookmakersPayload {
  contextId?: string
  surebetId?: string
  game?: string
  legs: DesktopBookmakerLeg[]
}

export interface BookmakerClickPayload {
  contextId?: string | null
  siteKey: string
  bookmaker: string
  legIndex?: number
  text: string
  tag: string
  role?: string
  type?: string
  classes?: string
  pageUrl: string
  clickedAt: string
}

declare global {
  interface Window {
    oddfixElectron?: {
      sites?: Record<string, string>
      launchSites?: () => Promise<void>
      openSite?: (siteKey: string) => Promise<void>
      openBookmakers?: (payload: OpenBookmakersPayload) => Promise<void>
      onCapture?: (callback: (payload: BookmakerClickPayload) => void) => () => void
      onStatus?: (callback: (payload: { siteKey: string; state: string; message: string }) => void) => () => void
      onBookmakerClick?: (callback: (payload: BookmakerClickPayload) => void) => () => void
    }
  }
}

export {}
