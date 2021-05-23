import { Express, Router } from 'express';
import { readdirSync } from 'fs';

export default (app: Express): void => {
    const router = Router();
    app.use('', router);
    readdirSync(`${__dirname}`).map(async (file) => {
        if (!file.includes('setup.') && !file.includes('.test') && !file.includes('.spec')) {
            (await import(`./${file}`)).default(router);
        }
    });
};
