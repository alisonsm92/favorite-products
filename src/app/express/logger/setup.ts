import { Express } from 'express';
import logger from 'express-pino-logger';

export default (app: Express): void => {
    app.use(logger());
};
