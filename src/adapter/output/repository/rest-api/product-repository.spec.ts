import nock from 'nock';
import env from '../../../../config/environment';
import ApiProductRepository, { ResponseBody } from './product-repository';

describe('Testing ApiProductRepository', () => {
    const payload: ResponseBody = {
        price: 100.0,
        image: 'https://fake-products-api.com/images/uuid.jpg',
        brand: 'The best',
        id: '1',
        title: 'Favorite product',
    };
    const payloadWithScore: ResponseBody = {
        ...payload,
        reviewScore: 5.0,
    };

    function mockProductApi(body = payload) {
        env.productsApi.url = 'https://fake-products-api.com';
        nock(env.productsApi.url)
            .get('/api/product/1/')
            .reply(200, body);
    }

    test('Should return the product with success', async () => {
        mockProductApi();
        const sut = new ApiProductRepository();
        const id = '1';
        const result = await sut.findById(id);
        expect(result).toEqual({
            id: payload.id,
            price: payload.price,
            image: payload.image,
            title: payload.title,
        });
    });

    test('Should return the review score when response body contains it', async () => {
        mockProductApi(payloadWithScore);
        const sut = new ApiProductRepository();
        const result = await sut.findById('1');
        expect(result).toEqual({
            id: payloadWithScore.id,
            price: payloadWithScore.price,
            image: payloadWithScore.image,
            title: payloadWithScore.title,
            reviewScore: payloadWithScore.reviewScore,
        });
    });
});
