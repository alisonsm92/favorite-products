import { Either } from '../../../../common/either';
import NotFoundError from '../../error/not-found-error';
import DeleteCustomerParams from './delete-customer-params';

interface DeleteCustomer {
    execute(id: DeleteCustomerParams['id']) :Promise<Either<NotFoundError, void>>
}

export default DeleteCustomer;
