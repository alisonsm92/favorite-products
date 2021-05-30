import { Either } from '../../../../common/either';
import Customer from '../../../domain/customer';
import Product from '../../../domain/product';
import ValidationError from '../../../error/validation-error';

interface AddFavoriteProduct {
    execute(customerId: Customer['id'], productId: Product['id']): Promise<Either<ValidationError, Product>>
}

export default AddFavoriteProduct;
