import {app, sequelize} from '../express';
import request from 'supertest';

describe('Customer E2E test', () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should create a customer', async () => {
        const response = await request(app)
            .post('/customer')
            .send({
                name: 'John',
                address: {
                    street: 'Street 1',
                    city: 'City 1',
                    number: 1,
                    zip: 'Zip 1'
                }
            });
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('John');
        expect(response.body.address.city).toBe('City 1');
        expect(response.body.address.street).toBe('Street 1');
        expect(response.body.address.number).toBe(1);
        expect(response.body.address.zip).toBe('Zip 1');
    });

    it('should not create a customer', async () => {
        const response = await request(app).post('/customer').send({name: 'John', address: {city: 'City 1'}});
        expect(response.status).toBe(500);
    });

    it('should list all customers', async () => {
        await request(app)
            .post('/customer')
            .send({
                name: 'John',
                address: {
                    street: 'Street 1',
                    city: 'City 1',
                    number: 1,
                    zip: 'Zip 1'
                }
            });
        await request(app)
            .post('/customer')
            .send({
                name: 'Jane',
                address: {
                    street: 'Street 2',
                    city: 'City 2',
                    number: 2,
                    zip: 'Zip 2'
                }
            });

        const listResponse = await request(app).get('/customer').send();
        expect(listResponse.status).toBe(200);
        const customers = listResponse.body.customers;
        expect(customers.length).toBe(2);
        expect(customers[0].name).toBe('John');
        expect(customers[0].address.street).toBe('Street 1');
        expect(customers[1].name).toBe('Jane');
        expect(customers[1].address.street).toBe('Street 2');
    });
});
