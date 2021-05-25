import axios from 'axios';
import env from '../../../../config/environment';
import Product from '../../../../core/domain/product';
import FindProductRepository from '../../../../core/use-case/add-favorite-product/port/find-product-repository';

export default class ApiProductRepository implements FindProductRepository {
    async findById(id: Product['id']): Promise<Product> {
        const httpClient = axios.create({ baseURL: env.productsApi.url });
        const { data } = await httpClient.get(`/api/product/${id}/`);
        return data;
    }
}
