import { Router } from 'express';
import makeAddFavoriteProductController from '../../factory/controller/add-favorite-product-controller-factory';
import ExpressHelper from '../helper/express-route-helper';

export default (router: Router): void => {
    router.post('/customer/:customerId/favorite-product/:productId',
        ExpressHelper.adaptRoute(makeAddFavoriteProductController()));
};
