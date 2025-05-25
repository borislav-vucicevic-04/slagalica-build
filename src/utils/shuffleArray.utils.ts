import getRandomNumber from "./getRandomNumber.utils"

/**
 * The `shuffleArray` function shuffles the elements of an array in TypeScript.
 * @param {T[]} array - The `array` parameter in the `shuffleArray` function is an array of type `T`,
 * where `T` represents the type of elements in the array that will be shuffled.
 * @returns The `shuffleArray` function returns the input array `array` after shuffling its elements
 * randomly.
 */
const shuffleArray = <T>(array: T[]) => {
  const l = array.length;

  for(let i = l - 1; i > 0; i--) {
    const j = getRandomNumber(i + 1);
    [array[i], array[j]] = [array[j], array[i]]
  }

  return array;
}

export default shuffleArray