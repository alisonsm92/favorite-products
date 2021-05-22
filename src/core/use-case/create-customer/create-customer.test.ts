import ValidationError from '../errors/validation-error';
import CreateCustomerUseCase from './create-customer';

describe('Testing create customer use case', () => {
    const DEFAULT_ID = 'ID';
    const inputData = { name: 'Alison', email: 'alison@provider.com' };
    const customerRepository = {
        add: jest.fn().mockResolvedValue(DEFAULT_ID),
        exists: jest.fn().mockResolvedValue(false),
    };

    test('Should create a new customer with success', async () => {
        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
        const result = await createCustomerUseCase.execute(inputData);
        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(DEFAULT_ID);
    });

    test('Should return a validation error when the customer email already exists', async () => {
        customerRepository.exists.mockResolvedValue(true);
        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
        const result = await createCustomerUseCase.execute(inputData);
        expect(result.isSuccess).toBe(false);
        expect(result.error).toBeInstanceOf(ValidationError);
    });
});
