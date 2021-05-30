import request from 'supertest';
import MongoHelper from '../../../adapter/output/repository/mongodb/helper/mongodb-helper';
import env from '../../../config/environment';
import Customer from '../../../core/domain/customer';
import app from '../app';

const customer: Omit<Customer, 'id'> = {
    name: 'Alison',
    email: 'alison@provider.com',
    favoriteProducts: [{
        price: 100.0,
        image: 'https://fake-products-api.com/images/uuid.jpg',
        id: '1',
        title: 'Favorite product',
        reviewScore: 5.0,
    }],
};

async function insertCustomerRegister(): Promise<Customer['id']> {
    const customerCollection = MongoHelper.getCollection<Customer>('customers');
    const { insertedId } = await customerCollection.insertOne({ ...customer });
    return insertedId.toHexString();
}

describe('Testing GET /customer/:customerId', () => {
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

    test('Should return 200 and the customer data successfully', async () => {
        const id = await insertCustomerRegister();
        await request(app)
            .get(`/customer/${id}`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    id,
                    name: customer.name,
                    email: customer.email,
                });
            });
    });
});
