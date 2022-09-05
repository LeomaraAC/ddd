import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerModel from "../../../product/repository/sequelize/model/customer.model";
import Address from "../../../../domain/customer/value-object/address";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.Address.street,
            number: entity.Address.number,
            zipcode: entity.Address.zip,
            city: entity.Address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        });
    }

    async find(id: string): Promise<Customer> {
        let customerModel;
        try {
            customerModel = await CustomerModel.findOne({where: {id}, rejectOnEmpty: true});
        } catch (error) {
            throw new Error('Customer not found');
        }
        return this.getCustomer(customerModel);
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        return customerModels.map(customerModel => this.getCustomer(customerModel));
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.name,
            street: entity.Address.street,
            number: entity.Address.number,
            zipcode: entity.Address.zip,
            city: entity.Address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        }, {where: {id: entity.id}});
    }

    private getCustomer(model: CustomerModel): Customer {
        const customer = new Customer(model.id, model.name);
        const address = new Address(model.street, model.number, model.zipcode, model.city);
        customer.changeAddress(address);
        customer.addRewardPoints(model.rewardPoints);
        if(model.active)
            customer.activate();
        return customer;
    }
}