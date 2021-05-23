import { Either } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import ValidationError from '../error/validation-error';
import CreateCustomerParams from './port/create-customer-params';

export interface CreateCustomer {
    execute(inputData: CreateCustomerParams) :Promise<Either<ValidationError, CustomerData['id']>>
}
