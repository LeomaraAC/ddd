import CreateProductUsecase from './create.product.usecase';
import {InputCreateProductDto} from './create.product.dto';

const mockRepository = () => ({
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
});


describe('Product use case unit test', () => {
    it('should create a new product', async () => {
        const usecase = new CreateProductUsecase(mockRepository());
        const input: InputCreateProductDto = {name: 'Product 1', price: 1};
        const output = await usecase.execute(input);
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });
    });

    it('should throw error when price is less than zero', async () => {
        const usecase = new CreateProductUsecase(mockRepository());
        await expect(usecase.execute({name: 'Product 2', price: -1})).rejects
            .toThrow('Price must be greater than zero');
    });

    it('should throw error when name is empty', async () => {
        const usecase = new CreateProductUsecase(mockRepository());
        await expect(usecase.execute({name: '', price: 1})).rejects
            .toThrow('Name is required');
    });
});
