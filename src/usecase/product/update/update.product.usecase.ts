import ProductRepositoryInterface from '../../../domain/product/repository/product-repository.interface';
import {InputUpdateProductDto} from './update.product.dto';
import {OutputCreateProductDto} from '../create/create.product.dto';

export default class UpdateProductUsecase {
    private repository: ProductRepositoryInterface;

    constructor(repository: ProductRepositoryInterface) {
        this.repository = repository;
    }

    async execute(input: InputUpdateProductDto): Promise<OutputCreateProductDto> {
        const product = await this.repository.find(input.id);
        product.changeName(input.name);
        product.changePrice(input.price);
        await this.repository.update(product);
        return {
            id: product.id,
            name: product.name,
            price: product.price
        };
    }
}
