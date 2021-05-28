import axios from 'axios';
import env from '../../../../config/environment';
import Product from '../../../../core/domain/product';
import FindProductRepository from '../../../../core/use-case/add-favorite-product/port/find-product-repository';

export interface ResponseBody extends Product { brand: string }

export default class ApiProductRepository implements FindProductRepository {
    async findById(id: Product['id']): Promise<Product> {
        const httpClient = axios.create({
            baseURL: env.productsApi.url,
            timeout: env.axios.timeout,
        });
        const { data } = await httpClient.get(`/api/product/${id}/`);
        return ApiProductRepository.formatPayload(data);
    }

    private static formatPayload({
        id, title, price, image, reviewScore,
    }: ResponseBody): Product {
        const product :Product = {
            id,
            title,
            price,
            image,
        };
        if (reviewScore) product.reviewScore = reviewScore;
        return product;
    }
}
