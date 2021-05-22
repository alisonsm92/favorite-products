import CustomerData from '../../../../core/domain/customer-data';
import { CreateCustomerParams } from '../../../../core/use-case/port/create-customer-params';
import { CustomerRepository } from '../../../../core/use-case/port/customer-repository';
import MongoHelper from './helper/mongodb-helper';

export default class MongoCustomerRepository implements CustomerRepository {
    async create(data: CreateCustomerParams): Promise<CustomerData['id']> {
        const customerCollection = await MongoHelper.getCollection('customers');
        const { insertedId } = await customerCollection.insertOne(data);

        return insertedId.str;
    }

    async exists(email: CustomerData['email']): Promise<boolean> {
        const customerCollection = MongoHelper.getCollection('customers');
        const result = await customerCollection.findOne({ email });
        return result;
    }
}
