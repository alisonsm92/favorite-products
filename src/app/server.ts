import dotenv from 'dotenv';
import MongoHelper from '../adapter/output/repository/mongodb/helper/mongodb-helper';
import env from '../config/environment';

dotenv.config();

MongoHelper.connect(env.mongodb.uri)
    .then(async () => {
        console.log('MongoDB: connected');
        const app = (await import('./express/app')).default;
        app.listen(env.server.port, () => {
            console.log(`Server: running at http://localhost:${env.server.port}`);
        });
    })
    .catch(console.error);
