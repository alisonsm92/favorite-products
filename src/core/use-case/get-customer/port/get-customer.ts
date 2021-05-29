import { Either } from '../../../../common/either';
import Customer from '../../../domain/customer';
import ValidationError from '../../error/validation-error';

interface GetCustomer {
    execute(id: Customer['id']): Promise<Either<ValidationError, Customer>>
}

export default GetCustomer;
