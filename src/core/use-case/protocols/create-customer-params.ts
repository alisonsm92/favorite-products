import CustomerData from '../../domain/customer-data';

export type CreateCustomerParams = Omit<CustomerData, 'id'>;
