import Customer from '../../../domain/customer';
import Product from '../../../domain/product';

interface AddFavoriteProductRepository {
    add(customerId: Customer['id'], productId: Product): Promise<void>
}

export default AddFavoriteProductRepository;
