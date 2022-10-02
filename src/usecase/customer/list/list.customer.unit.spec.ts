import Customer from '../../../domain/customer/entity/customer';
import Address from '../../../domain/customer/value-object/address';
import ListCustomerUsecase from './list.customer.usecase';

const customer1 = new Customer('1', 'Customer 1');
customer1.Address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');

const customer2 = new Customer('2', 'Customer 2');
customer2.Address = new Address('Street 2', 2, 'Zipcode 2', 'City 2');

const mockRepository = () => ({
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
});


describe('Unit test for listing customers use case', () => {
    it('should list all customers', async () => {
        const usecase = new ListCustomerUsecase(mockRepository());
        const output = await usecase.execute({});
        expect(output.customers.length).toBe(2);
        expect(output.customers).toContainEqual({
            id: customer1.id,
            name: customer1.name,
            address: {
                street: customer1.Address.street,
                number: customer1.Address.number,
                city: customer1.Address.city,
                zip: customer1.Address.zip,
            }
        });
        expect(output.customers).toContainEqual({
            id: customer2.id,
            name: customer2.name,
            address: {
                street: customer2.Address.street,
                number: customer2.Address.number,
                city: customer2.Address.city,
                zip: customer2.Address.zip,
            }
        });
    });
});
