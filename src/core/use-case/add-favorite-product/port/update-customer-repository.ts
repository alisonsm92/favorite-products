import Customer from '../../../domain/customer';
import Product from '../../../domain/product';

interface UpdateCustomerRepository {
    addFavoriteProduct(customerID: Customer['id'], product: Product): Promise<Product|null>
}

export default UpdateCustomerRepository;
