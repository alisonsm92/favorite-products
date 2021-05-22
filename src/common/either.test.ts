import { Either, fail, ok } from './either';

describe('Testing either monad', () => {
    test('Should return a instance of Either with the input value using the method ok', () => {
        const value = 'test';
        const result = ok<Error, string>(value);
        expect(result.isOk()).toBe(true);
        expect(result.isFail()).toBe(false);
        expect(result).toHaveProperty('value', value);
        expect(result).not.toHaveProperty('error');
    });

    test('Should return a instance of Either with the input error message using the method fail',
        () => {
            const error = new Error();
            const result = fail<Error, string>(error);
            expect(result.isOk()).toBe(false);
            expect(result.isFail()).toBe(true);
            expect(result).not.toHaveProperty('value');
            expect(result).toHaveProperty('error', error);
        });
});
