import Customer from '../../../domain/customer-data';
import CreateCustomerParams from './create-customer-params';

interface CreateCustomerRepository {
  create (data: CreateCustomerParams): Promise<Customer['id']>
  exists (email: Customer['email']): Promise<boolean>
}

export default CreateCustomerRepository;
