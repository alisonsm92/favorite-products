import { fail, success } from '../../../common/either';
import Product from '../../domain/product';
import ValidationError from '../error/validation-error';
import AddFavoriteProductOnDb from './add-favorite-product_on-db';
import FindProductRepository from './port/find-product-repository';
import UpdateCustomerRepository from './port/update-customer-repository';

describe('Testing AddFavoriteProductOnDb', () => {
    const fakeProduct = {
        price: 100.0,
        image: 'https://fake-products-api.com/images/uuid.jpg',
        brand: 'The best',
        id: '1',
        title: 'Favorite product',
    };
    const makeFindProductRepository = (opt = { exists: true }): FindProductRepository => {
        class FindProductRepositoryStub implements FindProductRepository {
            async findById(): Promise<Product|null> {
                if (opt.exists) return Promise.resolve(fakeProduct);
                return Promise.resolve(null);
            }
        }
        return new FindProductRepositoryStub();
    };
    const makeUpdateCustomerRepository = (opt = { exists: false }): UpdateCustomerRepository => {
        class UpdateCustomerRepositoryStub implements UpdateCustomerRepository {
            async addFavoriteProduct(): Promise<Product|null> {
                if (opt.exists) return Promise.resolve(null);
                return Promise.resolve(fakeProduct);
            }
        }
        return new UpdateCustomerRepositoryStub();
    };
    const makeSut = ({ findProductRepository, updateCustomerRepository }
        :{ findProductRepository? :FindProductRepository,
            updateCustomerRepository?: UpdateCustomerRepository }) => (
        new AddFavoriteProductOnDb(
            findProductRepository || makeFindProductRepository(),
            updateCustomerRepository || makeUpdateCustomerRepository(),
        ));

    test('Should add favorite product with success', async () => {
        const customerID = 'uuid';
        const productID = 'uuid';
        const sut = makeSut({});
        const result = await sut.execute(customerID, productID);
        expect(result).toEqual(success(fakeProduct));
    });

    test('Should return fail when product does not exists', async () => {
        const customerID = 'uuid';
        const productID = 'uuid';
        const findProductRepository = makeFindProductRepository({ exists: false });
        const sut = makeSut({ findProductRepository });
        const result = await sut.execute(customerID, productID);
        expect(result).toEqual(fail(new ValidationError('Product does not exists')));
    });

    test('Should return fail when product is already in the favorite list', async () => {
        const customerID = 'uuid';
        const productID = 'uuid';
        const updateCustomerRepository = makeUpdateCustomerRepository({ exists: true });
        const sut = makeSut({ updateCustomerRepository });
        const result = await sut.execute(customerID, productID);
        expect(result).toEqual(fail(new ValidationError('Product already is in the favorite list')));
    });
});
