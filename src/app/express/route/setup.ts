import { Express, Router } from 'express';
import { readdirSync } from 'fs';

export default (app: Express): void => {
    const router = Router();
    app.use('', router);
    readdirSync(`${__dirname}`).map(async (file) => {
        if (!new RegExp(['setup', '.map', '.spec', '.test'].join('|')).test(file)) {
            (await import(`./${file}`)).default(router);
        }
    });
};
