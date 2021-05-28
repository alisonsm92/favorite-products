import Customer from '../../../domain/customer';
import Product from '../../../domain/product';

interface UpdateCustomerRepository {
    addFavoriteProduct(customerId: Customer['id'], productId: Product['id']): Promise<void>
}

export default UpdateCustomerRepository;