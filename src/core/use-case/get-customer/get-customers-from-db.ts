import { Either, fail, success } from '../../../common/either';
import Customer from '../../domain/customer';
import ValidationError from '../../error/validation-error';
import FindCustomerRepository from '../common/port/find-customer-repository';
import GetCustomer from './port/get-customer';

export default class GetCustomerFromDB implements GetCustomer {
    private readonly findCustomerRepository: FindCustomerRepository;

    constructor(findCustomerRepository: FindCustomerRepository) {
        this.findCustomerRepository = findCustomerRepository;
    }

    async execute(id: Customer['id']): Promise<Either<ValidationError, Customer>> {
        const customer = await this.findCustomerRepository.findById(id);
        if (!customer) {
            return fail(new ValidationError('Customer not found'));
        }
        return success(customer);
    }
}
