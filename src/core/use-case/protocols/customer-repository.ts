import CustomerData from '../../domain/customer-data';
import { CreateCustomerParams } from './create-customer-params';

export interface CustomerRepository {
  add (customer: CreateCustomerParams): Promise<CustomerData['id']>
  exists: (email: CustomerData['email']) => Promise<boolean>
}
