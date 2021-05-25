import Customer from '../../../domain/customer';

type CreateCustomerParams = Omit<Customer, 'id'>

export default CreateCustomerParams;
