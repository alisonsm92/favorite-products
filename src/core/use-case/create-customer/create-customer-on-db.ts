import { Either, success, fail } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import CreateCustomerParams from './port/create-customer-params';
import CreateCustomerRepository from './port/create-customer-reposioty';
import ValidationError from '../error/validation-error';
import CreateCustomer from './port/create-customer';

export default class CreateCustomerOnDb implements CreateCustomer {
    private readonly createCustomerRepository: CreateCustomerRepository

    constructor(createCustomerRepository: CreateCustomerRepository) {
        this.createCustomerRepository = createCustomerRepository;
    }

    async execute(inputData: CreateCustomerParams) :Promise<Either<ValidationError, CustomerData['id']>> {
        const exists = await this.createCustomerRepository.exists(inputData.email);
        if (exists) {
            return fail(new ValidationError('Email already exists'));
        }
        const id = await this.createCustomerRepository.create(inputData);
        return success(id);
    }
}
