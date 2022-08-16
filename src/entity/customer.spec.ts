import Customer from "./customer";
import Address from "./address";

describe('Customer unit test', () => {
    it('should throw error when id is empty', () => {
        expect(() => {
            const customer = new Customer('', 'Customer 1');
        }).toThrowError('Id is required')
    })

    it('should throw error when name is empty', () => {
        expect(() => {
            const customer = new Customer('123', '');
        }).toThrowError('Name is required')
    })

    it('should change name', () => {
        const customer = new Customer('123', 'John');
        customer.changeName('Anna')
        expect(customer.name).toBe('Anna')
    })

    it('should activate customer', () => {
        const customer = new Customer('1', 'Customer 1');
        const address = new Address('Rua 123', 123, '123521-000', 'SP')
        customer.changeAddress(address)
        customer.activate()
        expect(customer.isActive()).toBe(true)
    })

    it('should deactivate customer', () => {
        const customer = new Customer('1', 'Customer 1');
        customer.deactivate()
        expect(customer.isActive()).toBe(false)
    })

    it('should throw error if address is undefined when activate a customer', () => {
        const customer = new Customer('1', 'Customer 1');
        expect(() => customer.activate()).toThrowError('Address is mandatory to activate a customer')
    })
})