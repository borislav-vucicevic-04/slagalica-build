import type ISlagalica from "./slagalica.interface";
import type IMojBroj from "./mojBroj.interface";

export default interface IGame {
  slagalica: ISlagalica,
  mojBroj: IMojBroj,
  // spajalica: ISpajalica,
  // desnoLijevo: IDesnoLijevo,
  // zid: IZid,
  // asocijacije: IAsocijacije,
  // premetaljka: IPremetaljka,
  // parovi: IParovi,
  // putOkoSvijeta: IPutOkoSvijeta[],
  // sef: ISef,
  // skriveneStaze: ISkriveneStaze
}