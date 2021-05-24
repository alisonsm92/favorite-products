import DeleteCustomerParams from './delete-customer-params';

interface DeleteCustomerRepository {
  delete (id: DeleteCustomerParams['id']): Promise<boolean>
}

export default DeleteCustomerRepository;
