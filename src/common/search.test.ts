import { matches } from './search';

describe('search', () => {
    it('should include case insensitive match', () => {
        const result = matches('a', 'A');
        expect(result).toBeTruthy();
    });

    it('should include a subset match', () => {
        const result = matches('a', 'aa');
        expect(result).toBeTruthy();
    });

    it('should work with special chars', () => {
        const result = matches('€óćźżłśąęüöäÖÜÄUSER中国话的Китайск', '€óćźżłśąęüöäÖÜÄUSER中国话的Китайск');
        expect(result).toBeTruthy();
    });

    it('should NOT include a superset match', () => {
        const result = matches('asdf', 'asd');
        expect(result).toBeFalsy();
    });
});
