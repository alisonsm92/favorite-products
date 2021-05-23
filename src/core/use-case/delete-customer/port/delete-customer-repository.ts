import DeleteCustomerParams from './delete-customer-params';

interface DeleteCustomerRepository {
  delete (id: DeleteCustomerParams): Promise<boolean>
}

export default DeleteCustomerRepository;
