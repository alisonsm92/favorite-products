import { ObjectID } from 'mongodb';
import MongoHelper from './helper/mongodb-helper';
import env from '../../../../config/environment';
import MongoCustomerRepository from './customer-repository';
import Customer from '../../../../core/domain/customer';

describe('Mongodb User repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(env.mongodb.uri);
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
        const sut = new MongoCustomerRepository();

        return { sut, collection };
    }

    async function insertCustomer(data:Omit<Customer, 'id'>) {
        const { insertedId } = await MongoHelper.getCollection('customers').insertOne(data);
        return insertedId.toString();
    }

    describe('Create method', () => {
        test('Should persists the customer in the MongoDB', async () => {
            const { sut, collection } = makeSut();
            const data = { name: 'Alison', email: 'alison@provider.com' };

            await sut.create(data);

            const customer = await collection.findOne({ email: data.email });
            expect(customer.name).toEqual(data.name);
        });
    });

    describe('Exists method', () => {
        test('Should return false when not exists a customer register with the same email',
            async () => {
                const { sut } = makeSut();
                const email = 'alison@provider.com';
                const result = await sut.exists(email);
                expect(result).toBe(false);
            });

        test('Should return true when already exists a customer register with the same email',
            async () => {
                const { sut } = makeSut();
                const data = { name: 'Alison', email: 'alison@provider.com' };
                await sut.create(data);
                const result = await sut.exists(data.email);
                expect(result).toBe(true);
            });
    });

    describe('FindByEmail method', () => {
        test('Should return the register when there are a customer with the email provided',
            async () => {
                const data = { name: 'Alison', email: 'alison@provider.com' };
                const id = await insertCustomer({ ...data });
                const { sut } = makeSut();
                const result = await sut.findByEmail(data.email);
                expect(result).toEqual({ id, ...data });
            });

        test('Should return null when there are none customer register with the email provided',
            async () => {
                const { sut } = makeSut();
                const result = await sut.findByEmail('non-existent email');
                expect(result).toBeNull();
            });
    });

    describe('Delete method', () => {
        test('Should no exist the register on DB after delete',
            async () => {
                const { sut, collection } = makeSut();
                const data = { name: 'Alison', email: 'alison@provider.com' };
                const id = await insertCustomer(data);

                const isSuccess = await sut.delete(id);

                const register = await collection.findOne({ _id: new ObjectID(id) });
                expect(register).toBeNull();
                expect(isSuccess).toBe(true);
            });

        test('Should return false when the register is not found',
            async () => {
                const { sut } = makeSut();
                const nonExistentId = '507f191e810c19729de860ea';
                const isSuccess = await sut.delete(nonExistentId);
                expect(isSuccess).toBe(false);
            });
    });

    describe('AddFavoriteProduct method', () => {
        const product = {
            price: 100.0,
            image: 'https://fake-products-api.com/images/uuid.jpg',
            brand: 'The best',
            id: '1',
            title: 'Favorite product',
        };

        test('Should add the product to customer favorite product list', async () => {
            const { sut, collection } = makeSut();
            const data = { name: 'Alison', email: 'alison@provider.com' };
            const customerId = await insertCustomer(data);

            await sut.addFavoriteProduct(customerId, product);

            const customer: Customer = await collection.findOne({ _id: new ObjectID(customerId) });
            expect(customer.favoriteProducts).toContainEqual(product);
        });

        test('Should not duplicate product when it already in the favorite list', async () => {
            const { sut, collection } = makeSut();
            const data = { name: 'Alison', email: 'alison@provider.com', favoriteProducts: [product] };
            const customerId = await insertCustomer(data);

            await sut.addFavoriteProduct(customerId, product);

            const customer: Customer = await collection.findOne({ _id: new ObjectID(customerId) });
            expect(customer.favoriteProducts).toEqual([product]);
        });
    });
});
