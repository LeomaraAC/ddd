import {Sequelize} from 'sequelize-typescript';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import Product from '../../../domain/product/entity/product';
import ProductModel from '../../../infrastructure/customer/repository/sequelize/model/product.model';
import ListProductUsecase from './list.product.usecase';

describe('List products use case integration test', () => {
    let sequelize: Sequelize;
    let productRepository: ProductRepository;
    const product1 = new Product('p1', 'Product 1', 231);
    const product2 = new Product('p2', 'Product 2', 93);

    beforeEach(async () => {
        productRepository = new ProductRepository();
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
        await productRepository.create(product1);
        await productRepository.create(product2);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should list all products', async () => {
        const usecase = new ListProductUsecase(productRepository);
        const output = await usecase.execute({});
        expect(output.products.length).toBe(2);
        expect(output.products).toContainEqual({id: product1.id, name: product1.name, price: product1.price});
        expect(output.products).toContainEqual({id: product2.id, name: product2.name, price: product2.price});
    });
});
