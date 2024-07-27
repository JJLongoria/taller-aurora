/**
 * Class with manu util methods to work with the JavaScript core
 */
export class CoreUtils {

    /**
     * Method to force to put the data into an array if the data must be an array
     * @param {any} data Data to force be an array
     * 
     * @returns {Array<any>} Returns an array with the data or undefined if data is undefined
     */
    static forceArray<T>(data: any): T[] {
        if (data === undefined) {
            return data;
        }
        return (Array.isArray(data)) ? data as T[] : [data] as T[];
    }

    /**
     * Method to clone an object
     * @param {any} obj Object to clone
     * 
     * @returns {any} Returns the cloned object
     */
    static clone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Method to check if the value is an object
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is an object, false in otherwise
     */
    static isObject(value: any): boolean {
        return !CoreUtils.isArray(value) && typeof value === 'object';
    }

    /**
     * Method to check if the value is a string
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is a string, false in otherwise
     */
    static isString(value: any): boolean {
        return !CoreUtils.isNull(value) && typeof value === 'string';
    }

    /**
     * Method to check if the value is a number
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is a number, false in otherwise
     */
    static isNumber(value: any): boolean {
        return !CoreUtils.isNull(value) && typeof value === 'number';
    }

    /**
     * Method to check if the value is a BigInt
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is a BigInt, false in otherwise
     */
    static isBigInt(value: any): boolean {
        return !CoreUtils.isNull(value) && typeof value === 'bigint';
    }

    /**
     * Method to check if the value is a symbol
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is a symbol, false in otherwise
     */
    static isSymbol(value: any): boolean {
        return !CoreUtils.isNull(value) && typeof value === 'symbol';
    }

    /**
     * Method to check if the value is a boolean
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is a boolean, false in otherwise
     */
    static isBoolean(value: any): boolean {
        return !CoreUtils.isNull(value) && typeof value === 'boolean';
    }

    /**
     * Method to check if the value is a function
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is a function, false in otherwise
     */
    static isFunction(value: any): boolean {
        return !CoreUtils.isNull(value) && typeof value === 'function';
    }

    /**
     * Method to check if the value is an array
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is an array, false in otherwise
     */
    static isArray(value: any): boolean {
        return !CoreUtils.isNull(value) && Array.isArray(value);
    }

    /**
     * Method to check if the value is null or undefined
     * @param {any} value Value to check
     * 
     * @returns {boolean} true if the value is null or undefined, false in otherwise
     */
    static isNull(value: any): boolean {
        return value === undefined || value === null;
    }

    /**
     * Method to check if an object has keys
     * @param {any} value Object to check
     * 
     * @returns {boolean} true if the object has keys, false in otherwise
     */
    static hasKeys(value: any): boolean {
        return !CoreUtils.isNull(value) && CoreUtils.isObject(value) && Object.keys(value).length > 0;
    }

    /**
     * Method to count the keys from an object
     * @param {any} value Object to get the keys
     * 
     * @returns {number} Returns the keys from the object
     */
    static countKeys(value: any): number {
        return (CoreUtils.hasKeys(value)) ? Object.keys(value).length : 0;
    }

    /**
     * Method to get the first element from an object
     * @param {any} value Object to get the first element
     * 
     * @returns {any} Returns the first element data
     */
    static getFirstElement(value: any): any {
        return (CoreUtils.hasKeys(value)) ? value[Object.keys(value)[0]] : 0;
    }

    /**
     * Method to get the last element from an object
     * @param {any} value Object to get the last element
     * 
     * @returns {any} Returns the last element data
     */
    static getLastElement(value: any): any {
        return (CoreUtils.hasKeys(value)) ? value[Object.keys(value)[Object.keys(value).length - 1]] : 0;
    }

    /**
     * Method to get the callback function from function arguments
     * @param {arguments} args function arguments to get the callback
     * 
     * @returns {Function | undefined} Returns a function if exists, or undefined if not exists. 
     */
    static getCallbackFunction(args: any[]): Function | undefined {
        if (args.length === 0) {
            return undefined;
        }
        for (let i = 0; i < args.length; i++) {
            if (CoreUtils.isFunction(args[i])) {
                return args[i];
            }
        }
        return undefined;
    }

    /**
     * Method to sort an Array. You can use fields from elements to sort and sort with case sensitive or insensitive
     * @param {Array<any>} elements Array with the elements to sort
     * @param {Array<string>} [fields] fields from child to sort
     * @param {boolean} [caseSensitive] true if want sort data with case sensitive
     * 
     * @returns {Array<any>} Returns the array sorted
     */
    static sort<T>(elements: any[], fields?: string[], caseSensitive?: boolean): T[] {
        if (Array.isArray(elements) && elements.length > 0) {
            [...elements].sort(function (a, b) {
                if (fields && fields.length > 0) {
                    let nameA = '';
                    let nameB = '';
                    let counter = 0;
                    for (const field of fields) {
                        let valA = (a[field] !== undefined) ? a[field] : "";
                        let valB = (b[field] !== undefined) ? b[field] : "";
                        if (counter === 0) {
                            nameA = valA;
                            nameB = valB;
                        } else {
                            nameA += '_' + valA;
                            nameB += '_' + valB;
                        }
                        counter++;
                    }
                    if (CoreUtils.isNumber(nameA) && CoreUtils.isNumber(nameB)) {
                        if (nameA > nameB) {
                            return 1;
                        } else if (nameA < nameB) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        nameA = '' + nameA;
                        nameB = '' + nameB;
                        if (caseSensitive) {
                            return nameA.localeCompare(nameB);
                        } else {
                            return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
                        }
                    }
                } else {
                    if (CoreUtils.isNumber(a) && CoreUtils.isNumber(b)) {
                        if (a > b) {
                            return 1;
                        } else if (b < a) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        if (caseSensitive) {
                            return a.localeCompare(b);
                        } else {
                            return a.toLowerCase().localeCompare(b.toLowerCase());
                        }
                    }
                }
            });
        }
        return elements;
    }

    /**
     * Method to sort an Array. You can use fields from elements to sort and sort with case sensitive or insensitive
     * @param {Array<any>} elements Array with the elements to sort
     * @param {Array<string>} [fields] fields from child to sort
     * @param {boolean} [caseSensitive] true if want sort data with case sensitive
     * 
     * @returns {Array<any>} Returns the array sorted
     */
    static sortReverse<T>(elements: any[], fields?: string[], caseSensitive?: boolean): T[] {
        if (Array.isArray(elements) && elements.length > 0) {
            [...elements].sort(function (a, b) {
                if (fields && fields.length > 0) {
                    let nameA = '';
                    let nameB = '';
                    let counter = 0;
                    for (const field of fields) {
                        let valA = (a[field] !== undefined) ? a[field] : "";
                        let valB = (b[field] !== undefined) ? b[field] : "";
                        if (counter === 0) {
                            nameA = valA;
                            nameB = valB;
                        } else {
                            nameA += '_' + valA;
                            nameB += '_' + valB;
                        }
                        counter++;
                    }
                    if (CoreUtils.isNumber(nameA) && CoreUtils.isNumber(nameB)) {
                        if (nameA < nameB) {
                            return 1;
                        } else if (nameA > nameB) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        nameA = '' + nameA;
                        nameB = '' + nameB;
                        if (caseSensitive) {
                            return nameB.localeCompare(nameA);
                        } else {
                            return nameB.toLowerCase().localeCompare(nameA.toLowerCase());
                        }
                    }
                } else {
                    if (CoreUtils.isNumber(a) && CoreUtils.isNumber(b)) {
                        if (a > b) {
                            return -1;
                        } else if (a < b) {
                            return 1;
                        }
                        return 0;
                    } else {
                        if (caseSensitive) {
                            return b.localeCompare(a);
                        } else {
                            return b.toLowerCase().localeCompare(a.toLowerCase());
                        }
                    }
                }
            });
        }
        return elements;
    }

    /**
     * Method to deserialize an object into a Typed object
     * @param {any} object The object to deserialize
     * @param {T} type The type to deserialize the object 
     * @returns {{ [key: string]: T }} Return the `object` transformed into the `type`
     */
    static deserializeObject<T>(object: any, type: new (a?: any) => T): { [key: string]: T } {
        const result: { [key: string]: T } = {};
        if (CoreUtils.isObject(object) && CoreUtils.hasKeys(object)) {
            for (const key of Object.keys(object)) {
                result[key] = new type(object[key]);
            }
        }
        return result;
    }

    /**
     * Method to deserialize an array into a Typed array
     * @param {any[]} collection The array to deserialize
     * @param {T} type The type to deserialize the array  
     * @returns {T[]} Return the `collection` array transformed into the `type`
     */
    static deserializeArray<T>(collection: any[], type: new (a?: any) => T): T[] {
        const result: T[] = [];
        if (collection && collection.length) {
            for (const data of collection) {
                result.push(new type(data));
            }
        }
        return result;
    }

    /**
     * Method to move an elements in the specified `collection` 
     * @param {any[]} collection The collection to moe the element
     * @param {number} from The `from`element index to move 
     * @param {number} to The `to` element index to move
     * @returns {any[]} Return the array with the element moved
     */
    static moveArrayElement(collection: any[], from: number, to: number): any[] {
        const element = collection[from];
        collection.splice(from, 1);
        collection.splice(to, 0, element);
        return collection;
    }

    /**
     * Method to create an Universal Unique Identifier (UUID)
     * @returns {string} Return the created `UUID`
     */
    static createUUID(): string {
        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    /**
     * Method to transform a number or string value into a number
     * @param {number | string | null} value Value to transform 
     * @returns Return the `value` transformed into a number or 0 if `value` is `null`
     */
    static toNumber(value: number | string | null): number{
        if(value !== null){
            const strValue = '' + value;
            if(strValue.indexOf(',')){
                return Number(strValue.split(',').join('.'));
            }
            return Number(strValue);
        }
        return 0;
    }

    /**
     * Method to create an hexadecimal random color
     * @returns Return the created color
     */
    static randomColor(){
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

}
