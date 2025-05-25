import type IGame from "../interfaces/game.interface";
import generateMojBroj from "./generateMojBroj.utils";
import generateSlagalica from "./generateSlagalica.utils";

const generateGame = async (locale: 'sr' | 'en') :Promise<IGame> => {
  return {
    slagalica: await generateSlagalica(locale),
    mojBroj: generateMojBroj()
  }
}

export default generateGame