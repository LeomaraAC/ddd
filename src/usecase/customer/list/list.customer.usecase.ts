import CustomerRepositoryInterface from '../../../domain/customer/repository/customer-repository.interface';
import {InputListCustomerDto, OutputListCustomerDto} from './list.customer.dto';
import Customer from '../../../domain/customer/entity/customer';

export default class ListCustomerUsecase {
    private customerRepository: CustomerRepositoryInterface;


    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository;
    }

    async execute(input: InputListCustomerDto): Promise<OutputListCustomerDto> {
        const customers = await this.customerRepository.findAll();
        return OutputMapper.toOutput(customers);
    }
}

class OutputMapper {
    static toOutput(customers: Customer[]): OutputListCustomerDto {
        return {
            customers: customers.map(customer => ({
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.Address.street,
                    number: customer.Address.number,
                    city: customer.Address.city,
                    zip: customer.Address.zip,
                }
            }))
        };
    }
}
