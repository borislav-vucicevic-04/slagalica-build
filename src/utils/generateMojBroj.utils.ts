import type IMojBroj from "../interfaces/mojBroj.interface";
import getRandomNumber from "./getRandomNumber.utils";

const generateMojBroj = () => {
  const wantedNumber = getRandomNumber(1000);
  const givenNumbers: number[] = [
    getRandomNumber(9) + 1,
    getRandomNumber(9) + 1,
    getRandomNumber(9) + 1,
    getRandomNumber(9) + 1,
    (getRandomNumber(9) + 1) * 10,
    (getRandomNumber(4) + 1) * 25,
  ]
  

  return { wantedNumber, givenNumbers } as IMojBroj;
}

export default generateMojBroj