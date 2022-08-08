import { assert } from "console";
import { BattlefieldObject, createBattlefieldObject, HeadingDegrees, Position, SpeedKnots } from "./battlefield-object";
import { BattleFieldObjectType, EndType } from "./battlefield-object-types";

// Reserved characters
export const OBJECT_DELIMITER = ';';
export const PROPERTY_DELIMITER = '~';
export const FULL_NUMBER_DELIMITER = '_';

export function decodeInt(s: string): number {
    return Number.parseInt(s, 36);
}

export function encodeInt(n: number) {
    return Math.round(n).toString(36);
}

// Use biggest possible set of unreserved URI characters
const ENCODING_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?/:@-.!$&\'()*+,=';
console.assert(ENCODING_ALPHABET.indexOf(OBJECT_DELIMITER) < 0);
console.assert(ENCODING_ALPHABET.indexOf(PROPERTY_DELIMITER) < 0);
console.assert(ENCODING_ALPHABET.indexOf(FULL_NUMBER_DELIMITER) < 0);
const ZERO_INDEX = Math.floor(ENCODING_ALPHABET.length / 2);
const MAX_COMPACT_VALUE = ENCODING_ALPHABET.length - ZERO_INDEX;
const MIN_COMPACT_VALUE = 0 - ZERO_INDEX - 1;

function encodePositionFullNumber(position: Position) {
    return `${FULL_NUMBER_DELIMITER}${encodeInt(position[0])}${FULL_NUMBER_DELIMITER}${FULL_NUMBER_DELIMITER}${encodeInt(position[1])}${FULL_NUMBER_DELIMITER}`;
}

export function encodePositions(positions: Position[]) {
    let result: string = '';
    if(positions.length > 0) {
        result += encodePositionFullNumber(positions[0]);
        let prevX: number = positions[0][0];
        let prevY: number = positions[0][1];
        for(let i=1; i<positions.length; i++) {
            const dx = Math.round(positions[i][0] - prevX);
            const dy = Math.round(positions[i][1] - prevY);
            console.log("dx", dx);
            console.log("dy", dy);
            if (dx < MAX_COMPACT_VALUE && dx > MIN_COMPACT_VALUE ) {
                result += ENCODING_ALPHABET[ZERO_INDEX + dx];
            } else {
                // TODO: Should we encode full value or delta?
                result += `${FULL_NUMBER_DELIMITER}${encodeInt(dx)}${FULL_NUMBER_DELIMITER}`;
            }
            if (dy < MAX_COMPACT_VALUE && dy > MIN_COMPACT_VALUE ) {
                result += ENCODING_ALPHABET[ZERO_INDEX + dy];
            } else {
                // TODO: Should we encode full value or delta?
                result += `${FULL_NUMBER_DELIMITER}${encodeInt(dy)}${FULL_NUMBER_DELIMITER}`;
            }
            prevX = positions[i][0];
            prevY = positions[i][1];
        }
    }
    return result;
}

export function decodePositions(data: string) {
    const result: Position[] = [];
    let isParsingFullNumber = false;
    let fullNumberResult = '';
    let currentDeltaPos: number[] = [];
    let prevX = 0;
    let prevY = 0;
    for(let i=0; i<data.length; i++) {
        if (isParsingFullNumber) {
            if (data[i] === FULL_NUMBER_DELIMITER) {
                currentDeltaPos.push(decodeInt(fullNumberResult));
                fullNumberResult = '';
                isParsingFullNumber = false;
            } else {
                fullNumberResult += data[i];
            }
        } else {
            if (data[i] === FULL_NUMBER_DELIMITER) {
                isParsingFullNumber = true;
            } else {
                const index = ENCODING_ALPHABET.indexOf(data[i]);
                if (index < 0) {
                    throw new Error(`Compact encoding character ${data[i]} at column ${i} was not found in the encoding alphabet`);
                }
                currentDeltaPos.push(Math.round(index - ZERO_INDEX));
            }
        }

        if (currentDeltaPos.length === 2) {
            const x = Math.round(prevX + currentDeltaPos[0]);
            const y = Math.round(prevY + currentDeltaPos[1]);
            result.push([prevX + currentDeltaPos[0], prevY + currentDeltaPos[1]] as Position);
            currentDeltaPos = [];
            prevX = x;
            prevY = y;
        }
    }
    return result;
}

// TODO: Write tests
const removeUnsafeRegexp = new RegExp(`(${OBJECT_DELIMITER}|${PROPERTY_DELIMITER})`, 'g');
export function encodeStringSafely(str: string): string {
    str = str.replace(removeUnsafeRegexp, '');
    return encodeURI(str);
}
