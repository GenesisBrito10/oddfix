import imgBetnacional    from "../../imports/bet-nacional-1.png";
import imgEsportes       from "../../imports/esportes-da-sorte-1.png";
import imgPixbet         from "../../imports/pixbet-1.png";
import imgBetpix365      from "../../imports/betpix365-1.png";
import imgBetao          from "../../imports/betao-1.png";
import imgGalerabet      from "../../imports/galerabet-1.png";
import imgOnaBet         from "../../imports/onabet-1.png";
import imgReals          from "../../imports/reals-1.png";
import imgNovibet        from "../../imports/novibet-1.png";

export interface Bookmaker {
  id: string;
  name: string;
  img: string;
  active: boolean;
}

export const BOOKMAKERS: Bookmaker[] = [
  { id: "betnacional",  name: "Betnacional",      img: imgBetnacional,  active: true  },
  { id: "esportes",     name: "Esportes da Sorte", img: imgEsportes,     active: true  },
  { id: "pixbet",       name: "Pixbet",            img: imgPixbet,       active: true  },
  { id: "betpix365",    name: "Betpix365",         img: imgBetpix365,    active: true  },
  { id: "betao",        name: "Betão",             img: imgBetao,        active: false },
  { id: "galerabet",    name: "Galerabet",         img: imgGalerabet,    active: true  },
  { id: "onabet",       name: "OnaBet",            img: imgOnaBet,       active: false },
  { id: "reals",        name: "REALS",             img: imgReals,        active: true  },
  { id: "novibet",      name: "Novibet",           img: imgNovibet,      active: false },
];

/** Lookup by exact bookmaker display name → logo URL */
export const BOOKMAKER_LOGOS: Record<string, string> = {
  "Betnacional":       imgBetnacional,
  "Esportes da Sorte": imgEsportes,
  "Pixbet":            imgPixbet,
  "Betpix365":         imgBetpix365,
  "Betão":             imgBetao,
  "Galerabet":         imgGalerabet,
  "OnaBet":            imgOnaBet,
  "REALS":             imgReals,
  "Novibet":           imgNovibet,
};

export function getBookmakerLogo(bookmakerName: string): string | undefined {
  return BOOKMAKER_LOGOS[bookmakerName];
}
