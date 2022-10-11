import {app, sequelize} from '../express';
import request from 'supertest';

const PRODUCT_ROUTE = '/product';

describe('Product E2E test', () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a product', async () => {
        const response = await request(app)
            .post(PRODUCT_ROUTE)
            .send({name: 'Product 1', price: 150});

        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe('Product 1');
        expect(response.body.price).toBe(150);
    });

    it('should list all products', async () => {
        await request(app)
            .post(PRODUCT_ROUTE)
            .send({name: 'Product 1', price: 150});
        await request(app)
            .post(PRODUCT_ROUTE)
            .send({name: 'Product 2', price: 30});

        const response = await request(app).get(PRODUCT_ROUTE).send();
        expect(response.status).toBe(200);
        const products = response.body.products;
        expect(products.length).toBe(2);
        expect(products[0].name).toBe('Product 1');
        expect(products[0].price).toBe(150);
        expect(products[1].name).toBe('Product 2');
        expect(products[1].price).toBe(30);
    });
});
