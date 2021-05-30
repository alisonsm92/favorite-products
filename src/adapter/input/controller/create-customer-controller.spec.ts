/* eslint-disable class-methods-use-this */
import { ObjectId } from 'mongodb';
import JsonSchemaValidatorWrapper from '../../../app/validator/json-schema-validator-wrapper';
import { Either, fail, success } from '../../../common/either';
import Customer from '../../../core/domain/customer';
import CreateCustomer from '../../../core/use-case/create-customer/port/create-customer';
import ValidationError from '../../../core/error/validation-error';
import { HttpRequest } from '../port/http';
import CreateCustomerController from './create-customer-controller';

type Result = Either<ValidationError, Customer>

const customer: Customer = { id: makeObjectIdString(), name: 'Alison', email: 'alison@provider.com' };

function makeObjectIdString() {
    const objectId = new ObjectId();
    return objectId.toHexString();
}

function makeCreateCustomer(result?: Result): CreateCustomer {
    class CreateCustomerOnDbStub implements CreateCustomer {
        async execute(): Promise<Result> {
            if (!result) return Promise.reject();
            return Promise.resolve(result);
        }
    }
    return new CreateCustomerOnDbStub();
}

const makeCreateCustomerSuccess = () => makeCreateCustomer(success(customer));
const makeCreateCustomerFailure = (error: Error) => makeCreateCustomer(fail(error));
const makeCreateCustomerThrowError = () => makeCreateCustomer();

function makeSut(createCustomer :CreateCustomer): CreateCustomerController {
    const jsonSchemaValidator = new JsonSchemaValidatorWrapper();
    return new CreateCustomerController(createCustomer, jsonSchemaValidator);
}

describe('Testing CreateCustomerController', () => {
    test('Should return http response ok when creates the customer successfully', async () => {
        const httpRequest: HttpRequest = { body: { name: 'Alison', email: 'alison@provider.com' } };
        const createCustomer = makeCreateCustomerSuccess();
        const sut = makeSut(createCustomer);

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            id: customer.id,
            name: 'Alison',
            email: 'alison@provider.com',
        });
    });

    test('Should return http response bad request when input data is invalid', async () => {
        const httpRequest: HttpRequest = { body: { name: 'Alison' } };
        const createCustomer = makeCreateCustomerSuccess();
        const sut = makeSut(createCustomer);

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual({ error: { message: 'email is required' } });
    });

    test('Should return http response bad request when fail to create the customer', async () => {
        const httpRequest: HttpRequest = { body: { name: 'Alison', email: 'alison@provider.com' } };
        const error = new ValidationError('Error message');
        const createCustomer = makeCreateCustomerFailure(error);
        const sut = makeSut(createCustomer);

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual({ error: { message: error.message } });
    });

    test('Should return http response server error when throw an error in the create the customer',
        async () => {
            const httpRequest: HttpRequest = { body: { name: 'Alison', email: 'alison@provider.com' } };
            const createCustomer = makeCreateCustomerThrowError();
            const sut = makeSut(createCustomer);

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body).toEqual({ error: { message: 'Internal server error' } });
        });
});
