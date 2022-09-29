import CreateCustomerUsecase from './create.customer.usecase';
import {InputCreateCustomerDto} from './create.customer.dto';

const input: InputCreateCustomerDto = {
    name: 'Customer 1',
    address: {
        street: 'Street 1',
        zip: 'Zip 1',
        number: 1,
        city: 'City 1'
    }
};

const mockRepository = () => ({
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
});

describe('Create customer use case unit test', () => {
    it('should create a customer', async() => {
        const usecase = new CreateCustomerUsecase(mockRepository());
        const output = await usecase.exexute(input);
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                zip: input.address.zip,
                number: input.address.number,
                city: input.address.city
            }
        });
    });

    it('should thrown an error when name is missing', async () => {
        const usecase = new CreateCustomerUsecase(mockRepository());
        input.name = '';
        await expect(usecase.exexute(input)).rejects.toThrow('Name is required');
    });

    it('should thrown an error when street is missing', async () => {
        const usecase = new CreateCustomerUsecase(mockRepository());
        input.address.street = '';
        await expect(usecase.exexute(input)).rejects.toThrow('Street is required');
    });
});
