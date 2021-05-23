import MongoHelper from './helper/mongodb-helper';
import env from '../../../../config/environment';
import MongoCustomerRepository from './create-customer-repository';

describe('Mongodb User repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(env.mongodb.uri);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const customerCollection = await MongoHelper.getCollection('customers');
        await customerCollection.deleteMany({});
    });

    test('Should persists the costumer in the MongoDB', async () => {
        const sut = new MongoCustomerRepository();
        const data = { name: 'Alison', email: 'alison@provider.com' };

        await sut.create(data);

        const customerCollection = await MongoHelper.getCollection('customers');
        const customer = await customerCollection.findOne({ email: data.email });
        expect(customer.name).toEqual(data.name);
    });

    test('Should return false when not exists a customer register with the same email',
        async () => {
            const sut = new MongoCustomerRepository();
            const email = 'alison@provider.com';
            const result = await sut.exists(email);
            expect(result).toBe(false);
        });

    test('Should return true when already exists a customer register with the same email',
        async () => {
            const sut = new MongoCustomerRepository();
            const data = { name: 'Alison', email: 'alison@provider.com' };
            await sut.create(data);

            const result = await sut.exists(data.email);
            expect(result).toBe(true);
        });
});
