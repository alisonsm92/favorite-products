import { Router } from 'express';
import makeCreateCustomerController from '../../factory/controller/create-customer-controller-factory';
import ExpressHelper from '../helper/express-route-helper';

export default (router: Router): void => {
    router.post('/customer', ExpressHelper.adaptRoute(makeCreateCustomerController()));
};
