import { ObjectId } from 'mongodb';
import logger from '../../../app/express/logger/pino';
import { Either, success, fail } from '../../../common/either';
import Customer from '../../../core/domain/customer';
import NotFoundError from '../../../core/error/not-found-error';
import GetCustomer from '../../../core/use-case/get-customer/port/get-customer';
import GetCustomerParams from '../../../core/use-case/get-customer/port/get-customers-params';
import { HttpRequest } from '../port/http';
import GetCustomerController from './get-customer-controller';

type Result = Either<NotFoundError, Customer>

function makeObjectIdString() {
    const objectId = new ObjectId();
    return objectId.toHexString();
}

const customer: Customer = {
    id: makeObjectIdString(),
    name: 'Alison',
    email: 'alison@provider.com',
    favoriteProducts: [
        {
            price: 100.0,
            image: 'https://fake-products-api.com/images/uuid.jpg',
            id: '1',
            title: 'Favorite product',
        },
    ],
};

function makeGetCustomer(result?: Result): GetCustomer {
    class GetCustomerFromDbStub implements GetCustomer {
        async execute(): Promise<Result> {
            if (!result) return Promise.reject();
            return Promise.resolve(result);
        }
    }
    return new GetCustomerFromDbStub();
}

const makeGetCustomerSuccess = (data: Customer) => makeGetCustomer(success(data));
const makeGetCustomerFailure = (error: Error) => makeGetCustomer(fail(error));
const makeGetCustomerThrowError = () => makeGetCustomer();

function makeSut(injectedGetCustomer?: GetCustomer): GetCustomerController {
    const getCustomer = injectedGetCustomer || makeGetCustomerSuccess(customer);
    return new GetCustomerController(getCustomer, logger);
}

describe('Testing GetCustomerController', () => {
    test('Should return http response ok when gets the customer successfully',
        async () => {
            const params: GetCustomerParams = { id: makeObjectIdString() };
            const httpRequest: HttpRequest = { params, body: null };
            const sut = makeSut();

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(200);
            expect(httpResponse.body).toEqual({
                id: customer.id,
                name: customer.name,
                email: customer.email,
            });
        });

    test('Should return http response not found request when fail to get customer',
        async () => {
            const params: GetCustomerParams = { id: makeObjectIdString() };
            const httpRequest: HttpRequest = { params, body: null };
            const error = new NotFoundError('Error message');
            const getCustomer = makeGetCustomerFailure(error);
            const sut = makeSut(getCustomer);

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(404);
            expect(httpResponse.body).toEqual({ error: { message: error.message } });
        });

    test('Should return http response server error when throw an error in the use case',
        async () => {
            const params: GetCustomerParams = { id: makeObjectIdString() };
            const httpRequest: HttpRequest = { params, body: null };
            const getCustomer = makeGetCustomerThrowError();
            const sut = makeSut(getCustomer);

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body).toEqual({ error: { message: 'Internal server error' } });
        });
});
