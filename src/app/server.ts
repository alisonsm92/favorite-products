import dotenv from 'dotenv';
import MongoHelper from '../adapter/output/repository/mongodb/helper/mongodb-helper';
import config from '../config/environment';

dotenv.config();

MongoHelper.connect(config.mongodb.uri)
    .then(async () => {
        console.log('MongoDB is connected');
        const app = (await import('./express/app')).default;
        app.listen(config.server.port, () => {
            console.log(`Server running at http://localhost:${config.server.port}`);
        });
    })
    .catch(console.error);
