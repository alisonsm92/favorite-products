/* eslint-disable class-methods-use-this */
import { Either, fail, success } from '../../common/either';
import CustomerData from '../../core/domain/customer-data';
import { CreateCustomer } from '../../core/use-case/create-customer/create-customer';
import ValidationError from '../../core/use-case/error/validation-error';
import CreateCustomerController from './create-customer-controller';

type Result = Either<ValidationError, CustomerData>

describe('Testing CreateCustomerController', () => {
    const makeCreateCustomer = (result: Result): CreateCustomer => {
        class CreateCustomerOnDbStub implements CreateCustomer {
            async execute(): Promise<Result> {
                return Promise.resolve(result);
            }
        }
        return new CreateCustomerOnDbStub();
    };
    const makeCreateCustomerSuccess = (createdCustomer: CustomerData) => (
        makeCreateCustomer(success(createdCustomer))
    );
    const makeCreateCustomerFailure = (error: Error) => (
        makeCreateCustomer(fail(error))
    );

    test('Should return http response ok when creates the costumer successfully', async () => {
        const httpRequest = { body: { name: 'Alison', email: 'alison@provider.com' } };
        const createdCustomer = { id: 'ID', ...httpRequest.body };
        const createCustomer = makeCreateCustomerSuccess(createdCustomer);
        const createCustomerController = new CreateCustomerController({ createCustomer });

        const httpResponse = await createCustomerController.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual(createdCustomer);
    });

    test('Should return http response bad request when fail to create the costumer', async () => {
        const httpRequest = { body: { name: 'Alison', email: 'alison@provider.com' } };
        const error = new ValidationError('Error message');
        const createCustomer = makeCreateCustomerFailure(error);
        const createCustomerController = new CreateCustomerController({ createCustomer });

        const httpResponse = await createCustomerController.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual({ error: error.message });
    });
});
