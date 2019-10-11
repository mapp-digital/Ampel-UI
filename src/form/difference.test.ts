import { difference } from './difference';

describe('difference', () => {
    it('should find the difference between two objects', () => {
        const obj1 = {
            a: 'foo',
            b: 'bar',
        };
        const obj2 = {
            a: 'foo',
            b: 'baz',
        };

        const result = difference(obj1, obj2);

        expect(result).toEqual(['b']);
    });

    it('should find the difference between two multi-level deep objects', () => {
        const obj1 = {
            a: 'foo',
            b: 'bar',
            c: {
                a: {
                    b: 'bar',
                },
            },
        };
        const obj2 = {
            a: 'foo',
            b: 'baz',
            c: {
                a: {
                    b: 'baz',
                },
            },
        };

        const result = difference(obj1, obj2);

        expect(result).toEqual(['b', 'c.a.b']);
    });

    it('should return empty list if there are no difference', () => {
        const obj1 = {
            a: 'foo',
            b: 'bar',
        };
        const obj2 = {
            a: 'foo',
            b: 'bar',
        };

        const result = difference(obj1, obj2);

        expect(result).toEqual([]);
    });
});
