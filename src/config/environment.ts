const server = { port: process.env.PORT || 3000 };
const mongodb = {
    uri: process.env.MONGO_URL || 'mongodb://localhost',
    timeoutMS: process.env.MONGO_TIMEOUT_MS ? parseInt(process.env.MONGO_TIMEOUT_MS, 10) : 5000,
};

export default { server, mongodb };
