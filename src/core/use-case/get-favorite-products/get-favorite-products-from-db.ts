import { Either, fail, success } from '../../../common/either';
import Customer from '../../domain/customer';
import Product from '../../domain/product';
import ValidationError from '../../error/validation-error';
import FindFavoriteProductsRepository from './port/find-favorite-products-repository';
import GetFavoriteProducts from './port/get-favorite-products';

export default class GetFavoriteProductsFromDB implements GetFavoriteProducts {
    private readonly findFavoriteProductRepository: FindFavoriteProductsRepository;

    constructor(findFavoriteProductRepository: FindFavoriteProductsRepository) {
        this.findFavoriteProductRepository = findFavoriteProductRepository;
    }

    async execute(customerId: Customer['id']): Promise<Either<ValidationError, Product[]>> {
        const favoriteProducts = await this.findFavoriteProductRepository.findByCustomerId(customerId);
        if (!favoriteProducts) {
            return fail(new ValidationError('Customer not found'));
        }
        return success(favoriteProducts);
    }
}
