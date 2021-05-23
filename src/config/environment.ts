const server = { port: process.env.PORT || 3000 };
const mongodb = { uri: process.env.MONGO_URL || 'mongodb://localhost' };

export default { server, mongodb };
