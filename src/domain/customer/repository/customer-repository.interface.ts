import RepositoryInterface from '../../@shared/repository/repository-interface';
import Product from '../../product/entity/product';
import Customer from '../entity/customer';

export default interface CustomerRepositoryInterface extends RepositoryInterface<Customer> { }
