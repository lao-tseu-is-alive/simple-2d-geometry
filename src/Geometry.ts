export const PRECISION = 10
export const EPSILON = Number(`1e-${PRECISION}`) // 1e-10 or 0.0000000001
export const DIGITIZE_PRECISION = 2 // cm is enough for screen digitizing

/**
 * Rounds number  to a given decimal precision
 *
 * @param {(number|string)} num
 * @param {number} precision display precision
 * @return {number}
 */
export function roundNumber (num:number, precision = PRECISION):number {
    let pair = (num + 'e').split('e')
    let value = Math.round(Number(pair[0] + 'e' + (+pair[1] + precision)))
    pair = (value + 'e').split('e')
    return Number(pair[0] + 'e' + (+pair[1] - precision))
}

export const fixDec = (n:number) => parseFloat(Number(n).toFixed(DIGITIZE_PRECISION))

export function getNumberOrNull(input: string): number | undefined {
    let value: number
    try {
        value = parseFloat(input);
        if (isNaN(value)) {
            throw new Error("Invalid number format");
            return undefined
        } else {
            return value;
        }
    } catch (error) {
        throw new Error(`Failed to parse number from input: '${input}'. Error: ${error}`);
        return undefined
    }
}

export function isNumeric(n:any):boolean {
    return (!isNaN(parseFloat(n)) && isFinite(n))
}
