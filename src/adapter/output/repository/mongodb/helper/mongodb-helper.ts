import { MongoClient, Collection, MongoClientOptions } from 'mongodb';
import env from '../../../../../config/environment';

const MongoHelper = {
    client: null as unknown as MongoClient,
    async connect(uri: string): Promise<void> {
        const options:MongoClientOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: env.mongodb.timeoutMS,
        };
        this.client = await MongoClient.connect(uri, options);
    },
    async disconnect(): Promise<void> {
        this.client.close();
    },
    getCollection(name: string): Collection {
        return this.client.db().collection(name);
    },
};

export default MongoHelper;
