import { Router } from 'express';
import makeDeleteCustomerController from '../../factory/controller/delete-customer-controller-factory';
import adaptRoute from '../adapter/express-route-adapter';

export default (router: Router): void => {
    router.delete('/customer/:id', adaptRoute(makeDeleteCustomerController()));
};
