import { Either } from '../../../../common/either';
import Customer from '../../../domain/customer';
import Product from '../../../domain/product';
import NotFoundError from '../../../error/not-found-error';
import ValidationError from '../../../error/validation-error';

interface AddFavoriteProduct {
    execute(customerId: Customer['id'], productId: Product['id'])
        : Promise<Either<NotFoundError|ValidationError, Product>>
}

export default AddFavoriteProduct;
