import { Collection, ObjectID } from 'mongodb';
import Customer from '../../../../core/domain/customer';
import Product from '../../../../core/domain/product';
import AddFavoriteProductRepository
    from '../../../../core/use-case/add-favorite-product/port/add-favorite-product-repository';
import FindFavoriteProductsRepository
    from '../../../../core/use-case/get-favorite-products/port/find-favorite-products-repository';
import MongoHelper from './helper/mongodb-helper';

interface CustomerRegister extends Omit<Customer, 'id'> { _id: ObjectID }

export default class MongoFavoriteProductsRepository implements
    AddFavoriteProductRepository, FindFavoriteProductsRepository {
    private getCollection(): Collection<CustomerRegister> {
        return MongoHelper.getCollection<Customer>('customers');
    }

    async add(customerId: Customer['id'], product: Product): Promise<void> {
        await this.getCollection().updateOne(
            { _id: new ObjectID(customerId) }, { $addToSet: { favoriteProducts: product } },
        );
    }

    async findByCustomerId(customerId: Customer['id']): Promise<Product[]|null> {
        const filter = { _id: new ObjectID(customerId) };
        const options = { projection: { favoriteProducts: 1 } };
        const customer = await this.getCollection().findOne(filter, options);
        if (!customer) return null;
        if (!customer.favoriteProducts) return [];
        return customer.favoriteProducts;
    }
}
