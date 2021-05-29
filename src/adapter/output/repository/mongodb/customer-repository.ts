import { Collection, ObjectID } from 'mongodb';
import Customer from '../../../../core/domain/customer';
import CreateCustomerParams from '../../../../core/use-case/create-customer/port/create-customer-params';
import CreateCustomerRepository from '../../../../core/use-case/create-customer/port/create-customer-repository';
import DeleteCustomerRepository from '../../../../core/use-case/delete-customer/port/delete-customer-repository';
import FindCustomerRepository from '../../../../core/use-case/port/find-customer-repository';
import MongoHelper from './helper/mongodb-helper';

interface CustomerRegister extends Omit<Customer, 'id'> { _id: ObjectID }

export default class MongoCustomerRepository implements
CreateCustomerRepository, FindCustomerRepository, DeleteCustomerRepository {
    private getCollection(): Collection<CustomerRegister> {
        return MongoHelper.getCollection<Customer>('customers');
    }

    private static map(document: CustomerRegister): Customer {
        const { _id, ...rest } = document;
        return { ...rest, id: _id.toString() };
    }

    async create(data: CreateCustomerParams): Promise<Customer['id']> {
        const { insertedId } = await this.getCollection().insertOne({ ...data });
        return insertedId.toString();
    }

    async exists(email: Customer['email']): Promise<boolean> {
        const result = await this.getCollection().findOne({ email }, { projection: { _id: 1 } });
        return !!result;
    }

    async findById(id: Customer['id']): Promise<Customer|null> {
        const result = await this.getCollection().findOne({ _id: new ObjectID(id) });
        if (!result) return result;
        return MongoCustomerRepository.map(result);
    }

    async findByEmail(email: Customer['email']): Promise<Customer|null> {
        const result = await this.getCollection().findOne({ email });
        if (!result) return result;
        return MongoCustomerRepository.map(result);
    }

    async delete(id: Customer['id']): Promise<boolean> {
        const result = await this.getCollection().deleteOne({ _id: new ObjectID(id) });
        return !!result.deletedCount;
    }
}
