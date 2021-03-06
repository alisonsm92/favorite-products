import { ObjectId } from 'mongodb';
import MongoHelper from './helper/mongodb-helper';
import env from '../../../../config/environment';
import MongoCustomerRepository from './customer-repository';
import Customer from '../../../../core/domain/customer';

function makeObjectIdString() {
    const objectId = new ObjectId();
    return objectId.toHexString();
}

async function insertCustomer(data:Omit<Customer, 'id'>) {
    const { insertedId } = await MongoHelper.getCollection<Customer>('customers').insertOne(data);
    return insertedId.toString();
}

function makeSut() {
    const collection = MongoHelper.getCollection<Customer>('customers');
    const sut = new MongoCustomerRepository();
    return { sut, collection };
}

describe('Mongodb User repository', () => {
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

    describe('Create method', () => {
        test('Should persists the customer in the MongoDB', async () => {
            const { sut, collection } = makeSut();
            const data = { name: 'Alison', email: 'alison@provider.com' };

            await sut.create(data);

            const customer = await collection.findOne({ email: data.email });
            expect(customer?.name).toEqual(data.name);
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

    describe('FindById method', () => {
        test('Should return the register when there are a customer with the id provided',
            async () => {
                const data = { name: 'Alison', email: 'alison@provider.com' };
                const id = await insertCustomer({ ...data });
                const { sut } = makeSut();
                const result = await sut.findById(id);
                expect(result).toEqual({ id, ...data });
            });

        test('Should return null when there are none customer register with the id provided',
            async () => {
                const nonExistentId = makeObjectIdString();
                const { sut } = makeSut();
                const result = await sut.findById(nonExistentId);
                expect(result).toBeNull();
            });

        test('Should return null when the id provided is not valid',
            async () => {
                const invalidId = 'invalid';
                const { sut } = makeSut();
                const result = await sut.findById(invalidId);
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

                const register = await collection.findOne({ _id: new ObjectId(id) });
                expect(register).toBeNull();
                expect(isSuccess).toBe(true);
            });

        test('Should return false when the register is not found',
            async () => {
                const { sut } = makeSut();
                const nonExistentId = makeObjectIdString();
                const isSuccess = await sut.delete(nonExistentId);
                expect(isSuccess).toBe(false);
            });

        test('Should return null when the id provided is not valid',
            async () => {
                const invalidId = 'invalid';
                const { sut } = makeSut();
                const result = await sut.delete(invalidId);
                expect(result).toBeFalsy();
            });
    });
});
