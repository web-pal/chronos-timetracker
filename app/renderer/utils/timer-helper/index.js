// @flow

export function randomInteger(min: number, max: number): number {
  const rand: number = (min - 0.5) + (Math.random() * ((max - min) + 1));
  return Math.round(rand);
}
