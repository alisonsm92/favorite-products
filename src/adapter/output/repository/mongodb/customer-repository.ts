import { Collection, ObjectID } from 'mongodb';
import CustomerData from '../../../../core/domain/customer-data';
import CreateCustomerParams from '../../../../core/use-case/create-customer/port/create-customer-params';
import CreateCustomerRepository from '../../../../core/use-case/create-customer/port/create-customer-reposioty';
import MongoHelper from './helper/mongodb-helper';

interface CustomerRegister extends Omit<CustomerData, 'id'> {
    _id: ObjectID
}

export default class MongoCustomerRepository implements CreateCustomerRepository {
    getCollection(): Collection<CustomerRegister> {
        return MongoHelper.getCollection('customers');
    }

    async create(data: CreateCustomerParams): Promise<CustomerData['id']> {
        const { insertedId } = await this.getCollection().insertOne(data);
        return insertedId.toString();
    }

    async exists(email: CustomerData['email']): Promise<boolean> {
        const result = await this.getCollection().findOne({ email }, { projection: { _id: 1 } });
        return !!result;
    }
}
