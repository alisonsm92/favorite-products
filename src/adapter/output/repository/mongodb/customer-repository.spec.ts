import MongoHelper from './helper/mongodb-helper';
import env from '../../../../config/environment';
import MongoCustomerRepository from './customer-repository';

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

    describe('Delete method', () => {
        test('Should no exist the register on DB after delete',
            async () => {
                const { sut, collection } = makeSut();
                const data = { name: 'Alison', email: 'alison@provider.com' };
                const { insertedId } = await collection.insertOne(data);
                const id = insertedId.toString();

                const isSuccess = await sut.delete(id);

                const register = await collection.findOne({ _id: insertedId });
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
});
