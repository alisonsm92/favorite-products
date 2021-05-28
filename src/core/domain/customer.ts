import Product from './product';

interface Customer {
    id: string,
    name: string,
    email: string,
    favoriteProducts?: Product[]
}

export default Customer;
