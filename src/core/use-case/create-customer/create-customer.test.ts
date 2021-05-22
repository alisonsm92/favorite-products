import { ok, fail } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import ValidationError from '../errors/validation-error';
import CreateCustomerUseCase from './create-customer';

describe('Testing create customer use case', () => {
    const DEFAULT_ID = 'ID';
    const inputData = { name: 'Alison', email: 'alison@provider.com' };
    const fakeCustomer: CustomerData = { id: DEFAULT_ID, ...inputData };
    const customerRepository = {
        add: jest.fn().mockResolvedValue(fakeCustomer),
        exists: jest.fn().mockResolvedValue(false),
    };

    test('Should create a new customer with success', async () => {
        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
        const result = await createCustomerUseCase.execute(inputData);
        expect(result).toEqual(ok(fakeCustomer));
    });

    test('Should not create a user with email already exists', async () => {
        customerRepository.exists.mockResolvedValue(true);
        const error = new ValidationError('Email already exists');
        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
        const result = await createCustomerUseCase.execute(inputData);
        expect(result).toEqual(fail(error));
    });
});
