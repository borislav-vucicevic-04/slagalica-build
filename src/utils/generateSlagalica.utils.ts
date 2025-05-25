import type ISlagalica from "../interfaces/slagalica.interface"
import getRandomNumber from "./getRandomNumber.utils";
import shuffleArray from "./shuffleArray.utils";

const generateSlagalica = async (locale: 'sr' | 'en') => {
  let wordLength = 0;
  let probability = getRandomNumber(100);
  
  if(probability <= 10) wordLength = 8;
  else if(probability <= 22) wordLength = 9;
  else if(probability <= 41) wordLength = 10;
  else if(probability <= 60) wordLength = 11;
  else wordLength = 12;

  if(locale === 'sr') return await generateSerbianSlagalica(wordLength);
  else return await generateEnglishSlagalica(wordLength)
}
const generateSerbianSlagalica = async (wordLength: number) => {
  const abc = "abcčćdđefghijklmnoprsštuvzž";
  const wordLibrary = ((await import('./../assets/database/sr/searbian-words-db.json')).default as string[]);
  const words = wordLibrary.filter(w => w.length === wordLength);
  const returnState: ISlagalica = { computerWord: '', letters: [], wordLibrary};

  returnState.computerWord = words[getRandomNumber(words.length)];
  returnState.letters = returnState.computerWord.split('');

  while(returnState.letters.length < 12) {
    returnState.letters.push(abc[getRandomNumber(abc.length)]);
  }

  returnState.letters = shuffleArray<string>(returnState.letters);

  return returnState
}
const generateEnglishSlagalica = async (wordLength: number) => {
  const abc = "abcdefghijklmnopqrstuvwxyz";
  const wordLibrary = ((await import('./../assets/database/en/english-words-db.json')).default as string[]);
  const words = wordLibrary.filter(w => w.length === wordLength);
  const returnState: ISlagalica = { computerWord: '', letters: [], wordLibrary};
  
  returnState.computerWord = words[getRandomNumber(words.length)];
  returnState.letters = returnState.computerWord.split('');

  while(returnState.letters.length < 12) {
    returnState.letters.push(abc[getRandomNumber(abc.length)]);
  }

  returnState.letters = shuffleArray<string>(returnState.letters);

  return returnState
}

export default generateSlagalica;