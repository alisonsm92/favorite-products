import Customer from '../../../domain/customer';
import Product from '../../../domain/product';

interface FindFavoriteProductsRepository {
    findByCustomerId(customerId: Customer['id']): Promise<Product[]|null>
}

export default FindFavoriteProductsRepository;
