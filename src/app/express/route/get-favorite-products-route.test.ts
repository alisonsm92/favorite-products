import request from 'supertest';
import MongoHelper from '../../../adapter/output/repository/mongodb/helper/mongodb-helper';
import env from '../../../config/environment';
import Customer from '../../../core/domain/customer';
import app from '../app';

const customerData: Omit<Customer, 'id'> = {
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

const insertCustomerRegister = async (): Promise<Customer['id']> => {
    const customerCollection = MongoHelper.getCollection('customers');
    const { insertedId } = await customerCollection.insertOne({ ...customerData });
    return insertedId.toString();
};

describe('Testing POST /customer/:customerId/favorite-product/:productId', () => {
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

    test('Should return 200 and the favorite products list successfully', async () => {
        const customerId = await insertCustomerRegister();
        await request(app)
            .get(`/customer/${customerId}/favorite-product`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual(customerData.favoriteProducts);
            });
    });
});
