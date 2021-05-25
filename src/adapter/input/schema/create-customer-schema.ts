import { Schema } from '../port/json-schema-validator';

const createCustomerSchema: Schema = {
    type: 'object',
    properties: {
        name: { type: 'string', required: true },
        email: { type: 'string', required: true },
    },
    additionalProperties: false,
};

export default createCustomerSchema;
