import Customer from '../../../domain/customer/entity/customer';
import Address from '../../../domain/customer/value-object/address';
import FindCustomerUsecase from './find.customer.usecase';
import {InputFindCustomerDto, OutputFindCustomerDto} from './find.customer.dto';

const customer = new Customer('1', 'Customer 1');
customer.Address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');

const mockRepository = () => ({
    find: jest.fn().mockReturnValue(customer),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
});

describe('Find customer user case unit test', () => {
    it('should find a customer', async () => {
        const usecase = new FindCustomerUsecase(mockRepository());
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
        const customerRepository = mockRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error('Customer not found');
        });
        const usecase = new FindCustomerUsecase(customerRepository);
        await expect(async () => await usecase.execute({id: '123'})).rejects.toThrow('Customer not found');
    });
});
