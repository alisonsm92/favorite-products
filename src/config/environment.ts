const server = {
    port: process.env.PORT || 3000,
};

const mongodb = {
    uri: process.env.MONGO_URL || 'mongodb://localhost',
    timeoutMS: process.env.MONGO_TIMEOUT_MS ? parseInt(process.env.MONGO_TIMEOUT_MS, 10) : 30000,
};

const productsApi = { url: process.env.PRODUCTS_API_URL || `https://localhost:${server.port}/mock/product` };

const logger = {
    level: process.env.LOG_LEVEL || 'debug',
    prettyPrint: process.env.LOG_PRETTY_PRINT ? process.env.LOG_PRETTY_PRINT === 'true' : false,
};

const node = {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
    isTest: process.env.NODE_ENV === 'test',
};

const axios = {
    timeout: process.env.AXIOS_TIMEOUT_MS ? parseInt(process.env.AXIOS_TIMEOUT_MS, 10) : 5000,
};

const env = {
    server,
    mongodb,
    productsApi,
    logger,
    node,
    axios,
};

export default env;
