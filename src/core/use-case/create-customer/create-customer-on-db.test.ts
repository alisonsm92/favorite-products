import { success, fail } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import ValidationError from '../error/validation-error';
import { CustomerRepository } from '../port/customer-repository';
import CreateCustomerOnDb from './create-customer-on-db';

describe('Testing create customer on db use case', () => {
    const inputData = { name: 'Alison', email: 'alison@provider.com' };
    const fakeCustomer: CustomerData = { id: 'ID', ...inputData };
    const makeCustomerRepository = (opt = { exists: false }): CustomerRepository => {
        class CreateCustomerRepositoryStub implements CustomerRepository {
            async create(): Promise<CustomerData['id']> {
                return Promise.resolve(fakeCustomer.id);
            }

            async exists(): Promise<boolean> {
                return Promise.resolve(opt.exists);
            }
        }
        return new CreateCustomerRepositoryStub();
    };

    test('Should create a new customer with success', async () => {
        const customerRepository = makeCustomerRepository();
        const createCustomer = new CreateCustomerOnDb(customerRepository);
        const result = await createCustomer.execute(inputData);
        expect(result).toEqual(success(fakeCustomer.id));
    });

    test('Should not create a user with email already exists', async () => {
        const error = new ValidationError('Email already exists');
        const customerRepository = makeCustomerRepository({ exists: true });
        const createCustomer = new CreateCustomerOnDb(customerRepository);
        const result = await createCustomer.execute(inputData);
        expect(result).toEqual(fail(error));
    });
});
