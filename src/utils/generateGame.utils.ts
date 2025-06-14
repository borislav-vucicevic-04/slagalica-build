import type IGame from "../interfaces/game.interface";
import generateDesnoLijevo from "./generateDesnoLijevo.utils";
import generateMojBroj from "./generateMojBroj.utils";
import generateParovi from "./generateParovi.utils";
import generateSlagalica from "./generateSlagalica.utils";
import generateSpajalica from "./generateSpajalica.utils";

const generateGame = async (locale: 'sr' | 'en') :Promise<IGame> => {
  return {
    slagalica: await generateSlagalica(locale),
    mojBroj: generateMojBroj(),
    spajalica: await generateSpajalica(locale),
    parovi: generateParovi(),
    desnoLijevo: await generateDesnoLijevo(locale)
  }
}

export default generateGame