import Product from '../../../domain/product/entity/product';
import UpdateProductUsecase from './update.product.usecase';

const product = new Product('1', 'Product 1', 100);

const mockRepository = () => ({
    find: jest.fn().mockReturnValue(product),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
});

describe('Update product use case unit test', () => {
    it('should update a product', async () => {
        const input = {id: product.id, name: 'Product 2', price: 142};
        const usecase = new UpdateProductUsecase(mockRepository());
        const output = await usecase.execute(input);
        expect(output).toEqual(input);
    });

    it('should throw error when price is less than zero', async () => {
        const usecase = new UpdateProductUsecase(mockRepository());
        await expect(usecase.execute({id: product.id, name: 'Product 2', price: -1})).rejects
            .toThrow('Price must be greater than zero');
    });

    it('should throw error when name is empty', async () => {
        const usecase = new UpdateProductUsecase(mockRepository());
        await expect(usecase.execute({id: product.id, name: '', price: 1})).rejects
            .toThrow('Name is required');
    });

    it('should throw error when not find the product', async () => {
        const repository = mockRepository();
        repository.find.mockImplementation(() => {
            throw new Error('Product not found');
        });
        const usecase = new UpdateProductUsecase(repository);
        await expect(usecase.execute({id: 'p2', name: 'Product 3', price: 121})).rejects
            .toThrow('Product not found');
    });
});
