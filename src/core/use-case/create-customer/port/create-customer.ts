import { Either } from '../../../../common/either';
import Customer from '../../../domain/customer';
import ValidationError from '../../error/validation-error';
import CreateCustomerParams from './create-customer-params';

interface CreateCustomer {
    execute(inputData: CreateCustomerParams) :Promise<Either<ValidationError, Customer['id']>>
}

export default CreateCustomer;
