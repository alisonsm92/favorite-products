import { Router } from 'express';
import makeCreateCostumerController from '../../factory/controller/create-costumer-controller-factory';
import adaptRoute from '../adapter/express-route-adapter';

export default (router: Router): void => {
    router.post('/costumers', adaptRoute(makeCreateCostumerController()));
};
