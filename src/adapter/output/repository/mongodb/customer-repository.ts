import { Collection, ObjectID } from 'mongodb';
import Customer from '../../../../core/domain/customer';
import CreateCustomerParams from '../../../../core/use-case/create-customer/port/create-customer-params';
import CreateCustomerRepository from '../../../../core/use-case/create-customer/port/create-customer-repository';
import DeleteCustomerRepository from '../../../../core/use-case/delete-customer/port/delete-customer-repository';
import MongoHelper from './helper/mongodb-helper';

interface CustomerRegister extends Omit<Customer, 'id'> { _id: ObjectID }

export default class MongoCustomerRepository implements CreateCustomerRepository, DeleteCustomerRepository {
    getCollection(): Collection<CustomerRegister> {
        return MongoHelper.getCollection('customers');
    }

    async create(data: CreateCustomerParams): Promise<Customer['id']> {
        const { insertedId } = await this.getCollection().insertOne({ ...data });
        return insertedId.toString();
    }

    async exists(email: Customer['email']): Promise<boolean> {
        const result = await this.getCollection().findOne({ email }, { projection: { _id: 1 } });
        return !!result;
    }

    async delete(id: Customer['id']): Promise<boolean> {
        const result = await this.getCollection().deleteOne({ _id: new ObjectID(id) });
        return !!result.deletedCount;
    }
}
