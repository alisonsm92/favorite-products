/* eslint-disable class-methods-use-this */
import { Either, fail, success } from '../../common/either';
import CustomerData from '../../core/domain/customer-data';
import { CreateCustomer } from '../../core/use-case/create-customer/create-customer';
import ValidationError from '../../core/use-case/error/validation-error';
import CreateCustomerController from './create-customer-controller';

type Result = Either<ValidationError, CustomerData['id']>

describe('Testing CreateCustomerController', () => {
    const makeCreateCustomer = (result?: Result): CreateCustomer => {
        class CreateCustomerOnDbStub implements CreateCustomer {
            async execute(): Promise<Result> {
                if (!result) return Promise.reject();
                return Promise.resolve(result);
            }
        }
        return new CreateCustomerOnDbStub();
    };
    const makeCreateCustomerSuccess = (data: CustomerData) => makeCreateCustomer(success(data.id));
    const makeCreateCustomerFailure = (error: Error) => makeCreateCustomer(fail(error));
    const makeCreateCustomerThrowError = () => makeCreateCustomer();

    test('Should return http response ok when creates the customer successfully', async () => {
        const httpRequest = { body: { name: 'Alison', email: 'alison@provider.com' } };
        const createdCustomer = { id: 'ID', ...httpRequest.body };
        const createCustomer = makeCreateCustomerSuccess(createdCustomer);
        const createCustomerController = new CreateCustomerController({ createCustomer });

        const httpResponse = await createCustomerController.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual(createdCustomer);
    });

    test('Should return http response bad request when fail to create the customer', async () => {
        const httpRequest = { body: { name: 'Alison', email: 'alison@provider.com' } };
        const error = new ValidationError('Error message');
        const createCustomer = makeCreateCustomerFailure(error);
        const createCustomerController = new CreateCustomerController({ createCustomer });

        const httpResponse = await createCustomerController.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual({ error: error.message });
    });

    test('Should return http response server error when throw an error in the create the customer',
        async () => {
            const httpRequest = { body: { name: 'Alison', email: 'alison@provider.com' } };
            const createCustomer = makeCreateCustomerThrowError();
            const createCustomerController = new CreateCustomerController({ createCustomer });

            const httpResponse = await createCustomerController.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body).toEqual({ error: 'Internal server error' });
        });
});
