import {InputUpdateCustomerDto} from './update.customer.dto';
import Customer from '../../../domain/customer/entity/customer';
import Address from '../../../domain/customer/value-object/address';
import UpdateCustomerUsecase from './update.customer.usecase';

const input: InputUpdateCustomerDto = {
    id: '1',
    name: 'Customer 1',
    address: {
        street: 'Street 1',
        zip: 'Zip 1',
        number: 1,
        city: 'City 1'
    }
};

const customer = new Customer('1', 'Customer 1');
customer.Address = new Address('Street 1', 1, 'Zip 1', 'City 1');

const mockRepository = () => ({
    find: jest.fn().mockReturnValue(customer),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
});

describe('Update customer user case unit test', () => {
    it('should update a customer', async () => {
        const usecase = new UpdateCustomerUsecase(mockRepository());
        const output = await usecase.execute(input);
        expect(output).toEqual(input);
    });
});
