import { assert } from "console";
import { BattlefieldObject, createBattlefieldObject, HeadingDegrees, Position, SpeedKnots } from "./battlefield-object";
import { BattleFieldObjectType, EndType } from "./battlefield-object-types";

// Reserved characters: ,;

export const OBJECT_DELIMITER = ';';
export const PROPERTY_DELIMITER = '~';
export const FULL_NUMBER_DELIMITER = '_';

// Used for v1 format
export function decodeInt(s: string): number {
    return Number.parseInt(s, 36);
}

// Used for v1 format
export function encodeInt(n: number) {
    return Math.round(n).toString(36);
}

// Use biggest possible set of unreserved URI characters
const ENCODING_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?/:@-.!$&\'()*+,=';
console.assert(ENCODING_ALPHABET.indexOf(OBJECT_DELIMITER) < 0);
console.assert(ENCODING_ALPHABET.indexOf(PROPERTY_DELIMITER) < 0);
console.assert(ENCODING_ALPHABET.indexOf(FULL_NUMBER_DELIMITER) < 0);
const ZERO_INDEX = ENCODING_ALPHABET[Math.floor(ENCODING_ALPHABET.length / 2)];
export function encodePositions(positions: Position[]) {
    
}

export function decodePositions(data: string) {
    
}

// TODO: Write tests
const removeUnsafeRegexp = new RegExp(`(${OBJECT_DELIMITER}|${PROPERTY_DELIMITER})`, 'g');
export function encodeStringSafely(str: string): string {
    str = str.replace(removeUnsafeRegexp, '');
    return encodeURI(str);
}
