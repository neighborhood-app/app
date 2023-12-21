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


function stringIsValidDate(input: string): boolean;
function stringIsValidDate(input: undefined): undefined;
function stringIsValidDate(input: string | undefined): boolean | undefined {
  if (typeof input === 'string') {
    const date = Date.parse(input);
    return !Number.isNaN(date);
  } 
  return undefined;
}

export { isString, isObject, stringIsValidDate };