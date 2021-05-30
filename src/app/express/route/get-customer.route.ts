import { Router } from 'express';
import makeGetCustomerController from '../../factory/controller/get-customer-controller-factory';
import ExpressHelper from '../helper/express-route-helper';

export default (router: Router): void => {
    router.get('/customer/:id', ExpressHelper.adaptRoute(makeGetCustomerController()));
};
