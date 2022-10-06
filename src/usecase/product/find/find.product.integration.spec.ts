import {Sequelize} from 'sequelize-typescript';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import ProductModel from '../../../infrastructure/customer/repository/sequelize/model/product.model';
import Product from '../../../domain/product/entity/product';
import FindProductUsecase from './find.product.usecase';

describe('Find product use case integration test', () => {
    let sequelize: Sequelize;
    let productRepository: ProductRepository;
    const product = new Product('p1', 'Product 1', 231);

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
        await productRepository.create(product);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should find a product by id', async () => {
        const usecase = new FindProductUsecase(productRepository);
        const output = await usecase.execute({id: product.id});
        expect(output).toEqual({
            id: product.id,
            name: product.name,
            price: product.price
        });
    });

    it('should throw an error when id doesn\'t exist', async () => {
        const usecase = new FindProductUsecase(productRepository);
        await expect(usecase.execute({id: 'p2'})).rejects.toThrow('Product not found');
    });

});
