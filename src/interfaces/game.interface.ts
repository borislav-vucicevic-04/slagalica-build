import type IAsocijacije from "./asocijacije.interface";
import type IDesnoLijevo from "./desnoLijevo.interface";
import type IMojBroj from "./mojBroj.interface";
import type IParovi from "./parovi.interface";
import type IPremetaljka from "./premetaljka.interface";
import type IPutOkoSvijeta from "./putOkoSvijeta.interface";
import type ISef from "./sef.interface";
import type ISkriveneStaze from "./skriveneStaze.interface";
import type ISlagalica from "./slagalica.interface";
import type ISpajalica from "./spajalica.interface";
import type IZid from "./zid.interface";

export default interface IGame {
  slagalica: ISlagalica,
  // spajalica: ISpajalica,
  // desnoLijevo: IDesnoLijevo,
  // zid: IZid,
  // asocijacije: IAsocijacije,
  // premetaljka: IPremetaljka,
  // parovi: IParovi,
  // mojBroj: IMojBroj,
  // putOkoSvijeta: IPutOkoSvijeta[],
  // sef: ISef,
  // skriveneStaze: ISkriveneStaze
}