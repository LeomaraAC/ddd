import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order-item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe('Order repository test', () => {
    let sequileze: Sequelize;
    const createCustomer = async (id: string): Promise<Customer> => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer(id, `Customer ${id}`);
        customer.Address = new Address(`Street ${id}`, Number(id), `Zipcode ${id}`, `City ${id}`);
        await customerRepository.create(customer);
        return customer;
    };
    const createProduct = async (id: string): Promise<Product> => {
        const productRepository = new ProductRepository();
        const product = new Product(id, `Product ${id}`, Number(id) * 100);
        await productRepository.create(product);
        return product;
    };

    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true}
        });
        sequileze.addModels([CustomerModel, ProductModel, OrderModel, OrderItemModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it('should create a new order', async () => {
       const customer = await createCustomer('1');
       const product = await createProduct('1');

        const orderRepository = new OrderRepository();
        const orderItem = new OrderItem('1', product.name, product.price, product.id, 2);
        const order = new Order('1', customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({where: {id: order.id}, include: ['items']});

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customerId: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    productId: orderItem.productId,
                    orderId: order.id
                }
            ]
        });
    });

    it('should find all orders', async () => {
        const customer = await createCustomer('1');
        const product1 = await createProduct('1');
        const product2 = await createProduct('2');
        const product3 = await createProduct('3');

        const orderRepository = new OrderRepository();
        const orderItem1 = new OrderItem('1', product1.name, product1.price, product1.id, 2);
        const orderItem2 = new OrderItem('2', product2.name, product2.price, product2.id, 1);
        const orderItem3 = new OrderItem('3', product3.name, product3.price, product3.id, 1);

        const order1 = new Order('1', customer.id, [orderItem1, orderItem3]);
        const order2 = new Order('2', customer.id, [orderItem2]);
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const foundOrders = await orderRepository.findAll();

        expect(foundOrders).toEqual([order1, order2]);
    });

    it('should find one order by id', async () => {
        const customer = await createCustomer('1');
        const product = await createProduct('1');
        const orderRepository = new OrderRepository();
        const orderItem = new OrderItem('1', product.name, product.price, product.id, 1);
        const order = new Order('1', customer.id, [orderItem]);
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find(order.id);
        expect(foundOrder).toStrictEqual(order);
    });

    it('should throw an error when order is not found', async () => {
        const orderRepository = new OrderRepository();
        await expect(async () => {
            await orderRepository.find('1');
        }).rejects.toThrow('Order not found');
    });

});
