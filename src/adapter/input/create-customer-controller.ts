import { Either } from '../../common/either';
import CustomerData from '../../core/domain/customer-data';
import { CreateCustomer } from '../../core/use-case/create-customer/create-customer';
import ValidationError from '../../core/use-case/error/validation-error';
import { CreateCustomerParams } from '../../core/use-case/port/create-customer-params';
import { ok, badRequest, serverError } from './helper/http-helper';
import { Controller } from './port/controller';
import { HttpRequest, HttpResponse } from './port/http';

type Result = Either<ValidationError, CustomerData['id']>

export default class createCustomerController implements Controller {
    private readonly createCustomer

    constructor({ createCustomer }: { createCustomer: CreateCustomer }) {
        this.createCustomer = createCustomer;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const inputData = request.body as CreateCustomerParams;
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
