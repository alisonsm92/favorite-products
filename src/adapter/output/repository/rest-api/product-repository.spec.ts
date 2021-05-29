import nock from 'nock';
import env from '../../../../config/environment';
import ApiProductRepository, { ResponseBody } from './product-repository';

// eslint-disable-next-line camelcase
interface ErrorResponseBody { error_message: string, code: string }

const payload: ResponseBody = {
    price: 100.0,
    image: 'https://fake-products-api.com/images/uuid.jpg',
    brand: 'The best',
    id: '1',
    title: 'Favorite product',
};
const payloadWithScore: ResponseBody = { ...payload, reviewScore: 5.0 };
const errorResponse: ErrorResponseBody = {
    error_message: 'No page was provided',
    code: 'bad_request',
};

function mockProductApi(statusCode = 200, body: ResponseBody|ErrorResponseBody|string = payload) {
    env.productsApi.url = 'https://fake-products-api.com';
    nock(env.productsApi.url)
        .get('/api/product/1/')
        .reply(statusCode, body);
}

describe('Testing ApiProductRepository', () => {
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
        mockProductApi(200, payloadWithScore);
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

    test('Should return null when product is not found', async () => {
        mockProductApi(404, '404: Not Found');
        const sut = new ApiProductRepository();
        const result = await sut.findById('1');
        expect(result).toBeNull();
    });

    test('Should throw an error when the request to product API fails', async () => {
        mockProductApi(400, errorResponse);
        const sut = new ApiProductRepository();
        await expect(sut.findById('1')).rejects.toThrow();
    });
});
