import Customer from '../../../domain/customer-data';

type CreateCustomerParams = Omit<Customer, 'id'>

export default CreateCustomerParams;
