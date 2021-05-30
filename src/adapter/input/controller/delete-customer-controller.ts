import { Either } from '../../../common/either';
import DeleteCustomer from '../../../core/use-case/delete-customer/port/delete-customer';
import DeleteCustomerParams from '../../../core/use-case/delete-customer/port/delete-customer-params';
import NotFoundError from '../../../core/error/not-found-error';
import { notFound, noContent, serverError } from '../helper/http-helper';
import Controller from '../port/controller';
import { HttpRequest, HttpResponse } from '../port/http';
import Logger from '../port/logger';

type Result = Either<NotFoundError, void>

export default class DeleteCustomerController implements Controller {
    private readonly deleteCustomer: DeleteCustomer

    private readonly logger: Logger;

    constructor(deleteCustomer: DeleteCustomer, logger: Logger) {
        this.deleteCustomer = deleteCustomer;
        this.logger = logger;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = request.params as DeleteCustomerParams;
            const result: Result = await this.deleteCustomer.execute(id);
            if (result.isFailure()) {
                return notFound(result.error);
            }

            return noContent();
        } catch (error) {
            this.logger.error({ error }, 'Failed to delete customer');
            return serverError();
        }
    }
}
