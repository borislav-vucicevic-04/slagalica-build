import type IGame from "../interfaces/game.interface";
import generateSlagalica from "./generateSlagalica.utils";

const generateGame = async (locale: 'sr' | 'en') :Promise<IGame> => {
  return {
    slagalica: await generateSlagalica(locale),
  }
}

export default generateGame