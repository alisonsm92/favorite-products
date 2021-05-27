import Customer from '../../domain/customer';

interface FindCustomerRepository {
    findById(id: Customer['id']) : Promise<Customer|null>
}

export default FindCustomerRepository;
