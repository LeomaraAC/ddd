import Product from '../../../domain/product/entity/product';
import ListProductUsecase from './list.product.usecase';

const product1 = new Product('p1', 'Product 1', 100);
const product2 = new Product('p2', 'Product 2', 910);
const product3 = new Product('p3', 'Product 3', 50);

const mockRepository = () => ({
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn().mockReturnValue([product1, product3, product2]),
});

describe('List products use case unit test', () => {
    it('should list all products', async () => {
        const usecase = new ListProductUsecase(mockRepository());
        const output = await usecase.execute({});
        expect(output.products.length).toBe(3);
        expect(output.products).toContainEqual({id: product1.id, name: product1.name, price: product1.price});
        expect(output.products).toContainEqual({id: product2.id, name: product2.name, price: product2.price});
        expect(output.products).toContainEqual({id: product3.id, name: product3.name, price: product3.price});
    });
});
