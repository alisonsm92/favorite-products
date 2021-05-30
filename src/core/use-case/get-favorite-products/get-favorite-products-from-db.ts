import { Either, fail, success } from '../../../common/either';
import Customer from '../../domain/customer';
import Product from '../../domain/product';
import NotFoundError from '../../error/not-found-error';
import FindFavoriteProductsRepository from './port/find-favorite-products-repository';
import GetFavoriteProducts from './port/get-favorite-products';

export default class GetFavoriteProductsFromDB implements GetFavoriteProducts {
    private readonly findFavoriteProductRepository: FindFavoriteProductsRepository;

    constructor(findFavoriteProductRepository: FindFavoriteProductsRepository) {
        this.findFavoriteProductRepository = findFavoriteProductRepository;
    }

    async execute(customerId: Customer['id']): Promise<Either<NotFoundError, Product[]>> {
        const favoriteProducts = await this.findFavoriteProductRepository.findByCustomerId(customerId);
        if (!favoriteProducts) {
            return fail(new NotFoundError('Customer'));
        }
        return success(favoriteProducts);
    }
}
