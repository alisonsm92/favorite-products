import MongoHelper from './helper/mongodb-helper';
import config from '../../../../config/environment';
import MongoCustomerRepository from './create-customer-repository';

describe('Mongodb User repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(config.mongodb.uri);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const customerCollection = await MongoHelper.getCollection('customers');
        await customerCollection.deleteMany({});
    });

    test('Should persists the costumer in the MongoDB', async () => {
        const data = { name: 'Alison', email: 'alison@provider.com' };
        const mongoCustomerRepository = new MongoCustomerRepository();
        await mongoCustomerRepository.create(data);
        const customerCollection = await MongoHelper.getCollection('customers');
        const customer = await customerCollection.findOne({ email: data.email });
        expect(customer.name).toEqual(data.name);
    });
});
