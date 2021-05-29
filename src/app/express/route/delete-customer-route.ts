import { Router } from 'express';
import makeDeleteCustomerController from '../../factory/controller/delete-customer-controller-factory';
import ExpressHelper from '../helper/express-route-helper';

export default (router: Router): void => {
    router.delete('/customer/:id', ExpressHelper.adaptRoute(makeDeleteCustomerController()));
};
