/* eslint-disable class-methods-use-this */
import { Either, success, fail } from '../../../common/either';
import DeleteCustomer from '../../../core/use-case/delete-customer/port/delete-customer';
import NotFoundError from '../../../core/use-case/error/not-found-error';
import { HttpRequest } from '../port/http';
import DeleteCustomerController from './delete-customer-controller';

type Result = Either<NotFoundError, void>

function makeDeleteCustomer(result?: Result): DeleteCustomer {
    class DeleteCustomerOnDbStub implements DeleteCustomer {
        async execute(): Promise<Result> {
            if (!result) return Promise.reject();
            return Promise.resolve(result);
        }
    }
    return new DeleteCustomerOnDbStub();
}

const makeDeleteCustomerSuccess = () => makeDeleteCustomer(success());
const makeDeleteCustomerFailure = (error: Error) => makeDeleteCustomer(fail(error));
const makeDeleteCustomerThrowError = () => makeDeleteCustomer();

function makeSut(deleteCustomer :DeleteCustomer): DeleteCustomerController {
    return new DeleteCustomerController({ deleteCustomer });
}

describe('Testing DeleteCustomerController', () => {
    test('Should return http response ok when deletes the customer successfully', async () => {
        const httpRequest: HttpRequest = { params: { id: 'id' }, body: null };
        const createCustomer = makeDeleteCustomerSuccess();
        const sut = makeSut(createCustomer);

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(204);
        expect(httpResponse.body).toBeNull();
    });

    test('Should return http response not found when delete customer usa case fails', async () => {
        const httpRequest: HttpRequest = { params: { id: 'id' }, body: null };
        const error = new NotFoundError('customer');
        const createCustomer = makeDeleteCustomerFailure(error);
        const sut = makeSut(createCustomer);

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(404);
        expect(httpResponse.body).toEqual({ error: { message: 'customer not found' } });
    });

    test('Should return http response server error when delete customer usa case throws an error',
        async () => {
            const httpRequest: HttpRequest = { params: { id: 'id' }, body: null };
            const createCustomer = makeDeleteCustomerThrowError();
            const sut = makeSut(createCustomer);

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body).toEqual({ error: { message: 'Internal server error' } });
        });
});
