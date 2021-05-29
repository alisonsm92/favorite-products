import { fail, success } from '../../../common/either';
import NotFoundError from '../error/not-found-error';
import DeleteCustomerOnDb from './delete-customer-on-db';
import DeleteCustomerRepository from './port/delete-customer-repository';

describe('Testing delete customer on db use case', () => {
    const makeDeleteCustomerRepository = (opt = { exists: false }): DeleteCustomerRepository => {
        class DeleteCustomerRepositoryStub implements DeleteCustomerRepository {
            async delete(): Promise<boolean> {
                return Promise.resolve(!opt.exists);
            }
        }
        return new DeleteCustomerRepositoryStub();
    };
    const makeSut = (deleteCustomerRepository: DeleteCustomerRepository): DeleteCustomerOnDb => (
        new DeleteCustomerOnDb({ deleteCustomerRepository })
    );

    test('Should return success when the id provided exists', async () => {
        const nonExistentID = 'nonExistentID';
        const deleteCustomerRepository = makeDeleteCustomerRepository({ exists: false });
        const sut = makeSut(deleteCustomerRepository);
        const result = await sut.execute(nonExistentID);
        expect(result).toEqual(success());
    });

    test('Should return fail when the id provided not exists on the database', async () => {
        const existentID = 'existentID';
        const deleteCustomerRepository = makeDeleteCustomerRepository({ exists: true });
        const sut = makeSut(deleteCustomerRepository);
        const result = await sut.execute(existentID);
        expect(result).toEqual(fail(new NotFoundError('customer')));
    });
});
