import { Router } from 'express';
import makeCreateCustomerController from '../../factory/controller/create-customer-controller-factory';

import adaptRoute from '../adapter/express-route-adapter';

export default (router: Router): void => {
    router.post('/customers', adaptRoute(makeCreateCustomerController()));
};
