import type IGame from "../interfaces/game.interface";
import generateMojBroj from "./generateMojBroj.utils";
import generateSlagalica from "./generateSlagalica.utils";
import generateSpajalica from "./generateSpajalica.utils";

const generateGame = async (locale: 'sr' | 'en') :Promise<IGame> => {
  return {
    slagalica: await generateSlagalica(locale),
    mojBroj: generateMojBroj(),
    spajalica: await generateSpajalica(locale)
  }
}

export default generateGame