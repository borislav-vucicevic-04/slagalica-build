/**
 * The getRandomNumber function generates a random integer up to a specified maximum value.
 * @param {number} max - The `max` parameter in the `getRandomNumber` function represents the maximum
 * value that the random number generated should not exceed.
 */
const getRandomNumber = (max: number) => Math.floor(Math.random() * max);

export default getRandomNumber