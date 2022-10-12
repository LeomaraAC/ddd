import Notification from './notification';

describe('Notification unit test', () => {
    it('should create errors', () => {
        const notification = new Notification();
        notification.addError({message: 'error 1 message', context: 'customer'});
        expect(notification.messages('customer')).toBe('customer: error 1 message');
        notification.addError({message: 'error 2 message', context: 'customer'});
        expect(notification.messages('customer')).toBe('customer: error 1 message,customer: error 2 message');
        notification.addError({message: 'error 3 message', context: 'order'});
        expect(notification.messages('customer')).toBe('customer: error 1 message,customer: error 2 message');
        expect(notification.messages()).toBe('customer: error 1 message,customer: error 2 message,order: error 3 message');
    });

    it('should check if notification has at least one error', () => {
        const notification = new Notification();
        notification.addError({message: 'error 1 message', context: 'customer'});
        expect(notification.hasError()).toBe(true);
    });

    it('should get all errors props', () => {
        const notification = new Notification();
        const error = {message: 'error 1 message', context: 'customer'};
        notification.addError(error);
        expect(notification.getErrors()).toEqual([error]);
    });
});
