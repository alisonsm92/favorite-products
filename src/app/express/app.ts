import express from 'express';
import setupLogger from './logger/setup';
import setupMiddleware from './middleware/setup';
import setupRoutes from './route/setup';

const app = express();
setupLogger(app);
setupMiddleware(app);
setupRoutes(app);
export default app;
