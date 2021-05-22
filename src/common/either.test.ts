import Either from './either';

describe('Testing either monad', () => {
    test('Should return a instance of Either with the input value using the method ok', () => {
        const value = 'test';
        const result = Either.ok<string, Error>(value);
        expect(result).toBeInstanceOf(Either);
        expect(result.isSuccess).toBe(true);
        expect(result.isFailure).toBe(false);
        expect(result.value).toBe(value);
        expect(result.error).toBeUndefined();
    });

    test('Should return a instance of Either with the input error message using the method fail',
        () => {
            const error = new Error('test');
            const result = Either.fail<string, Error>(error);
            expect(result).toBeInstanceOf(Either);
            expect(result.isSuccess).toBe(false);
            expect(result.isFailure).toBe(true);
            expect(result.value).toBeUndefined();
            expect(result.error).toBe(error);
        });
});
