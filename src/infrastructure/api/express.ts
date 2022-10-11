import express, {Express} from 'express';
import {Sequelize} from 'sequelize-typescript';
import CustomerModel from '../product/repository/sequelize/model/customer.model';
import {customerRoute} from './routes/customer.route';
import ProductModel from '../customer/repository/sequelize/model/product.model';
import {productRoute} from './routes/product.route';

export const app: Express = express();
app.use(express.json());
app.use('/customer', customerRoute);
app.use('/product', productRoute);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    });
    await sequelize.addModels([CustomerModel, ProductModel]);
    await sequelize.sync();
}

setupDb();
