import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../customer-created.event";
import EnviaConsoleLog2Handler from "./envia-console-log2.handler";

describe('Enviar console log 2 handler test', () => {
    it('should print console log when customer is created', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLog2Handler();
        eventDispatcher.register('CustomerCreatedEvent', eventHandler);
        const spyLog = jest.spyOn(console, 'log');

        const event = new CustomerCreatedEvent({id: '1', name: 'Customer 1'});

        eventDispatcher.notify(event);
        expect(spyLog).toBeCalledWith('Esse é o segundo console.log do evento: CustomerCreated');
    });
});