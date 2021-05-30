/* eslint-disable max-classes-per-file */
import { fail, success } from '../../../common/either';
import Customer from '../../domain/customer';
import Product from '../../domain/product';
import ValidationError from '../../error/validation-error';
import FindCustomerRepository from '../common/port/find-customer-repository';
import AddFavoriteProductOnDb from './add-favorite-product-on-db';
import FindProductRepository from './port/find-product-repository';
import AddFavoriteProductRepository from './port/add-favorite-product-repository';

type Options = { exists: boolean, favoriteProducts? :Product[] }

const customer: Customer = { id: '1', name: 'Alison', email: 'alison@provider.com' };
const product: Product = {
    price: 100.0,
    image: 'https://fake-products-api.com/images/uuid.jpg',
    id: '1',
    title: 'Favorite product',
};

function makeFindCustomerRepository(opt: Options = { exists: true, favoriteProducts: [] })
    : FindCustomerRepository {
    class FindCustomerRepositoryStub implements FindCustomerRepository {
        async findById(): Promise<Customer|null> {
            if (opt.exists) {
                return Promise.resolve({ ...customer, favoriteProducts: opt.favoriteProducts });
            }
            return Promise.resolve(null);
        }
    }
    return new FindCustomerRepositoryStub();
}

function makeFindProductRepository(opt: Options = { exists: true }): FindProductRepository {
    class FindProductRepositoryStub implements FindProductRepository {
        async findById(): Promise<Product|null> {
            if (opt.exists) return Promise.resolve(product);
            return Promise.resolve(null);
        }
    }
    return new FindProductRepositoryStub();
}

function makeAddFavoriteProductRepository(): AddFavoriteProductRepository {
    class AddFavoriteProductRepositoryStub implements AddFavoriteProductRepository {
        async add(): Promise<void> {
            return Promise.resolve();
        }
    }
    return new AddFavoriteProductRepositoryStub();
}

function makeSut({
    findCustomerRepository = makeFindCustomerRepository(),
    findProductRepository = makeFindProductRepository(),
    addFavoriteProductRepository = makeAddFavoriteProductRepository(),
}) {
    return new AddFavoriteProductOnDb({
        findCustomerRepository,
        findProductRepository,
        addFavoriteProductRepository,
    });
}

describe('Testing AddFavoriteProductOnDb', () => {
    test('Should add favorite product with success', async () => {
        const customerID = '1';
        const productID = '1';
        const sut = makeSut({});
        const result = await sut.execute(customerID, productID);
        expect(result).toEqual(success(product));
    });

    test('Should return fail when customer does not exists', async () => {
        const customerID = '1';
        const productID = '1';
        const findCustomerRepository = makeFindCustomerRepository({ exists: false });
        const sut = makeSut({ findCustomerRepository });
        const result = await sut.execute(customerID, productID);
        expect(result).toEqual(fail(new ValidationError('Customer not found')));
    });

    test('Should return fail when product does not exists', async () => {
        const customerID = '1';
        const productID = '1';
        const findProductRepository = makeFindProductRepository({ exists: false });
        const sut = makeSut({ findProductRepository });
        const result = await sut.execute(customerID, productID);
        expect(result).toEqual(fail(new ValidationError('Product not found')));
    });

    test('Should return fail when product is already in the favorite list', async () => {
        const customerID = '1';
        const findCustomerRepository = makeFindCustomerRepository({
            exists: true,
            favoriteProducts: [product],
        });
        const sut = makeSut({ findCustomerRepository });
        const result = await sut.execute(customerID, product.id);
        expect(result).toEqual(fail(new ValidationError('The product is already in the list of favorites')));
    });
});
