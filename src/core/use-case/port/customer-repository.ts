import CustomerData from '../../domain/customer-data';
import CreateCustomerParams from '../create-customer/port/create-customer-params';

interface CustomerRepository {
  create (data: CreateCustomerParams): Promise<CustomerData['id']>
  exists (email: CustomerData['email']): Promise<boolean>
}

export default CustomerRepository;
