import { Either } from '../../../../common/either';
import Customer from '../../../domain/customer';
import Product from '../../../domain/product';
import ValidationError from '../../../error/validation-error';

interface GetFavoriteProducts {
    execute(customerId: Customer['id']): Promise<Either<ValidationError, Product[]>>
}

export default GetFavoriteProducts;
