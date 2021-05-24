import { Either } from '../../common/either';
import DeleteCustomer from '../../core/use-case/delete-customer/port/delete-customer';
import DeleteCustomerParams from '../../core/use-case/delete-customer/port/delete-customer-params';
import NotFoundError from '../../core/use-case/error/not-found-error';
import { noContent, notFound, serverError } from './helper/http-helper';
import { HttpRequest, HttpResponse } from './port/http';
import Controller from './port/controller';

type Result = Either<NotFoundError, void>

export default class DeleteCustomerController implements Controller {
    private readonly deleteCustomer

    constructor({ deleteCustomer }: { deleteCustomer: DeleteCustomer }) {
        this.deleteCustomer = deleteCustomer;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const params = request.params as DeleteCustomerParams;
            const result: Result = await this.deleteCustomer.execute(params.id);
            if (result.isFailure()) {
                return notFound(result.error);
            }

            return noContent();
        } catch (error) {
            return serverError();
        }
    }
}
