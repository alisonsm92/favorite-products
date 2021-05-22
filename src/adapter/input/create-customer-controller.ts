import { Either } from '../../common/either';
import CustomerData from '../../core/domain/customer-data';
import { CreateCustomer } from '../../core/use-case/create-customer/create-customer';
import ValidationError from '../../core/use-case/error/validation-error';
import { CreateCustomerParams } from '../../core/use-case/port/create-customer-params';
import { ok, badRequest, serverError } from './helper/http-helper';
import { HttpRequest, HttpResponse } from './port/http';

type Result = Either<ValidationError, CustomerData>

export default class createCustomerController {
    private readonly createCustomer

    constructor({ createCustomer }: { createCustomer: CreateCustomer }) {
        this.createCustomer = createCustomer;
    }

    async handle(request: HttpRequest<CreateCustomerParams>): Promise<HttpResponse> {
        try {
            const inputData = request.body;
            const result: Result = await this.createCustomer.execute(inputData);
            if (result.isFailure()) {
                return badRequest(result.error);
            }

            return ok(result.value);
        } catch (error) {
            return serverError();
        }
    }
}
