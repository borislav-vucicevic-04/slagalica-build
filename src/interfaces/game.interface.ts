import type ISlagalica from "./slagalica.interface";
import type IMojBroj from "./mojBroj.interface";
import type ISpajalica from "./spajalica.interface";
import type IParovi from "./parovi.interface";

export default interface IGame {
  slagalica: ISlagalica,
  mojBroj: IMojBroj,
  spajalica: ISpajalica,
  parovi: IParovi,
  // desnoLijevo: IDesnoLijevo,
  // zid: IZid,
  // asocijacije: IAsocijacije,
  // premetaljka: IPremetaljka,
  // putOkoSvijeta: IPutOkoSvijeta[],
  // sef: ISef,
  // skriveneStaze: ISkriveneStaze
}