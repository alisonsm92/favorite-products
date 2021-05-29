import { MongoClient, Collection, MongoClientOptions } from 'mongodb';
import env from '../../../../../config/environment';

export default class MongoHelper {
    private static client = null as unknown as MongoClient;

    static async connect(uri: string): Promise<void> {
        const options:MongoClientOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: env.mongodb.timeoutMS,
        };
        MongoHelper.client = await MongoClient.connect(uri, options);
    }

    static async disconnect(): Promise<void> {
        MongoHelper.client.close();
    }

    static getCollection(name: string): Collection {
        return MongoHelper.client.db().collection(name);
    }

    static async createIndex(collection: string, index: unknown): Promise<void> {
        await MongoHelper.getCollection(collection).createIndex(index);
    }

    static async initialize(uri: string) : Promise<void> {
        await MongoHelper.connect(uri);
        await MongoHelper.createIndex('customers', { email: 1 });
    }
}
