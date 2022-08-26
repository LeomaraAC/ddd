import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";

describe('Custome repository test', () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });
        sequileze.addModels([CustomerModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it('should create a customer', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Customer 1');
        customer.Address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        await customerRepository.create(customer);
        const customerModel = await CustomerModel.findOne({where: {id: customer.id}});
        expect(customerModel.toJSON()).toEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: customer.Address.street,
            number: customer.Address.number,
            zipcode: customer.Address.zip,
            city: customer.Address.city
        });
    });

    it('should update a customer', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Customer 1');
        customer.Address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        await customerRepository.create(customer);

        customer.changeName('Customer 2');
        await customerRepository.update(customer);
        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: customer.Address.street,
            number: customer.Address.number,
            zipcode: customer.Address.zip,
            city: customer.Address.city,
        });
    });

    it('should find a customer', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('1', 'Customer 1');
        customer.Address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        await customerRepository.create(customer);

        const customerResult = await customerRepository.find(customer.id);

        expect(customerResult).toStrictEqual(customer);
    });

    it('should throw an error when customer is not found', async () => {
        const customerRepository = new CustomerRepository();

        await expect(async () => {
            await customerRepository.find('456ABC');
        }).rejects.toThrow('Customer not found');
    });

    it('should find all customers', async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer('1', 'Customer 1');
        customer1.Address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer1.addRewardPoints(10);
        customer1.activate();

        const customer2 = new Customer('2', 'Customer 2');
        customer2.Address = new Address('Street 2', 2, 'Zipcode 2', 'City 2');
        customer2.addRewardPoints(20);

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toHaveLength(2);
        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);
    });
});