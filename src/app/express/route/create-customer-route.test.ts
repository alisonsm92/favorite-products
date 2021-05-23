import request from 'supertest';
import MongoHelper from '../../../adapter/output/repository/mongodb/helper/mongodb-helper';
import env from '../../../config/environment';
import app from '../app';

describe('Register Routes', () => {
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

    test('Should return 200 when create a new customer', async () => {
        await request(app)
            .post('/customers')
            .send({
                name: 'Alison',
                email: 'alison@provider.com',
            })
            .expect(200);
    });
});
