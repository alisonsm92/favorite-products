import CustomerData from '../../../domain/customer-data';
import CreateCustomerParams from './create-customer-params';

interface CreateCustomerRepository {
  create (data: CreateCustomerParams): Promise<CustomerData['id']>
  exists (email: CustomerData['email']): Promise<boolean>
}

export default CreateCustomerRepository;
