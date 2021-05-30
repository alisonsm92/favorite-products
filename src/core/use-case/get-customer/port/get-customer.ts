import { Either } from '../../../../common/either';
import Customer from '../../../domain/customer';
import NotFoundError from '../../../error/not-found-error';

interface GetCustomer {
    execute(id: Customer['id']): Promise<Either<NotFoundError, Customer>>
}

export default GetCustomer;
