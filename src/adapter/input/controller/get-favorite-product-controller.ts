import GetFavoriteProducts from '../../../core/use-case/get-favorite-products/port/get-favorite-products';
import GetFavoriteProductParams from '../../../core/use-case/get-favorite-products/port/get-favorite-products.params';
import { notFound, ok, serverError } from '../helper/http-helper';
import Controller from '../port/controller';
import { HttpRequest, HttpResponse } from '../port/http';
import Logger from '../port/logger';

export default class GetFavoriteProductController implements Controller {
    private readonly getFavoriteProducts: GetFavoriteProducts;

    private readonly logger: Logger;

    constructor(getFavoriteProducts: GetFavoriteProducts, logger: Logger) {
        this.getFavoriteProducts = getFavoriteProducts;
        this.logger = logger;
    }

    async handle(request: HttpRequest) :Promise<HttpResponse> {
        try {
            const { customerId } = request.params as GetFavoriteProductParams;
            const result = await this.getFavoriteProducts.execute(customerId);
            if (result.isFailure()) {
                return notFound(result.error);
            }
            return ok(result.value);
        } catch (error) {
            this.logger.error({ error }, 'Failed to get favorite products');
            return serverError();
        }
    }
}
