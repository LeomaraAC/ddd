import Product from '../../../domain/product/entity/product';
import FindProductUsecase from './find.product.usecase';

const product = new Product('1', 'Product 1', 100);

const mockRepository = () => ({
    find: jest.fn().mockReturnValue(product),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
});

describe('Find product use case unit test', () => {
    it('should find a product by id', async () => {
        const usecase = new FindProductUsecase(mockRepository());
        const output = await usecase.execute({id: product.id});
        expect(output).toEqual({id: product.id, name: product.name, price: product.price});
    });

    it('should throw an error when id doesn\'t exist', async () => {
        const repository = mockRepository();
        repository.find.mockImplementation(() => {
            throw new Error('Product not found');
        });
        const usecase = new FindProductUsecase(repository);
        await expect(usecase.execute({id: '2'})).rejects.toThrow('Product not found');
    });
});
