import NotFoundError from '../../../core/error/not-found-error';
import AddFavoriteProduct from '../../../core/use-case/add-favorite-product/port/add-favorite-product';
import AddFavoriteProductParams from '../../../core/use-case/add-favorite-product/port/add-favorite-product-params';
import {
    badRequest, notFound, ok, serverError,
} from '../helper/http-helper';
import Controller from '../port/controller';
import { HttpRequest, HttpResponse } from '../port/http';
import Logger from '../port/logger';

export default class AddFavoriteProductController implements Controller {
    private readonly addFavoriteProduct: AddFavoriteProduct;

    private readonly logger: Logger;

    constructor(addFavoriteProduct: AddFavoriteProduct, logger: Logger) {
        this.addFavoriteProduct = addFavoriteProduct;
        this.logger = logger;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { customerId, productId } = request.params as AddFavoriteProductParams;
            const result = await this.addFavoriteProduct.execute(customerId, productId);
            if (result.isFailure()) {
                return result.error instanceof NotFoundError
                    ? notFound(result.error)
                    : badRequest(result.error);
            }
            return ok(result.value);
        } catch (error) {
            this.logger.error({ error }, 'Failed to add favorite product');
            return serverError();
        }
    }
}
