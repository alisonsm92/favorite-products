import { HttpResponse } from '../port/http';

export const ok = (data: unknown): HttpResponse => ({
    statusCode: 200,
    body: data,
});

export const badRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: { error: error.message },
});

export const serverError = (): HttpResponse => ({
    statusCode: 500,
    body: { error: 'Internal server error' },
});
