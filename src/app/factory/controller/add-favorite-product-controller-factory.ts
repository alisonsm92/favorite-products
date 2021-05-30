import AddFavoriteProductController from '../../../adapter/input/controller/add-favorite-product-controller';
import Controller from '../../../adapter/input/port/controller';
import MongoCustomerRepository from '../../../adapter/output/repository/mongodb/customer-repository';
import MongoFavoriteProductsRepository from '../../../adapter/output/repository/mongodb/favorite-products-repository';
import ApiProductRepository from '../../../adapter/output/repository/rest-api/product-repository';
import AddFavoriteProductOnDb from '../../../core/use-case/add-favorite-product/add-favorite-product-on-db';

export default function makeAddFavoriteProductController(): Controller {
    const mongoCustomerRepository = new MongoCustomerRepository();
    const favoriteProductsRepository = new MongoFavoriteProductsRepository();
    const apiProductRepository = new ApiProductRepository();
    const addFavoriteProduct = new AddFavoriteProductOnDb(
        mongoCustomerRepository,
        apiProductRepository,
        favoriteProductsRepository,
    );
    return new AddFavoriteProductController(addFavoriteProduct);
}
