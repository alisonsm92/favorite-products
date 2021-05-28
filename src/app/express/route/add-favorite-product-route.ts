import { Router } from 'express';
import makeAddFavoriteProductController from '../../factory/controller/add-favorite-product-controller-factory';

import adaptRoute from '../adapter/express-route-adapter';

export default (router: Router): void => {
    router.post('/customer/:customerId/favorite-product/:productId',
        adaptRoute(makeAddFavoriteProductController()));
};
