import { ObjectID } from 'mongodb';
import env from '../../../../config/environment';
import Customer from '../../../../core/domain/customer';
import MongoFavoriteProductsRepository from './favorite-products-repository';
import MongoHelper from './helper/mongodb-helper';

beforeAll(async () => {
    await MongoHelper.initialize(env.mongodb.uri);
});

afterAll(async () => {
    await MongoHelper.disconnect();
});

beforeEach(async () => {
    const customerCollection = MongoHelper.getCollection('customers');
    await customerCollection.deleteMany({});
});

function makeSut() {
    const collection = MongoHelper.getCollection('customers');
    const sut = new MongoFavoriteProductsRepository();

    return { sut, collection };
}

async function insertCustomer(data:Omit<Customer, 'id'>) {
    const { insertedId } = await MongoHelper.getCollection('customers').insertOne(data);
    return insertedId.toString();
}

describe('AddFavoriteProduct method', () => {
    const product = {
        price: 100.0,
        image: 'https://fake-products-api.com/images/uuid.jpg',
        id: '1',
        title: 'Favorite product',
    };

    test('Should add the product to customer favorite product list', async () => {
        const { sut, collection } = makeSut();
        const data = { name: 'Alison', email: 'alison@provider.com' };
        const customerId = await insertCustomer(data);

        await sut.add(customerId, product);

        const customer: Customer = await collection.findOne({ _id: new ObjectID(customerId) });
        expect(customer.favoriteProducts).toContainEqual(product);
    });

    test('Should not duplicate product when it already in the favorite list', async () => {
        const { sut, collection } = makeSut();
        const data = { name: 'Alison', email: 'alison@provider.com', favoriteProducts: [product] };
        const customerId = await insertCustomer(data);

        await sut.add(customerId, product);

        const customer: Customer = await collection.findOne({ _id: new ObjectID(customerId) });
        expect(customer.favoriteProducts).toEqual([product]);
    });
});

describe('FindFavoriteProduct method', () => {
    const product = {
        price: 100.0,
        image: 'https://fake-products-api.com/images/uuid.jpg',
        id: '1',
        title: 'Favorite product',
    };

    test('Should return the customer favorite product list', async () => {
        const { sut } = makeSut();
        const data = { name: 'Alison', email: 'alison@provider.com', favoriteProducts: [product] };
        const customerId = await insertCustomer(data);
        const favoriteProducts = await sut.findByCustomerId(customerId);
        expect(favoriteProducts).toEqual([product]);
    });

    test('Should return null when the customer not exists', async () => {
        const { sut } = makeSut();
        const nonExistentId = (new ObjectID()).toHexString();
        const favoriteProducts = await sut.findByCustomerId(nonExistentId);
        expect(favoriteProducts).toBeNull();
    });

    test('Should return an empty array when the customer do not have a favorite product list',
        async () => {
            const { sut } = makeSut();
            const customer = { name: 'Alison', email: 'alison@provider.com' };
            const customerId = await insertCustomer(customer);

            const favoriteProducts = await sut.findByCustomerId(customerId);

            expect(favoriteProducts).toEqual([]);
        });
});
