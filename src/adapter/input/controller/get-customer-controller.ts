import Customer from '../../../core/domain/customer';
import GetCustomer from '../../../core/use-case/get-customer/port/get-customer';
import GetCustomerParams from '../../../core/use-case/get-customer/port/get-customers-params';
import { notFound, ok, serverError } from '../helper/http-helper';
import Controller from '../port/controller';
import { HttpRequest, HttpResponse } from '../port/http';

const formatResponse = ({ id, name, email }: Customer) :Omit<Customer, 'favoriteProducts'> => (
    { id, name, email }
);

export default class GetCustomerController implements Controller {
    private readonly getCustomer: GetCustomer;

    constructor(getCustomer: GetCustomer) {
        this.getCustomer = getCustomer;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = request.params as GetCustomerParams;
            const result = await this.getCustomer.execute(id);
            if (result.isFailure()) {
                return notFound(result.error);
            }
            return ok(formatResponse(result.value));
        } catch (error) {
            return serverError();
        }
    }
}
