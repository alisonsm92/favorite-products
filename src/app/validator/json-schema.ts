import { ValidationError, Validator } from 'jsonschema';
import InvalidInputError from '../../adapter/input/error/invalid-input-error';
import { JsonSchemaValidator, Schema } from '../../adapter/input/port/json-validator';
import { Either, success, fail } from '../../common/either';

export default class JsonSchemaValidatorWrapper implements JsonSchemaValidator {
    private readonly validator: Validator;

    constructor() {
        this.validator = new Validator();
    }

    static formatError(error: ValidationError): string {
        return error.toString().replace('instance.', '');
    }

    validate(input: unknown, schema: Schema): Either<InvalidInputError, void> {
        const { valid, errors } = this.validator.validate(input, schema);
        if (valid) return success();

        const [firstError] = errors;
        const message = JsonSchemaValidatorWrapper.formatError(firstError);
        return fail(new Error(message));
    }
}
