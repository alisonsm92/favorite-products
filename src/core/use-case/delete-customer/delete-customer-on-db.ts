import { Either, success, fail } from '../../../common/either';
import NotFoundError from '../error/not-found-error';
import DeleteCustomer from './port/delete-customer';
import DeleteCustomerParams from './port/delete-customer-params';
import DeleteCustomerRepository from './port/delete-customer-repository';

export default class DeleteCustomerOnDb implements DeleteCustomer {
    private readonly deleteCustomerRepository: DeleteCustomerRepository

    constructor({ deleteCustomerRepository }: { deleteCustomerRepository: DeleteCustomerRepository }) {
        this.deleteCustomerRepository = deleteCustomerRepository;
    }

    async execute(id: DeleteCustomerParams['id']): Promise<Either<NotFoundError, void>> {
        const isSuccess = await this.deleteCustomerRepository.delete(id);
        if (!isSuccess) {
            return fail(new NotFoundError('customer'));
        }
        return success();
    }
}
