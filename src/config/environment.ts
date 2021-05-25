const env = {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
    isTest: process.env.NODE_ENV === 'test',
    server: {
        port: process.env.PORT || 3000,
    },
    mongodb: {
        uri: process.env.MONGO_URL || 'mongodb://localhost',
        timeoutMS: process.env.MONGO_TIMEOUT_MS ? parseInt(process.env.MONGO_TIMEOUT_MS, 10) : 30000,
    },
    logger: {
        level: process.env.LOG_LEVEL || 'debug',
        prettyPrint: process.env.LOG_PRETTY_PRINT ? process.env.LOG_PRETTY_PRINT === 'true' : false,
    },
};

export default env;
