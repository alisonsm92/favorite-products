import { Router } from 'express';
import makeGetFavoriteProductsController from '../../factory/controller/get-favorite-products-controller-factory';
import adaptRoute from '../adapter/express-route-adapter';

export default (router: Router): void => {
    router.get('/customer/:customerId/favorite-product', adaptRoute(makeGetFavoriteProductsController()));
};
