export const PRECISION = 9;
export const EPSILON = Number(`1e-${PRECISION}`); // 1e-9 or 0.000000001
export const DIGITIZE_PRECISION = 2; // cm is enough for screen digitizing

/**
 * Rounds number to a given decimal precision
 *
 * @param {(number|string)} num
 * @param {number} precision display precision
 * @return {number}
 */
export function roundNumber(
    num: number,
    precision: number = PRECISION,
): number {
  const [base1, exp1 = "0"] = `${num}e`.split("e");
  const value = Math.round(Number(`${base1}e${Number(exp1) + precision}`));

  const [base2, exp2 = "0"] = `${value}e`.split("e");
  return Number(`${base2}e${Number(exp2) - precision}`);
}

export const fixDec = (n: number) =>
  Number.parseFloat(Number(n).toFixed(DIGITIZE_PRECISION));

export function getNumberOrFail(input: string): number {
  const value = Number.parseFloat(input);
  if (Number.isNaN(value)) {
    throw new Error(`Invalid number format for input: '${input}'`);
  }
  return value;
}

export function isNumeric(n: any): boolean {
  return !Number.isNaN(Number.parseFloat(n)) && Number.isFinite(n);
}

/**
 * Guard will throw a TypeError if logical is not met
 */
export const Guard = {
    throwIf: (condition: boolean, message: string): void => {
        if (condition) throw new TypeError(message);
    }
};
