import CreateCustomerController from '../../../adapter/input/create-customer-controller';
import Controller from '../../../adapter/input/port/controller';
import MongoCustomerRepository from '../../../adapter/output/repository/mongodb/create-customer-repository';
import CreateCustomerOnDb from '../../../core/use-case/create-customer/create-customer-on-db';

export default function makeCreateCustomerController(): Controller {
    const mongoCustomerRepository = new MongoCustomerRepository();
    const createCustomerOnDb = new CreateCustomerOnDb(mongoCustomerRepository);
    return new CreateCustomerController({ createCustomer: createCustomerOnDb });
}
