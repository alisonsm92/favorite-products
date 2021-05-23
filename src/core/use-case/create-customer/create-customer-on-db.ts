import { Either, success, fail } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import CreateCustomerParams from './port/create-customer-params';
import CustomerRepository from '../port/customer-repository';
import ValidationError from '../error/validation-error';
import CreateCustomer from './create-customer';

export default class CreateCustomerOnDb implements CreateCustomer {
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository;
    }

    async execute(inputData: CreateCustomerParams) :Promise<Either<ValidationError, CustomerData['id']>> {
        const exists = await this.customerRepository.exists(inputData.email);
        if (exists) {
            return fail(new ValidationError('Email already exists'));
        }
        const id = await this.customerRepository.create(inputData);
        return success(id);
    }
}
