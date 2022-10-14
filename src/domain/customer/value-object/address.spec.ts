import Address from './address';

describe('Address unit test', () => {
    it('should throw an error when city is empty', () => {
        expect(() => new Address('Street 1', 1, '123', ''))
            .toThrowError('customer.address: City is required');
    });

    it('should throw an error when street is empty', () => {
        expect(() => new Address('', 1, '123', 'City'))
            .toThrowError('customer.address: Street is required');
    });

    it('should throw an error when zip is empty', () => {
        expect(() => new Address('Street 1', 1, '', 'City'))
            .toThrowError('customer.address: Zip is required');
    });

    it('should throw an error when number is equal 0', () => {
        expect(() => new Address('Street 1', 0, '123', 'City'))
            .toThrowError('customer.address: Number is required');
    });

    it('should throw an error when number is less than 0', () => {
        expect(() => new Address('Street 1', -1, '123', 'City'))
            .toThrowError('customer.address: Number is required');
    });

    it('should throw an error when city and zip are empty', () => {
        expect(() => new Address('Street 1', 1, '', ''))
            .toThrowError('customer.address: Zip is required,customer.address: City is required');
    });
});
