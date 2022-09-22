import CustomerRepositoryInterface from '../../../domain/customer/repository/customer-repository.interface';
import {InputFindCustomerDto, OutputFindCustomerDto} from './find.customer.dto';

export default class FindCustomerUsecase {
    private customerRepository: CustomerRepositoryInterface;

    constructor(customerReporsitory: CustomerRepositoryInterface) {
        this.customerRepository = customerReporsitory;
    }

    async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
        const customer = await this.customerRepository.find(input.id);
        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.Address.street,
                number: customer.Address.number,
                city: customer.Address.city,
                zip: customer.Address.zip,
            }
        };
    }
}
