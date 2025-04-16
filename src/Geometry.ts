export const PRECISION = 9;
export const EPSILON = Number(`1e-${PRECISION}`); // 1e-9 or 0.000000001
export const DIGITIZE_PRECISION = 2; // cm is enough for screen digitizing

/**
 * Rounds number  to a given decimal precision
 *
 * @param {(number|string)} num
 * @param {number} precision display precision
 * @return {number}
 */
export function roundNumber(
  num: number,
  precision: number = PRECISION,
): number {
  let pair = (num + "e").split("e");
  let value = Math.round(Number(pair[0] + "e" + (+pair[1] + precision)));
  pair = (value + "e").split("e");
  return Number(pair[0] + "e" + (+pair[1] - precision));
}

export const fixDec = (n: number) =>
  parseFloat(Number(n).toFixed(DIGITIZE_PRECISION));

export function getNumberOrFail(input: string): number {
  const value = parseFloat(input);
  if (isNaN(value)) {
    throw new Error(`Invalid number format for input: '${input}'`);
  }
  return value;
}

export function isNumeric(n: any): boolean {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
