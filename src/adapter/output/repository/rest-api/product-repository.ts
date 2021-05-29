import env from '../../../../config/environment';
import Product from '../../../../core/domain/product';
import FindProductRepository from '../../../../core/use-case/add-favorite-product/port/find-product-repository';
import AxiosHelper from './helper/axios-helper';

export interface ResponseBody extends Product { brand: string }

export default class ApiProductRepository implements FindProductRepository {
    async findById(id: Product['id']): Promise<Product|null> {
        const httpClient = AxiosHelper.create({ baseURL: env.productsApi.url });
        const { data, status } = await httpClient.get<ResponseBody>(`/api/product/${id}/`);
        if (!data || status === 404) return null;
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
