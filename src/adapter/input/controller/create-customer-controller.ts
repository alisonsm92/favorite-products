import { Either } from '../../../common/either';
import CustomerData from '../../../core/domain/customer-data';
import CreateCustomer from '../../../core/use-case/create-customer/port/create-customer';
import CreateCustomerParams from '../../../core/use-case/create-customer/port/create-customer-params';
import ValidationError from '../../../core/use-case/error/validation-error';
import { badRequest, ok, serverError } from '../helper/http-helper';
import Controller from '../port/controller';
import { HttpRequest, HttpResponse } from '../port/http';
import { JsonSchemaValidator } from '../port/json-schema-validator';
import createCustomerSchema from '../schema/create-customer-schema';

type Result = Either<ValidationError, CustomerData['id']>

export default class CreateCustomerController implements Controller {
    private readonly createCustomer: CreateCustomer

    private readonly jsonSchemaValidator: JsonSchemaValidator

    constructor({ createCustomer, jsonSchemaValidator }
        : { createCustomer: CreateCustomer, jsonSchemaValidator: JsonSchemaValidator }) {
        this.createCustomer = createCustomer;
        this.jsonSchemaValidator = jsonSchemaValidator;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const inputData = Object.freeze(request.body) as CreateCustomerParams;
            const validation = this.jsonSchemaValidator.validate(inputData, createCustomerSchema);
            if (validation.isFailure()) {
                return badRequest(validation.error);
            }
            const result: Result = await this.createCustomer.execute(inputData);
            if (result.isFailure()) {
                return badRequest(result.error);
            }

            return ok({ id: result.value, ...inputData });
        } catch (error) {
            return serverError();
        }
    }
}
