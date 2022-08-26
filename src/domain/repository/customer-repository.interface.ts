import RepositoryInterface from "./repository-interface";
import Product from "../entity/product";
import Customer from "../entity/customer";

export default interface CustomerRepositoryInterface extends RepositoryInterface<Customer> { }
