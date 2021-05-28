import AddFavoriteProduct from '../../../core/use-case/add-favorite-product/port/add-favorite-product';
import AddFavoriteProductParams from '../../../core/use-case/add-favorite-product/port/add-favorite-product-params';
import { badRequest, ok, serverError } from '../helper/http-helper';
import { HttpRequest, HttpResponse } from '../port/http';

type Dependencies = { addFavoriteProduct: AddFavoriteProduct }

export default class AddFavoriteProductController {
    private readonly addFavoriteProduct: AddFavoriteProduct;

    constructor({ addFavoriteProduct }: Dependencies) {
        this.addFavoriteProduct = addFavoriteProduct;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { customerId, productId } = request.params as AddFavoriteProductParams;
            const result = await this.addFavoriteProduct.execute(customerId, productId);
            if (result.isFailure()) {
                return badRequest(result.error);
            }
            return ok(result.value);
        } catch (error) {
            return serverError();
        }
    }
}
