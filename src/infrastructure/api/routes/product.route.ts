import express, {Request, Response} from 'express';
import CreateProductUsecase from '../../../usecase/product/create/create.product.usecase';
import ProductRepository from '../../product/repository/sequelize/product.repository';
import ListProductUsecase from '../../../usecase/product/list/list.product.usecase';

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
    try {
        const usecase = new CreateProductUsecase(new ProductRepository());
        const result = await usecase.execute({name: req.body.name, price: req.body.price});
        res.status(201).send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

productRoute.get('/', async (req: Request, res: Response) => {
    try {
        const usecase = new ListProductUsecase(new ProductRepository());
        const result = await usecase.execute({});
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});
