import DeleteCustomerController from '../../../adapter/input/controller/delete-customer-controller';
import Controller from '../../../adapter/input/port/controller';
import MongoCustomerRepository from '../../../adapter/output/repository/mongodb/customer-repository';
import DeleteCustomerOnDb from '../../../core/use-case/delete-customer/delete-customer-on-db';

export default function makeDeleteCustomerController(): Controller {
    const mongoCustomerRepository = new MongoCustomerRepository();
    const deleteCustomerOnDb = new DeleteCustomerOnDb({ deleteCustomerRepository: mongoCustomerRepository });
    return new DeleteCustomerController({ deleteCustomer: deleteCustomerOnDb });
}
