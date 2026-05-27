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

export interface UpdatePayload {
  state: 'checking' | 'available' | 'downloading' | 'downloaded' | 'none' | 'error'
  version?: string
  percent?: number
  message?: string
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
      onUpdate?: (callback: (payload: UpdatePayload) => void) => () => void
      installUpdate?: () => Promise<void>
      openCalculator?: (id: string, type?: 'live' | 'prematch') => Promise<void>
    }
  }
}

export {}
