import request from 'supertest';
import { Schema, Validator } from 'jsonschema';
import MongoHelper from '../../../adapter/output/repository/mongodb/helper/mongodb-helper';
import env from '../../../config/environment';
import app from '../app';

describe('Testing POST /customers', () => {
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

    test('Should return 200 when create a new customer', async () => {
        await request(app)
            .post('/customers')
            .send({
                name: 'Alison',
                email: 'alison@provider.com',
            })
            .expect((res) => {
                const jsonValidator = new Validator();
                const schema: Schema = {
                    type: 'object',
                    properties: {
                        id: { type: 'string', required: true },
                        name: { type: 'string', required: true },
                        email: { type: 'string', required: true },
                    },
                    additionalProperties: false,
                };
                expect(res.status).toBe(200);
                expect(jsonValidator.validate(res.body, schema).valid).toBeTruthy();
            });
    });
});
