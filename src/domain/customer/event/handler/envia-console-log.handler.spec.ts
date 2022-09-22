import EventDispatcher from '../../../@shared/event/event-dispatcher';
import EnviaConsoleLogHandler from './envia-console-log.handler';
import AddressChangedEvent from '../address-changed.event';

describe('Enviar console log handler test', () => {
    it('should print console log when address is changed', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviaConsoleLogHandler();
        eventDispatcher.register('AddressChangedEvent', eventHandler);
        const spyLog = jest.spyOn(console, 'log');

        const dataEvent = {
            id: '1',
            name: 'Customer 1',
            address: 'Street 1, Number 1, Zip 1 City 1'
        };

        const event = new AddressChangedEvent(dataEvent);

        eventDispatcher.notify(event);
        expect(spyLog).toBeCalledWith(`Endereço do cliente: ${dataEvent.id}, ${dataEvent.name} alterado para: ${dataEvent.address}`);
    });
});