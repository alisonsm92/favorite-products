export class Success<E, T> {
    readonly value: T

    constructor(value: T) {
        this.value = value;
    }

    isFailure(): this is Failure<E, T> {
        return false;
    }

    isSuccess(): this is Success<E, T> {
        return true;
    }
}
export class Failure<E, T> {
    readonly error: E

    constructor(error: E) {
        this.error = error;
    }

    isFailure(): this is Failure<E, T> {
        return true;
    }

    isSuccess(): this is Success<E, T> {
        return false;
    }
}

export type Either<E, T> = Failure<E, T> | Success<E, T>

export const success = <E, T>(error: T): Either<E, T> => new Success<E, T>(error);

export const fail = <E, T>(value: E): Either<E, T> => new Failure<E, T>(value);
