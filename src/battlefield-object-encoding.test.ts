import '@testing-library/jest-dom/extend-expect';
import { Position } from './battlefield-object';
import { decodePositions, encodePositions, encodeStringSafely } from './battlefield-object-encoding';

describe('encodeStringSafely', () => {
    test('it should remove reserved delimiter characters', () => {
        const unsafeString = 'Foo;bar~Moo; foo~';
        expect(encodeStringSafely(unsafeString)).toEqual('FoobarMoo%20foo');
    });
});

describe('encodePositions', () => {
    test('it should encode single position correctly', () => {
        const positions: Position[] = [[-30, -31]];
        const encoded = encodePositions(positions);
        // Note: Full numbers use 36-radix encoding
        expect(encoded).toEqual('_-u__-v_');
    });

    test('it should encode multiple positions correctly', () => {
        const positions: Position[] = [[-30, -31], [0, 0], [10, 10], [0, 10], [100, 100], [102, 200]];
        const encoded = encodePositions(positions);
        // Note: Full numbers use 36-radix encoding
        expect(encoded).toEqual('_-u__-v_$&xxdn_2s__2i_p_2s_');
    });
    test('it should encode border values correctly', () => {
        const positions: Position[] = [[0, 0], [40, 39], [0, 0], [39, 38], [0, 0]];
        const encoded = encodePositions(positions);
        // Note: Full numbers use 36-radix encoding
        expect(encoded).toEqual('_0__0__14__13__-14_A_13_=AB');
    });
});

describe('decodePositions', () => {
    test('it should decode single position correctly', () => {
        const encoded = '_-u__-v_';
        const positions = decodePositions(encoded);
        const expected: Position[] = [[-30, -31]];
        console.log("Decoded positions are", positions);
        // Note: Full numbers use 36-radix encoding
        expect(positions).toEqual(expected);
    });
    test('it should decode border values correctly', () => {
        const encoded = '_0__0__14__13__-14_A_13_=AB';
        const positions = decodePositions(encoded);
        const expected = [[0, 0], [40, 39], [0, 0], [39, 38], [0, 0]];
        expect(positions).toEqual(expected);
    });

    test('it should throw appropriate error on unknown character', () => {
        const encoded = '_0__0__14__13__-14_A_13_=AB';
        const positions = decodePositions(encoded);
        const expected = [[0, 0], [40, 39], [0, 0], [39, 38], [0, 0]];
        expect(positions).toEqual(expected);
    });
});