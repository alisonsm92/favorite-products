import { Either, fail, success } from '../../../common/either';
import Customer from '../../domain/customer';
import Product from '../../domain/product';
import ValidationError from '../../error/validation-error';
import FindCustomerRepository from '../common/port/find-customer-repository';
import isSameId from './helper/add-favorite-product-helper';
import AddFavoriteProduct from './port/add-favorite-product';
import FindProductRepository from './port/find-product-repository';
import AddFavoriteProductRepository from './port/add-favorite-product-repository';

type Dependencies = {
    findProductRepository: FindProductRepository,
    findCustomerRepository: FindCustomerRepository,
    addFavoriteProductRepository: AddFavoriteProductRepository
}
type Result = Promise<Either<ValidationError, Product>>

export default class AddFavoriteProductOnDb implements AddFavoriteProduct {
    private readonly findCustomerRepository: FindCustomerRepository;

    private readonly findProductRepository: FindProductRepository;

    private readonly addFavoriteProductRepository: AddFavoriteProductRepository;

    constructor({ findCustomerRepository, findProductRepository, addFavoriteProductRepository }: Dependencies) {
        this.findCustomerRepository = findCustomerRepository;
        this.findProductRepository = findProductRepository;
        this.addFavoriteProductRepository = addFavoriteProductRepository;
    }

    async execute(customerId: Customer['id'], productId: Product['id']): Result {
        const customer = await this.findCustomerRepository.findById(customerId);
        if (!customer) {
            return fail(new ValidationError('Customer not found'));
        }
        if (customer.favoriteProducts && customer.favoriteProducts.find(isSameId(productId))) {
            return fail(new ValidationError('The product is already in the list of favorites'));
        }
        const product = await this.findProductRepository.findById(productId);
        if (!product) {
            return fail(new ValidationError('Product not found'));
        }
        await this.addFavoriteProductRepository.add(customerId, product);
        return success(product);
    }
}
