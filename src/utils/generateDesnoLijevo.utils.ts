import getRandomNumber from './getRandomNumber.utils';
import shuffleArray from './shuffleArray.utils';
import type IDesnoLijevo from '../interfaces/desnoLijevo.interface';

interface Game {
  description: string,
  correct: string[],
  wrong: string[]
}

const generateDesnoLijevo = async (locale: 'sr' | 'en'): Promise<IDesnoLijevo> => {
  let database: Game[] = [];

  if(locale === 'sr')  database = (await import('./../assets/database/sr/desno-lijevo/desno-lijevo.json')).default as Game[];
  else database = (await import('./../assets/database/en/desno-lijevo/desno-lijevo.json')).default as Game[];

  const game = database[getRandomNumber(database.length)];
  
  const correctShuffled = shuffleArray(game.correct);
  const wrongShuffled = shuffleArray(game.wrong);
  const pairs = correctShuffled.map((item, index) => shuffleArray([item, wrongShuffled[index]]));

  return {
    description: game.description,
    correct: correctShuffled,
    wrong: wrongShuffled,
    pairs
  }
}

export default generateDesnoLijevo;