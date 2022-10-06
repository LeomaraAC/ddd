import CreateProductUsecase from './create.product.usecase';
import {Sequelize} from 'sequelize-typescript';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import ProductModel from '../../../infrastructure/customer/repository/sequelize/model/product.model';

describe('Product use case integration test', () => {
    let sequelize: Sequelize;
    let productRepository: ProductRepository;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
        productRepository = new ProductRepository();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new product', async () => {
        const usecase = new CreateProductUsecase(productRepository);
        const output = await usecase.execute({name: 'Product 1', price: 1});
        const product = await ProductModel.findOne({where: {id: output.id}});
        expect(output).toEqual({
            id: product.id,
            name: product.name,
            price: product.price
        });
    });

    it('should throw error when price is less than zero', async () => {
        const usecase = new CreateProductUsecase(productRepository);
        await expect(usecase.execute({name: 'Product 2', price: -1})).rejects
            .toThrow('Price must be greater than zero');
    });

    it('should throw error when name is empty', async () => {
        const usecase = new CreateProductUsecase(productRepository);
        await expect(usecase.execute({name: '', price: 1})).rejects
            .toThrow('Name is required');
    });
});
