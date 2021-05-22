import { Either } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import ValidationError from '../errors/validation-error';
import { CreateCustomerParams } from '../protocols/create-customer-params';

export interface CreateCustomer {
    execute(inputData: CreateCustomerParams) :Promise<Either<ValidationError, CustomerData>>
}
