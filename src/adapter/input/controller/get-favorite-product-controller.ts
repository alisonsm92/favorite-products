import GetFavoriteProducts from '../../../core/use-case/get-favorite-products/port/get-favorite-products';
import GetFavoriteProductParams from '../../../core/use-case/get-favorite-products/port/get-favorite-products.params';
import { badRequest, ok, serverError } from '../helper/http-helper';
import Controller from '../port/controller';
import { HttpRequest, HttpResponse } from '../port/http';

export default class GetFavoriteProductController implements Controller {
    private readonly getFavoriteProducts: GetFavoriteProducts;

    constructor(getFavoriteProducts: GetFavoriteProducts) {
        this.getFavoriteProducts = getFavoriteProducts;
    }

    async handle(request: HttpRequest) :Promise<HttpResponse> {
        try {
            const { customerId } = request.params as GetFavoriteProductParams;
            const result = await this.getFavoriteProducts.execute(customerId);
            if (result.isFailure()) {
                return badRequest(result.error);
            }
            return ok(result.value);
        } catch (error) {
            return serverError();
        }
    }
}
