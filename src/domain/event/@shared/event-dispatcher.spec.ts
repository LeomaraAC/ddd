import EventDispatcher from "./event-dispatcher";
import SendEmailWhenProductIsCreatedHandler from "../product/hander/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";

describe('Domain events test', () => {
    it('should register an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register('ProductCreatedEvent', eventHandler);
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined();
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(1);
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler);
    });

    it('should unregister an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register('ProductCreatedEvent', eventHandler);
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler);
        eventDispatcher.unregister('ProductCreatedEvent', eventHandler);
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeDefined();
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent.length).toBe(0);
    });

    it('should unregister all events', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register('ProductCreatedEvent', eventHandler);
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler);
        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers).toStrictEqual({});
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent).toBeUndefined();
    });

    it('should notify all event handlers', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register('ProductCreatedEvent', eventHandler);
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');
        expect(eventDispatcher.getEventHandlers.ProductCreatedEvent[0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: 'Product 1',
            description: 'Product 1 desctiption',
            price: 10.00
        });

        eventDispatcher.notify(productCreatedEvent);
        expect(spyEventHandler).toBeCalled();
    });
});