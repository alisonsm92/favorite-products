import { Either, fail, success } from '../../../common/either';
import Customer from '../../domain/customer';
import Product from '../../domain/product';
import ValidationError from '../error/validation-error';
import AddFavoriteProduct from './port/add-favorite-product';
import FindProductRepository from './port/find-product-repository';
import UpdateCustomerRepository from './port/update-customer-repository';

type Result = Promise<Either<ValidationError, Product>>

export default class AddFavoriteProductOnDb implements AddFavoriteProduct {
    private readonly findProductRepository: FindProductRepository;

    private readonly updateCustomerRepository: UpdateCustomerRepository;

    constructor(findProductRepository: FindProductRepository,
        updateCustomerRepository: UpdateCustomerRepository) {
        this.findProductRepository = findProductRepository;
        this.updateCustomerRepository = updateCustomerRepository;
    }

    async execute(customerID: Customer['id'], productID: Product['id']): Result {
        const product = await this.findProductRepository.findById(productID);
        if (!product) return fail(new ValidationError('Product does not exists'));
        const result = await this.updateCustomerRepository.addFavoriteProduct(customerID, product);
        if (!result) return fail(new ValidationError('Product already is in the favorite list'));
        return success(product);
    }
}
