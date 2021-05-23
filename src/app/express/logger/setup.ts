import { Express } from 'express';
import expressPinoLogger from 'express-pino-logger';
import pino from './pino';

export default (app: Express): void => {
    app.use(expressPinoLogger({
        logger: pino,
        serializers: {
            req: (req) => ({
                method: req.method,
                url: req.url,
                body: req.body,
            }),
            res: ({ statusCode }) => ({
                statusCode,
            }),
        },
    }));
};
