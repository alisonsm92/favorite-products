import { success, fail } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import ValidationError from '../error/validation-error';
import CreateCustomerOnDB from './create-customer-on-db';

describe('Testing create customer on db use case', () => {
    const inputData = { name: 'Alison', email: 'alison@provider.com' };
    const fakeCustomer: CustomerData = { id: 'ID', ...inputData };
    const customerRepository = {
        create: jest.fn().mockResolvedValue(fakeCustomer),
        exists: jest.fn().mockResolvedValue(false),
    };

    test('Should create a new customer with success', async () => {
        const createCustomerUseCase = new CreateCustomerOnDB(customerRepository);
        const result = await createCustomerUseCase.execute(inputData);
        expect(result).toEqual(success(fakeCustomer));
    });

    test('Should not create a user with email already exists', async () => {
        customerRepository.exists.mockResolvedValue(true);
        const error = new ValidationError('Email already exists');
        const createCustomerUseCase = new CreateCustomerOnDB(customerRepository);
        const result = await createCustomerUseCase.execute(inputData);
        expect(result).toEqual(fail(error));
    });
});
