import Customer from '../../../domain/customer';

interface GetFavoriteProductParams {
    customerId: Customer['id']
}

export default GetFavoriteProductParams;
