import OrderItem from './order-item';
import Entity from '../../@shared/entity/entity.abstract';
import OrderValidatorFactory from '../factory/order.validator.factory';
import NotificationError from '../../@shared/notification/notification.error';

export default class Order extends Entity{
    private _customerId: string;
    private _items: OrderItem[];
    private _total: number;

    constructor(id: string, customerId: string, items: OrderItem[]) {
        super();
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    validate(): boolean {
        OrderValidatorFactory.create().validate(this);
        if (this.notification.hasError()){
            throw new NotificationError(this.notification.getErrors());
        }
        return true;
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.price, 0);
    }

    addItem(item: OrderItem) {
        this._items.push(item);
    }
}
