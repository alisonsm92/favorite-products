import { Either, fail, success } from '../../../common/either';
import Customer from '../../domain/customer';
import Product from '../../domain/product';
import ValidationError from '../error/validation-error';
import FindCustomerRepository from '../port/find-customer-repository';
import isSameId from './helper';
import AddFavoriteProduct from './port/add-favorite-product';
import FindProductRepository from './port/find-product-repository';
import UpdateCustomerRepository from './port/update-customer-repository';

type Dependencies = {
    findProductRepository: FindProductRepository,
    updateCustomerRepository: UpdateCustomerRepository
    findCustomerRepository: FindCustomerRepository
}
type Result = Promise<Either<ValidationError, Product>>

export default class AddFavoriteProductOnDb implements AddFavoriteProduct {
    private readonly findCustomerRepository: FindCustomerRepository;

    private readonly findProductRepository: FindProductRepository;

    private readonly updateCustomerRepository: UpdateCustomerRepository;

    constructor({ findCustomerRepository, findProductRepository, updateCustomerRepository }: Dependencies) {
        this.findCustomerRepository = findCustomerRepository;
        this.findProductRepository = findProductRepository;
        this.updateCustomerRepository = updateCustomerRepository;
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
        await this.updateCustomerRepository.addFavoriteProduct(customerId, product);
        return success(product);
    }
}
