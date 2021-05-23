import { success, fail } from '../../../common/either';
import CustomerData from '../../domain/customer-data';
import ValidationError from '../error/validation-error';
import CreateCustomerOnDb from './create-customer-on-db';
import CreateCustomerRepository from './port/create-customer-reposioty';

describe('Testing create customer on db use case', () => {
    const inputData = { name: 'Alison', email: 'alison@provider.com' };
    const fakeCustomer: CustomerData = { id: 'ID', ...inputData };
    const makeCustomerRepository = (opt = { exists: false }): CreateCustomerRepository => {
        class CreateCustomerRepositoryStub implements CreateCustomerRepository {
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
        const createCustomerRepository = makeCustomerRepository();
        const createCustomer = new CreateCustomerOnDb(createCustomerRepository);
        const result = await createCustomer.execute(inputData);
        expect(result).toEqual(success(fakeCustomer.id));
    });

    test('Should not create a user with email already exists', async () => {
        const error = new ValidationError('Email already exists');
        const createCustomerRepository = makeCustomerRepository({ exists: true });
        const createCustomer = new CreateCustomerOnDb(createCustomerRepository);
        const result = await createCustomer.execute(inputData);
        expect(result).toEqual(fail(error));
    });
});
