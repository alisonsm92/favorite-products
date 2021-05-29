import {
    MongoClient, Collection, MongoClientOptions, ObjectID,
} from 'mongodb';
import env from '../../../../../config/environment';

type Document<T> = Omit<T, 'id'> & { _id: ObjectID }

export default class MongoHelper {
    private static client = null as unknown as MongoClient;

    private static options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: env.mongodb.timeoutMS,
    };

    static async connect(uri: string): Promise<void> {
        MongoHelper.client = await MongoClient.connect(uri, MongoHelper.options);
    }

    static async disconnect(): Promise<void> {
        MongoHelper.client.close();
    }

    static getCollection<T = any>(name: string): Collection<Document<T>> {
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
