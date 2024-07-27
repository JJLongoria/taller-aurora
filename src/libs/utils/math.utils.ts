import { CoreUtils } from "./core.utils";

/**
 * Class with many util Mathematic methods
 */
export class MathUtils {

    /**
     * Method to round a number with a selected decimal precission. By default, round with two decimals
     * @param {number} number Number to round
     * @param {number} [decimalNumbers] Decimal numbers precission
     * 
     * @returns {number} Returns a rounded number with the specified decimals
     */
    static round(number: number, decimalNumbers?: number): number {
        if (!decimalNumbers) {
            decimalNumbers = 2;
        }
        return Number((Math.round(Number(number + 'e' + decimalNumbers)) + 'e-' + decimalNumbers));
    }

    /**
     * Method to generate a random integer number between `min` and `max` number, both included.
     * @param {number} min Minimum value to generate the number 
     * @param {number} max Maximum value to generate the number
     * @returns {number} Return the generated random integer
     */
    static randomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Method to generate a random double number between `min` and `max` number, both included.
     * @param {number} min Minimum value to generate the number 
     * @param {number} max Maximum value to generate the number
     * @returns {number} Return the generated random number
     */
    static randomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * Method to generate a random integer number with the specified `length`. If legth is null or less than 1, generate a number between 0 and 9
     * @param {number} [length] The number legth 
     * @returns Return a random integer with the specified `length` or between 0-9 if not length specified
     */
    static random(length?: number): number {
        if (!length || length < 1) {
            length = 1;
        }
        length = Math.round(length);
        return Math.floor((Math.random() * Math.pow(10, length)) + 1);
    }

    static average(values: any[], field?: string) {
        if (!values || values.length === 0) {
            return undefined;
        }
        return values.reduce((a, b) => { return CoreUtils.isObject(a) && field ? a[field] + b[field] : a + b }) / values.length;
    }

    static percentage(base: number, toCalculate: number) {
        return toCalculate * 100 / base;
    }

    static floatify(number: number): number {
        return parseFloat((number).toFixed(10));
    }
}
