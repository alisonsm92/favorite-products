import { Either, fail, success } from '../../../common/either';
import Customer from '../../domain/customer';
import NotFoundError from '../../error/not-found-error';
import FindCustomerRepository from '../common/port/find-customer-repository';
import GetCustomer from './port/get-customer';

export default class GetCustomerFromDB implements GetCustomer {
    private readonly findCustomerRepository: FindCustomerRepository;

    constructor(findCustomerRepository: FindCustomerRepository) {
        this.findCustomerRepository = findCustomerRepository;
    }

    async execute(id: Customer['id']): Promise<Either<NotFoundError, Customer>> {
        const customer = await this.findCustomerRepository.findById(id);
        if (!customer) {
            return fail(new NotFoundError('Customer'));
        }
        return success(customer);
    }
}
