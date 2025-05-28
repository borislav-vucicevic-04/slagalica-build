import type IParovi from "../interfaces/parovi.interface";
import shuffleArray from "./shuffleArray.utils";

const generateParovi = (): IParovi => {
  const obj: IParovi = {
    cards: [
      'apple', 'apple',
      'cherries', 'cherries',
      'clubs', 'clubs',
      'diamonds', 'diamonds',
      'diceOne', 'diceOne',
      'diceSix', 'diceSix',
      'gem', 'gem',
      'heart', 'heart',
      'lemon', 'lemon',
      'plum', 'plum',
      'seven', 'seven',
      'spades', 'spades'
    ]
  };

  return {
    cards: shuffleArray(obj.cards)
  }
}

export default generateParovi;