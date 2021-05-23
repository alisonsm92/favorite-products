import pino from 'pino';
import env from '../../../config/environment';

const logger = pino({
    enabled: !env.isTest,
    level: env.logger.level,
    prettyPrint: env.isDevelopment || env.logger.prettyPrint,
});

export default logger;
