import pino from 'pino';
import env from '../../../config/environment';

const logger = pino({
    enabled: !env.node.isTest,
    level: env.logger.level,
    prettyPrint: env.node.isDevelopment || env.logger.prettyPrint,
    serializers: {
        error: pino.stdSerializers.err,
    },
});

export default logger;
