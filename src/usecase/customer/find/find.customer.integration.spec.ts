import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../../../infrastructure/product/repository/sequelize/model/customer.model';
import CustomerRepository from '../../../infrastructure/customer/repository/sequelize/customer.repository';
import Customer from '../../../domain/customer/entity/customer';
import Address from '../../../domain/customer/value-object/address';
import {InputFindCustomerDto, OutputFindCustomerDto} from './find.customer.dto';
import FindCustomerUsecase from './find.customer.usecase';
import {v4 as uuid} from 'uuid';

describe('find customer use case integration test', () => {
    let sequileze: Sequelize;
    const customerRepository = new CustomerRepository();
    let customer: Customer;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });
        sequileze.addModels([CustomerModel]);
        await sequileze.sync();
        customer = new Customer(uuid(), 'Customer 1');
        customer.Address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customerRepository.create(customer);
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it('should find a customer', async () => {
        const usecase = new FindCustomerUsecase(customerRepository);

        const input: InputFindCustomerDto = {id: customer.id};
        const output: OutputFindCustomerDto = {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.Address.street,
                number: customer.Address.number,
                city: customer.Address.city,
                zip: customer.Address.zip,
            }
        };

        const result = await usecase.execute(input);
        expect(result).toEqual(output);
    });

    it('should throw an error when not found a customer', async () => {
        const usecase = new FindCustomerUsecase(customerRepository);
        await expect(() => usecase.execute({id: `${customer.id}_1`})).rejects.toThrow('Customer not found');
    });
});
