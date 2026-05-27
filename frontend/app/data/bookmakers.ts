export interface Bookmaker {
  id: string
  name: string
  img: string
  active: boolean
}

export const bookmakers: Bookmaker[] = [
  { id: 'betnacional', name: 'Betnacional', img: '/imports/bet-nacional-1.png', active: true },
  { id: 'esportes', name: 'Esportes da Sorte', img: '/imports/esportes-da-sorte-1.png', active: true },
  { id: 'pixbet', name: 'Pixbet', img: '/imports/pixbet-1.png', active: true },
  { id: 'betpix365', name: 'Betpix365', img: '/imports/betpix365-1.png', active: true },
  { id: 'betao', name: 'Betão', img: '/imports/betao-1.png', active: false },
  { id: 'galerabet', name: 'Galerabet', img: '/imports/galerabet-1.png', active: true },
  { id: 'onabet', name: 'OnaBet', img: '/imports/onabet-1.png', active: false },
  { id: 'reals', name: 'REALS', img: '/imports/reals-1.png', active: true },
  { id: 'novibet', name: 'Novibet', img: '/imports/novibet-1.png', active: false },
]

export const getBookmakerLogo = (name: string) => bookmakers.find((bookmaker) => bookmaker.name === name)?.img
