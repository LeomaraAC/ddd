import {Sequelize} from 'sequelize-typescript';
import ProductModel from '../../../customer/repository/sequelize/model/product.model';
import ProductRepository from './product.repository';
import Product from '../../../../domain/product/entity/product';

describe('Product repository test', () => {
    let sequileze: Sequelize;

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });
        sequileze.addModels([ProductModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it('should create a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);
        await productRepository.create(product);
        const productModel = await ProductModel.findOne({where: {id: product.id}});
        expect({id: product.id, name: product.name, price: product.price}).toStrictEqual(productModel.toJSON());
    });

    it('should update a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);
        await productRepository.create(product);
        product.changeName('Product 2');
        product.changePrice(200);
        await productRepository.update(product);
        const productModel = await ProductModel.findOne({where: {id: product.id}});
        expect({id: product.id, name: product.name, price: product.price}).toStrictEqual(productModel.toJSON());
    });

    it('should find a product', async () => {
        const productRepository = new ProductRepository();
        const product = new Product('1', 'Product 1', 100);
        await productRepository.create(product);
        const productModel = await ProductModel.findOne({where: {id: product.id}});
        const foundProduct = await productRepository.find(product.id);
        expect({id: foundProduct.id, name: foundProduct.name, price: foundProduct.price})
            .toStrictEqual(productModel.toJSON());
    });

    it('should find all', async () => {
        const productRepository = new ProductRepository();
        const product1 = new Product('1', 'Product 1', 100);
        const product2 = new Product('2', 'Product 2', 200);
        await productRepository.create(product1);
        await productRepository.create(product2);

        const foundProducts = await productRepository.findAll();
        const products = [product1, product2];
        expect(foundProducts).toEqual(products);
    });
});
