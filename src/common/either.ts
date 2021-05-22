export default class Either<T, E> {
    readonly isSuccess: boolean;

    readonly isFailure: boolean

    readonly error?: E;

    readonly value?: T;

    private constructor({ isSuccess, error, value }: { isSuccess: boolean, error?: E, value?: T }) {
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.value = value;
        this.error = error;
        Object.freeze(this);
    }

    public static ok<U, R>(value: U) : Either<U, R> {
        return new Either<U, R>({ isSuccess: true, value });
    }

    public static fail<U, R>(error: R): Either<U, R> {
        return new Either<U, R>({ isSuccess: false, error });
    }
}
