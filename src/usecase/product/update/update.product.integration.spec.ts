import UpdateProductUsecase from './update.product.usecase';
import {Sequelize} from 'sequelize-typescript';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import Product from '../../../domain/product/entity/product';
import ProductModel from '../../../infrastructure/customer/repository/sequelize/model/product.model';

describe('Update product use case integration test', () => {
    let sequelize: Sequelize;
    let repository: ProductRepository;
    const product = new Product('p1', 'Product 1', 1);

    beforeEach(async () => {
        repository = new ProductRepository();
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
        await repository.create(product);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should update a product', async () => {
        const input = {id: product.id, name: 'Product 2', price: 2};
        const usecase = new UpdateProductUsecase(repository);
        const output = await usecase.execute(input);
        expect(output).toEqual(input);
    });

    it('should throw error when price is less than zero', async () => {
        const usecase = new UpdateProductUsecase(repository);
        await expect(usecase.execute({id: product.id, name: 'Product 2', price: -1})).rejects
            .toThrow('Price must be greater than zero');
    });

    it('should throw error when name is empty', async () => {
        const usecase = new UpdateProductUsecase(repository);
        await expect(usecase.execute({id: product.id, name: '', price: 1})).rejects
            .toThrow('Name is required');
    });

    it('should throw error when not find the product', async () => {
        const usecase = new UpdateProductUsecase(repository);
        await expect(usecase.execute({id: 'p2', name: 'Product 3', price: 121})).rejects
            .toThrow('Product not found');
    });
});
