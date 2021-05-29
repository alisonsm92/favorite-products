import { Request, Response } from 'express';
import Controller from '../../../adapter/input/port/controller';

export default class ExpressHelper {
    static adaptRoute(controller: Controller) {
        return async (req: Request, res: Response): Promise<void> => {
            const request = {
                body: req.body,
                params: req.params,
            };
            const httpResponse = await controller.handle(request);
            res.status(httpResponse.statusCode).json(httpResponse.body);
        };
    }
}
