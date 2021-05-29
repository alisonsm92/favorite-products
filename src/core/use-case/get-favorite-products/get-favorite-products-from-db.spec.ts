import { success, fail } from '../../../common/either';
import Product from '../../domain/product';
import ValidationError from '../error/validation-error';
import GetFavoriteProductsFromDB from './get-favorite-products-from-db';
import FindFavoriteProductsRepository from './port/find-favorite-products-repository';

const product: Product = {
    price: 100.0,
    image: 'https://fake-products-api.com/images/uuid.jpg',
    id: '1',
    title: 'Favorite product',
};

function makeFindFavoriteProductRepository(opt = { exists: true }): FindFavoriteProductsRepository {
    class FindFavoriteProductRepositoryStub implements FindFavoriteProductsRepository {
        async findByCustomerId(): Promise<Product[]|null> {
            if (!opt.exists) return Promise.resolve(null);
            return Promise.resolve([product]);
        }
    }
    return new FindFavoriteProductRepositoryStub();
}

function makeSut(findFavoriteProductsRepository? :FindFavoriteProductsRepository) {
    if (!findFavoriteProductsRepository) {
        return new GetFavoriteProductsFromDB(makeFindFavoriteProductRepository());
    }
    return new GetFavoriteProductsFromDB(findFavoriteProductsRepository);
}

describe('Testing GetFavoriteProductsFromDB', () => {
    test('Should return the customer favorite list', async () => {
        const sut = makeSut();
        const result = await sut.execute('customerId');
        expect(result).toEqual(success([product]));
    });

    test('Should return failure when customer not exists', async () => {
        const findFavoriteProductRepository = makeFindFavoriteProductRepository({ exists: false });
        const sut = makeSut(findFavoriteProductRepository);
        const result = await sut.execute('customerId');
        expect(result).toEqual(fail(new ValidationError('Customer not found')));
    });
});
