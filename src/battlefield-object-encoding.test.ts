import '@testing-library/jest-dom/extend-expect';
import { Position } from './battlefield-object';
import { encodePositions, encodeStringSafely } from './battlefield-object-encoding';

describe('encodeStringSafely', () => {
    test('it should remove reserved delimiter characters', () => {
        const unsafeString = 'Foo;bar~Moo; foo~';
        expect(encodeStringSafely(unsafeString)).toEqual('FoobarMoo%20foo');
    });
});

describe('encodePositions', () => {
    test('it should encode single position correctly', () => {
        const positions: Position[] = [[-30, -30]];
        const encoded = encodePositions(positions);
        expect(encoded).toEqual('~-30~~-30~');
    });
});

describe('decodePositions', () => {
    test('it should load correctly', () => {
        
    });
});