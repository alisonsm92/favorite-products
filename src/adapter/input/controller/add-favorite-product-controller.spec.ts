import { Either, success, fail } from '../../../common/either';
import Product from '../../../core/domain/product';
import AddFavoriteProduct from '../../../core/use-case/add-favorite-product/port/add-favorite-product';
import AddFavoriteProductParams from '../../../core/use-case/add-favorite-product/port/add-favorite-product-params';
import { HttpRequest } from '../port/http';
import AddFavoriteProductController from './add-favorite-product-controller';
import logger from '../../../app/express/logger/pino';
import NotFoundError from '../../../core/error/not-found-error';
import ValidationError from '../../../core/error/validation-error';

type Result = Either<NotFoundError|ValidationError, Product>

const product: Product = {
    price: 100.0,
    image: 'https://fake-products-api.com/images/uuid.jpg',
    id: '1',
    title: 'Favorite product',
};

function makeAddFavoriteProduct(result?: Result): AddFavoriteProduct {
    class AddFavoriteProductOnDbStub implements AddFavoriteProduct {
        async execute(): Promise<Result> {
            if (!result) return Promise.reject();
            return Promise.resolve(result);
        }
    }
    return new AddFavoriteProductOnDbStub();
}

const makeAddFavoriteProductSuccess = () => makeAddFavoriteProduct(success(product));
const makeAddFavoriteProductFailure = (error: Error) => makeAddFavoriteProduct(fail(error));
const makeAddFavoriteProductThrowError = () => makeAddFavoriteProduct();

function makeSut(injectedAddFavoriteProduct?: AddFavoriteProduct): AddFavoriteProductController {
    const addFavoriteProduct = injectedAddFavoriteProduct || makeAddFavoriteProductSuccess();
    return new AddFavoriteProductController(addFavoriteProduct, logger);
}

describe('Testing AddFavoriteProductController', () => {
    test('Should return http response ok when adds the product successfully', async () => {
        const params: AddFavoriteProductParams = { customerId: '1', productId: '1' };
        const httpRequest: HttpRequest = { params, body: null };
        const sut = makeSut();

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toBe(product);
    });

    test('Should return http response not found when the use case returns a not found error',
        async () => {
            const params: AddFavoriteProductParams = { customerId: '1', productId: 'x' };
            const httpRequest: HttpRequest = { params, body: null };
            const error = new NotFoundError('Product');
            const addFavoriteProduct = makeAddFavoriteProductFailure(error);
            const sut = makeSut(addFavoriteProduct);

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(404);
            expect(httpResponse.body).toEqual({ error: { message: error.message } });
        });

    test('Should return http response bad request when the use case return a Validation error',
        async () => {
            const params: AddFavoriteProductParams = { customerId: '1', productId: '1' };
            const httpRequest: HttpRequest = { params, body: null };
            const error = new ValidationError('Error message');
            const addFavoriteProduct = makeAddFavoriteProductFailure(error);
            const sut = makeSut(addFavoriteProduct);

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(400);
            expect(httpResponse.body).toEqual({ error: { message: error.message } });
        });

    test('Should return http response server error when throw an error in the use case', async () => {
        const params: AddFavoriteProductParams = { customerId: '1', productId: '1' };
        const httpRequest: HttpRequest = { params, body: null };
        const addFavoriteProduct = makeAddFavoriteProductThrowError();
        const sut = makeSut(addFavoriteProduct);

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual({ error: { message: 'Internal server error' } });
    });
});
