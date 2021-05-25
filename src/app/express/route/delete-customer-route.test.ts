import request from 'supertest';
import MongoHelper from '../../../adapter/output/repository/mongodb/helper/mongodb-helper';
import env from '../../../config/environment';
import Customer from '../../../core/domain/customer';
import app from '../app';

describe('Testing DELETE /customers', () => {
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

    const mockCustomerRegister = async (): Promise<Customer> => {
        const customerData = { name: 'Alison', email: 'alison@provider.com' };
        const customerCollection = MongoHelper.getCollection('customers');
        const { insertedId } = await customerCollection.insertOne({ ...customerData });
        return { id: insertedId.toString(), ...customerData };
    };

    test('Should return 204 when delete the customer with the id provided', async () => {
        const { id } = await mockCustomerRegister();
        await request(app)
            .delete(`/customers/${id}`)
            .expect(204);
    });
});
