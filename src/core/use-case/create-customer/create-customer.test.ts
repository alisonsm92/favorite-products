import ValidationError from '../errors/validation-error';
import CreateCustomerUseCase from './create-customer';

describe('Testing create customer use case', () => {
    test('Should create a new customer with success', async () => {
        const id = 'uuid';
        const customerRepository = { add: async () => id };
        const inputData = { name: 'Alison', email: 'alison@provider.com' };
        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

        const result = await createCustomerUseCase.execute(inputData);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(id);
    });
});
