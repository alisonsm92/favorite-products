export class Ok<E, T> {
    readonly value: T

    constructor(value: T) {
        this.value = value;
    }

    isFail(): this is Fail<E, T> {
        return false;
    }

    isOk(): this is Ok<E, T> {
        return true;
    }
}
export class Fail<E, T> {
    readonly error: E

    constructor(error: E) {
        this.error = error;
    }

    isFail(): this is Fail<E, T> {
        return true;
    }

    isOk(): this is Ok<E, T> {
        return false;
    }
}

export type Either<E, T> = Fail<E, T> | Ok<E, T>

export const ok = <E, T>(error: T): Either<E, T> => new Ok<E, T>(error);

export const fail = <E, T>(value: E): Either<E, T> => new Fail<E, T>(value);
