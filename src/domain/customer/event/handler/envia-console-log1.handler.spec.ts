import EventDispatcher from "../../../@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "./envia-console-log1.handler";
import CustomerCreatedEvent from "../customer-created.event";

describe('Enviar console log 1 handler test', () => {
    it('should print console log when customer is created', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog1Handler();
        eventDispatcher.register('CustomerCreatedEvent', eventHandler);
        const spyLog = jest.spyOn(console, 'log');

        const event = new CustomerCreatedEvent({id: '1', name: 'Customer 1'});

        eventDispatcher.notify(event);
        expect(spyLog).toBeCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');
    });
});