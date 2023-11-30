/**
 * a type predicate
 * @param value
 * @returns boolean incating whether input is of type string
 */
const isString = (value: unknown): value is string => typeof value === 'string';

/**
 * @param input - (unknown)
 * @returns - type predicate (boolean) indicating whether input is of type `Object`
 */
const isObject = (input: unknown): input is Object => !!input && (typeof input === 'object');

export { isString, isObject };