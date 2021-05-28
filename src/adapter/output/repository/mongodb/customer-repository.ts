import { Collection, ObjectID } from 'mongodb';
import Customer from '../../../../core/domain/customer';
import Product from '../../../../core/domain/product';
import UpdateCustomerRepository from '../../../../core/use-case/add-favorite-product/port/update-customer-repository';
import CreateCustomerParams from '../../../../core/use-case/create-customer/port/create-customer-params';
import CreateCustomerRepository from '../../../../core/use-case/create-customer/port/create-customer-repository';
import DeleteCustomerRepository from '../../../../core/use-case/delete-customer/port/delete-customer-repository';
import MongoHelper from './helper/mongodb-helper';

interface CustomerRegister extends Omit<Customer, 'id'> { _id: ObjectID }

export default class MongoCustomerRepository implements
CreateCustomerRepository, DeleteCustomerRepository, UpdateCustomerRepository {
    getCollection(): Collection<CustomerRegister> {
        return MongoHelper.getCollection('customers');
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

    async findByEmail(email: Customer['email']): Promise<Customer|null> {
        const result = await this.getCollection().findOne({ email });
        if (!result) return result;
        return MongoCustomerRepository.map(result);
    }

    async delete(id: Customer['id']): Promise<boolean> {
        const result = await this.getCollection().deleteOne({ _id: new ObjectID(id) });
        return !!result.deletedCount;
    }

    async addFavoriteProduct(customerId: Customer['id'], productId: Product['id']): Promise<void> {
        await this.getCollection().updateOne(
            { _id: new ObjectID(customerId) }, { $addToSet: { favoriteProducts: productId } },
        );
    }
}
