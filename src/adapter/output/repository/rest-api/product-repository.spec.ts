import nock from 'nock';
import env from '../../../../config/environment';
import ApiProductRepository from './product-repository';

describe('Testing ApiProductRepository', () => {
    const fakeProduct = {
        price: 100.0,
        image: 'https://fake-products-api.com/images/uuid.jpg',
        brand: 'The best',
        id: '1',
        title: 'Favorite product',
    };

    beforeAll(() => {
        env.productsApi.url = 'https://fake-products-api.com';
        nock(env.productsApi.url)
            .get('/api/product/1/')
            .reply(200, fakeProduct);
    });

    test('Should return the product with success', async () => {
        const sut = new ApiProductRepository();
        const id = '1';
        const result = await sut.findById(id);
        expect(result).toEqual(fakeProduct);
    });
});
