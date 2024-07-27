/**
 * Class with many util methods to work with Strings
 */
export class StrUtils {

    /**
     * Method to replace data from a string
     * @param {string} str String to replace the data
     * @param {string} replace String to replace
     * @param {string} replacement String to replacement
     * 
     * @returns {string} Returns the the String with data replaced
     */
    static replace(str: string, replace: string, replacement: string): string {
        return str.split(replace).join(replacement);
    }

    /**
     * Method to count the ocurrences into the String
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     * 
     * @returns {number} Return the ocurrences of `strToCheck` contained in `str`
     */
    static count(str: string, strToCheck: string): number {
        return (str.match(new RegExp(strToCheck, 'g')) || []).length;
    }

    /**
     * Method to check if a String contains other String
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     * 
     * @returns {boolean} true if "strToCheck" exists on "str", false in otherwise
     */
    static contains(str: string, strToCheck: string): boolean {
        return str.indexOf(strToCheck) !== -1;
    }

    /**
     * Method to check if a String contains other String ignoring letter case
     * @param {string} str Source to check
     * @param {string} strToCheck String to check if exists on str
     * 
     * @returns {boolean} true if "strToCheck" exists on "str", false in otherwise
     */
    static containsIgnoreCase(str: string, strToCheck: string): boolean {
        return str.toLowerCase().indexOf(strToCheck.toLowerCase()) !== -1;
    }

    /**
     * Method to split a string by a separator or regexp and process every ocurrecen before join it
     * @param {string} str String to split and process before join
     * @param {string | RegExp} separator The separator string or regexp to split the string
     * @param {string} joiner The string to join the result with it
     * @param {function} processor processor function to process every ocurrence before join all
     * @returns {string} Return a string with the result of split - process - join
     */
    static splitAndJoin(str: string, separator: string | RegExp, joiner: string, processor: (value: string) => string): string {
        return StrUtils.splitAndProcess(str, separator, processor).join(joiner);
    }

    /**
     * Method to split a string by a separator or regexp and process every ocurrecen before return the array of ocurrences
     * @param {string} str String to split and process before join
     * @param {string | RegExp} separator The separator string or regexp to split the string
     * @param {function} processor processor function to process every ocurrence before join all
     * @returns {string[]} Return a string array with every processed ocurrence
     */
    static splitAndProcess(str: string, separator: string | RegExp, processor: (value: string) => any): string[] {
        return str.split(separator).filter((i) => !!i).map((i) => processor(i)).filter((e) => e !== undefined);
    }

    static format(str: string, values: any[]) {
        let result = str;
        for (let i = 0; i < values.length; i++) {
            result = StrUtils.replace(result, `{${i}}`, String(values[i]));
        }
        return result;
    }


    static leftPad(str: string | number, length: number, char: string) {
        let strToProcess = String(str);
        if (strToProcess.length >= length) {
            return strToProcess;
        }
        while (strToProcess.length < length) {
            const nextLength = strToProcess.length + char.length;
            const lengthDiff = length - nextLength;
            if (nextLength <= length) {
                strToProcess = char + strToProcess;
            } else if (lengthDiff > 0) {
                if (char.length >= lengthDiff) {
                    strToProcess = char + strToProcess;
                } else {
                    strToProcess = char.substring(0, lengthDiff) + strToProcess;
                }
            }
        }
        return strToProcess;
    }

    static rigthPad(str: string | number, length: number, char: string) {
        let strToProcess = String(str);
        if (strToProcess.length >= length) {
            return strToProcess;
        }
        while (strToProcess.length < length) {
            const nextLength = strToProcess.length + char.length;
            const lengthDiff = length - nextLength;
            if (nextLength <= length) {
                strToProcess = char + strToProcess;
            } else if (lengthDiff > 0) {
                if (char.length >= lengthDiff) {
                    strToProcess = strToProcess + char;
                } else {
                    strToProcess = strToProcess + char.substring(0, lengthDiff);
                }
            }
        }
        return strToProcess;
    }

    static cameCaseToTitleCase(str: string) {
        const result = str.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    static formatTemplate(sequence: number, format: string){
        if (format) {
            if (!/[a-zA-Z]*({0+}){1}[a-zA-Z]*/gm.test(format)) {
                throw new Error('Wrong Format. Must contains the format {0000...} sequence. Example: "ABC-{0000...}"');
            }
            const formatStr = format.substring(format.indexOf('{'), format.indexOf('}') + 1).trim();
            const formatLength = formatStr.length - 2;
            return StrUtils.replace(format, formatStr, StrUtils.leftPad(sequence, formatLength, '0'));
        }
        return StrUtils.leftPad(sequence, 8, '0');
    }
}
