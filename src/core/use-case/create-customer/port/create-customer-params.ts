import CustomerData from '../../../domain/customer-data';

type CreateCustomerParams = Omit<CustomerData, 'id'>

export default CreateCustomerParams;
