import express, {Request, Response} from 'express';
import CreateCustomerUsecase from '../../../usecase/customer/create/create.customer.usecase';
import CustomerRepository from '../../customer/repository/sequelize/customer.repository';
import {InputCreateCustomerDto} from '../../../usecase/customer/create/create.customer.dto';

export const customerRoute = express.Router();
customerRoute.post('/', async (req: Request, res: Response) => {
    const usecase = new CreateCustomerUsecase(new CustomerRepository());
    try {
        const customerDto: InputCreateCustomerDto = {
            name: req.body.name,
            address: {
                city: req.body.address.city,
                street: req.body.address.street,
                number: req.body.address.number,
                zip: req.body.address.zip,
            }
        };
        const output = await usecase.exexute(customerDto);
        res.send(output);
    } catch (e) {
        res.status(500).send(e);
    }
});
