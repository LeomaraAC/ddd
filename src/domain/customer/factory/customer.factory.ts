import Customer from '../entity/customer';
import {v4 as uuid} from 'uuid';
import Address from '../value-object/address';

export default class CustomerFactory {
    static create(nome: string): Customer {
        return new Customer(uuid(), nome);
    }

    static createWithAddress(nome: string, address: Address): Customer {
        const customer = new Customer(uuid(), nome);
        customer.changeAddress(address);
        return customer;
    }
}
