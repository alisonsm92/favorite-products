import Product from '../../../domain/product';

interface FindProductRepository {
    findById(id: Product['id']) :Promise<Product|null>
}

export default FindProductRepository;
