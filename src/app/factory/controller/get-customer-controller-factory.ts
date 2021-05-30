import GetCustomerController from '../../../adapter/input/controller/get-customer-controller';
import Controller from '../../../adapter/input/port/controller';
import MongoCustomerRepository from '../../../adapter/output/repository/mongodb/customer-repository';
import GetCustomerFromDB from '../../../core/use-case/get-customer/get-customers-from-db';

export default function makeGetCustomerController(): Controller {
    const mongoCustomerRepository = new MongoCustomerRepository();
    const getCustomerFrom = new GetCustomerFromDB(mongoCustomerRepository);
    return new GetCustomerController(getCustomerFrom);
}
