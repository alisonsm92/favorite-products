import { HttpResponse } from '../port/http';

export const ok = (data: unknown): HttpResponse => ({
    statusCode: 200,
    body: data,
});

export const noContent = (): HttpResponse => ({
    statusCode: 204,
    body: null,
});

export const badRequest = ({ message }: Error): HttpResponse => ({
    statusCode: 400,
    body: { error: { message } },
});

export const notFound = ({ message }: Error): HttpResponse => ({
    statusCode: 404,
    body: { error: { message } },
});

export const serverError = (): HttpResponse => ({
    statusCode: 500,
    body: { error: { message: 'Internal server error' } },
});
