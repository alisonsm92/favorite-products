import { ObjectId } from 'mongodb';
import { success, fail } from '../../../common/either';
import Customer from '../../domain/customer';
import ValidationError from '../../error/validation-error';
import FindCustomerRepository from '../common/port/find-customer-repository';
import GetCustomerFromDB from './get-customers-from-db';

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

function makeFindFavoriteProductRepository(opt = { exists: true }): FindCustomerRepository {
    class FindCustomerRepositoryStub implements FindCustomerRepository {
        async findById(): Promise<Customer|null> {
            if (!opt.exists) return Promise.resolve(null);
            return Promise.resolve(customer);
        }
    }
    return new FindCustomerRepositoryStub();
}

function makeSut(findCustomerRepository? :FindCustomerRepository) {
    if (!findCustomerRepository) {
        return new GetCustomerFromDB(makeFindFavoriteProductRepository());
    }
    return new GetCustomerFromDB(findCustomerRepository);
}

describe('Testing GetFavoriteProductsFromDB', () => {
    test('Should return the customer data', async () => {
        const sut = makeSut();
        const result = await sut.execute('customerId');
        expect(result).toEqual(success(customer));
    });

    test('Should return failure when customer not exists', async () => {
        const findFavoriteProductRepository = makeFindFavoriteProductRepository({ exists: false });
        const sut = makeSut(findFavoriteProductRepository);
        const result = await sut.execute('customerId');
        expect(result).toEqual(fail(new ValidationError('Customer not found')));
    });
});
