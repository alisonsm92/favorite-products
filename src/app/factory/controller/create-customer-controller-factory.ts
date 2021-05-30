import CreateCustomerController from '../../../adapter/input/controller/create-customer-controller';
import Controller from '../../../adapter/input/port/controller';
import MongoCustomerRepository from '../../../adapter/output/repository/mongodb/customer-repository';
import CreateCustomerOnDb from '../../../core/use-case/create-customer/create-customer-on-db';
import JsonSchemaValidatorWrapper from '../../validator/json-schema-validator-wrapper';

export default function makeCreateCustomerController(): Controller {
    const mongoCustomerRepository = new MongoCustomerRepository();
    const createCustomerOnDb = new CreateCustomerOnDb(mongoCustomerRepository);
    const jsonSchemaValidator = new JsonSchemaValidatorWrapper();
    return new CreateCustomerController(createCustomerOnDb, jsonSchemaValidator);
}
