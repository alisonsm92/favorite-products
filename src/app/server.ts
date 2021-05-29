import MongoHelper from '../adapter/output/repository/mongodb/helper/mongodb-helper';
import env from '../config/environment';
import logger from './express/logger/pino';

const server = {
    async initialize() {
        try {
            await MongoHelper.initialize(env.mongodb.uri);
            logger.debug('MongoDB: connected');
            const app = (await import('./express/app')).default;
            app.listen(env.server.port, () => {
                logger.debug(`Server: running at http://localhost:${env.server.port}`);
            });
        } catch (error) {
            logger.error(error, 'Failed to initialize server');
        }
    },
};

server.initialize();
