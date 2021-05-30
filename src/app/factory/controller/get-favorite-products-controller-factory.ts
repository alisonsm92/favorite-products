import GetFavoriteProductController from '../../../adapter/input/controller/get-favorite-product-controller';
import Controller from '../../../adapter/input/port/controller';
import MongoFavoriteProductsRepository from '../../../adapter/output/repository/mongodb/favorite-products-repository';
import GetFavoriteProductsFromDB from '../../../core/use-case/get-favorite-products/get-favorite-products-from-db';
import logger from '../../express/logger/pino';

export default function makeGetFavoriteProductsController(): Controller {
    const mongoFavoriteProductsRepository = new MongoFavoriteProductsRepository();
    const getFavoriteProducts = new GetFavoriteProductsFromDB(mongoFavoriteProductsRepository);
    return new GetFavoriteProductController(getFavoriteProducts, logger);
}
