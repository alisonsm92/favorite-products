import request from 'supertest';
import nock from 'nock';
import env from '../../../config/environment';
import app from '../app';
import { ResponseBody } from '../../../adapter/output/repository/rest-api/product-repository';
import MongoHelper from '../../../adapter/output/repository/mongodb/helper/mongodb-helper';
import Customer from '../../../core/domain/customer';

const productId = '1';
const responseBody: ResponseBody = {
    price: 100.0,
    image: 'https://fake-products-api.com/images/uuid.jpg',
    brand: 'The best',
    id: productId,
    title: 'Favorite product',
    reviewScore: 5.0,
};

function mockProductApi(id: string) {
    env.productsApi.url = 'https://fake-products-api.com';
    nock(env.productsApi.url)
        .get(`/api/product/${id}/`)
        .reply(200, responseBody);
}

async function insertCustomerRegister(): Promise<Customer['id']> {
    const customerData = { name: 'Alison', email: 'alison@provider.com' };
    const customerCollection = MongoHelper.getCollection('customers');
    const { insertedId } = await customerCollection.insertOne({ ...customerData });
    return insertedId.toString();
}

describe('Testing POST /customer/:customerId/favorite-product/:productId', () => {
    beforeAll(async () => {
        mockProductApi(productId);
        await MongoHelper.initialize(env.mongodb.uri);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const customerCollection = MongoHelper.getCollection('customers');
        await customerCollection.deleteMany({});
    });

    test('Should return 200 when add the product in the favorite list successfully', async () => {
        const customerId = await insertCustomerRegister();
        await request(app)
            .post(`/customer/${customerId}/favorite-product/${productId}`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({
                    id: responseBody.id,
                    price: responseBody.price,
                    image: responseBody.image,
                    title: responseBody.title,
                    reviewScore: responseBody.reviewScore,
                });
            });
    });
});
