import getRandomNumber from "./getRandomNumber.utils";
import shuffleArray from "./shuffleArray.utils";
import type ISpajalica from "../interfaces/spajalica.interface";

type Game = {
  description: string,
  pairs: Array<Array<string>>
}

const generateSpajalica = async (locale: 'sr' | 'en'): Promise<ISpajalica> => {
  let database: Game[] = [];

  if(locale === 'sr') database = (await import('./../assets/database/sr/spajalica/spajalica.json')).default as Game[];
  else if(locale === 'en') database = (await import('./../assets/database/en/spajalica/spajalica.json')).default as Game[];

  const game = database[getRandomNumber(database.length)];
  
  const description = game.description;
  const left: string[] = [];
  const right: string[] = [];
  const pairs: string[] = [];

  for(const item of game.pairs) {
    const l = item[0];
    const r = item[1];

    left.push(l);
    right.push(r);
    pairs.push(`${l}-${r}`);
  }

  return { 
    description,
    pairs,
    left: shuffleArray(left),
    right: shuffleArray(right)
  }
}

export default generateSpajalica;