import InvalidInputError from '../../adapter/input/error/invalid-input-error';
import { Schema } from '../../adapter/input/port/json-schema-validator';
import { fail, success } from '../../common/either';
import JsonSchemaValidatorWrapper from './json-schema-validator-wrapper';

describe('Testing JsonSchemaValidatorWrapper', () => {
    test('Should return success when validation result is valid', () => {
        const schema: Schema = {
            type: 'object',
            properties: {
                required_property: {
                    type: 'string',
                    required: true,
                },
            },
            additionalProperties: false,
        };
        const input = { required_property: 'value' };
        const sut = new JsonSchemaValidatorWrapper();
        const result = sut.validate(input, schema);
        expect(result).toEqual(success(undefined));
    });

    test('Should return failure with the expected error when validation result is invalid', () => {
        const schema: Schema = {
            type: 'object',
            properties: {
                required_property: {
                    type: 'string',
                    required: true,
                },
            },
            additionalProperties: false,
        };
        const input = {};
        const expectedError = new InvalidInputError('required_property is required');
        const sut = new JsonSchemaValidatorWrapper();
        const result = sut.validate(input, schema);
        expect(result).toEqual(fail(expectedError));
    });
});
