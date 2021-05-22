import { Either, ok, fail } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import { CreateCustomerParams } from '../protocols/create-customer-params';
import { CustomerRepository } from '../protocols/customer-repository';
import ValidationError from '../errors/validation-error';
import { CreateCustomer } from './create-customer';

export default class CreateCustomerOnDB implements CreateCustomer {
    private readonly customerRepository: CustomerRepository

    constructor(customerRepository: CustomerRepository) {
        this.customerRepository = customerRepository;
    }

    async execute(inputData: CreateCustomerParams) :Promise<Either<ValidationError, CustomerData>> {
        const exists = await this.customerRepository.exists(inputData.email);
        if (exists) {
            return fail(new ValidationError('Email already exists'));
        }
        const customerData = await this.customerRepository.add(inputData);
        return ok(customerData);
    }
}
