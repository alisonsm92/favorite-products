import { Router } from 'express';
import makeGetFavoriteProductsController from '../../factory/controller/get-favorite-products-controller-factory';
import ExpressHelper from '../helper/express-route-helper';

export default (router: Router): void => {
    router.get('/customer/:customerId/favorite-product',
        ExpressHelper.adaptRoute(makeGetFavoriteProductsController()));
};
