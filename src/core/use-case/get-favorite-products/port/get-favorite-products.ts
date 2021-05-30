import { Either } from '../../../../common/either';
import Customer from '../../../domain/customer';
import Product from '../../../domain/product';
import NotFoundError from '../../../error/not-found-error';

interface GetFavoriteProducts {
    execute(customerId: Customer['id']): Promise<Either<NotFoundError, Product[]>>
}

export default GetFavoriteProducts;
