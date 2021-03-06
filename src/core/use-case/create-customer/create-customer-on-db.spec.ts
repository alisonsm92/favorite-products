import { success, fail } from '../../../common/either';
import Customer from '../../domain/customer';
import ValidationError from '../../error/validation-error';
import CreateCustomerOnDb from './create-customer-on-db';
import CreateCustomerParams from './port/create-customer-params';
import CreateCustomerRepository from './port/create-customer-repository';

const inputData: CreateCustomerParams = { name: 'Alison', email: 'alison@provider.com' };
const fakeCustomer: Customer = { id: 'ID', ...inputData };

function makeCreateCustomerRepository(opt = { exists: false }): CreateCustomerRepository {
    class CreateCustomerRepositoryStub implements CreateCustomerRepository {
        async create(): Promise<Customer> {
            return Promise.resolve(fakeCustomer);
        }

        async exists(): Promise<boolean> {
            return Promise.resolve(opt.exists);
        }
    }
    return new CreateCustomerRepositoryStub();
}

function makeSut(createCustomerRepository? :CreateCustomerRepository) {
    if (!createCustomerRepository) {
        return new CreateCustomerOnDb(makeCreateCustomerRepository());
    }
    return new CreateCustomerOnDb(createCustomerRepository);
}

describe('Testing create customer on db use case', () => {
    test('Should create a new customer with success', async () => {
        const sut = makeSut();
        const result = await sut.execute(inputData);
        expect(result).toEqual(success(fakeCustomer));
    });

    test('Should not create a user with email already exists', async () => {
        const error = new ValidationError('Email already exists');
        const createCustomerRepository = makeCreateCustomerRepository({ exists: true });
        const sut = makeSut(createCustomerRepository);
        const result = await sut.execute(inputData);
        expect(result).toEqual(fail(error));
    });
});
