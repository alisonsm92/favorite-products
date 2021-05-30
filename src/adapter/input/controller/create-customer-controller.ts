import { Either } from '../../../common/either';
import Customer from '../../../core/domain/customer';
import CreateCustomer from '../../../core/use-case/create-customer/port/create-customer';
import CreateCustomerParams from '../../../core/use-case/create-customer/port/create-customer-params';
import ValidationError from '../../../core/error/validation-error';
import { badRequest, ok, serverError } from '../helper/http-helper';
import Controller from '../port/controller';
import { HttpRequest, HttpResponse } from '../port/http';
import { JsonSchemaValidator } from '../port/json-schema-validator';
import createCustomerSchema from '../schema/create-customer-schema';
import Logger from '../port/logger';

type Result = Either<ValidationError, Customer>

export default class CreateCustomerController implements Controller {
    private readonly createCustomer: CreateCustomer

    private readonly jsonSchemaValidator: JsonSchemaValidator

    private readonly logger: Logger;

    constructor(
        createCustomer: CreateCustomer,
        jsonSchemaValidator: JsonSchemaValidator,
        logger: Logger,
    ) {
        this.createCustomer = createCustomer;
        this.jsonSchemaValidator = jsonSchemaValidator;
        this.logger = logger;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const inputData = request.body as CreateCustomerParams;
            const validation = this.jsonSchemaValidator.validate(inputData, createCustomerSchema);
            if (validation.isFailure()) {
                return badRequest(validation.error);
            }
            const result: Result = await this.createCustomer.execute(inputData);
            if (result.isFailure()) {
                return badRequest(result.error);
            }

            return ok(result.value);
        } catch (error) {
            this.logger.error({ error }, 'Failed to create customer');
            return serverError();
        }
    }
}
