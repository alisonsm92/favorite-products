import { Either, success, fail } from '../../../common/either';
import Product from '../../../core/domain/product';
import ValidationError from '../../../core/error/validation-error';
import GetFavoriteProducts from '../../../core/use-case/get-favorite-products/port/get-favorite-products';
import GetFavoriteProductParams from '../../../core/use-case/get-favorite-products/port/get-favorite-products.params';
import { HttpRequest } from '../port/http';
import GetFavoriteProductController from './get-favorite-product-controller';

type Result = Either<ValidationError, Product[]>

const product: Product = {
    price: 100.0,
    image: 'https://fake-products-api.com/images/uuid.jpg',
    id: '1',
    title: 'Favorite product',
};

function makeGetFavoriteProducts(result?: Result): GetFavoriteProducts {
    class GetFavoriteProductFromDbStub implements GetFavoriteProducts {
        async execute(): Promise<Result> {
            if (!result) return Promise.reject();
            return Promise.resolve(result);
        }
    }
    return new GetFavoriteProductFromDbStub();
}

const makeGetFavoriteProductsSuccess = () => makeGetFavoriteProducts(success([product]));
const makeGetFavoriteProductsFailure = (error: Error) => makeGetFavoriteProducts(fail(error));
const makeGetFavoriteProductsThrowError = () => makeGetFavoriteProducts();

function makeSut(injectedGetFavoriteProduct?: GetFavoriteProducts): GetFavoriteProductController {
    const getFavoriteProduct = injectedGetFavoriteProduct || makeGetFavoriteProductsSuccess();
    return new GetFavoriteProductController(getFavoriteProduct);
}

describe('Testing GetFavoriteProductController', () => {
    test('Should return http response ok when gets the favorite products successfully',
        async () => {
            const params: GetFavoriteProductParams = { customerId: '1' };
            const httpRequest: HttpRequest = { params, body: null };
            const sut = makeSut();

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(200);
            expect(httpResponse.body).toEqual([product]);
        });

    test('Should return http response not found request when fail to get favorite products',
        async () => {
            const params: GetFavoriteProductParams = { customerId: '1' };
            const httpRequest: HttpRequest = { params, body: null };
            const error = new ValidationError('Error message');
            const addFavoriteProduct = makeGetFavoriteProductsFailure(error);
            const sut = makeSut(addFavoriteProduct);

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(404);
            expect(httpResponse.body).toEqual({ error: { message: error.message } });
        });

    test('Should return http response server error when throw an error in the use case',
        async () => {
            const params: GetFavoriteProductParams = { customerId: '1' };
            const httpRequest: HttpRequest = { params, body: null };
            const addFavoriteProduct = makeGetFavoriteProductsThrowError();
            const sut = makeSut(addFavoriteProduct);

            const httpResponse = await sut.handle(httpRequest);

            expect(httpResponse.statusCode).toBe(500);
            expect(httpResponse.body).toEqual({ error: { message: 'Internal server error' } });
        });
});
