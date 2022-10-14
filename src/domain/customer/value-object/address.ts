import Entity from '../../@shared/entity/entity.abstract';
import AddressValidatorFactory from '../factory/address.validator.factory';
import NotificationError from '../../@shared/notification/notification.error';

export default class Address extends Entity{
    _street: string = '';
    _number: number = 0;
    _zip: string = '';
    _city: string = '';

    constructor(street: string, number: number, zip: string, city: string) {
        super();
        this._street = street;
        this._number = number;
        this._zip = zip;
        this._city = city;

        this.validate();
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get zip(): string {
        return this._zip;
    }

    get city(): string {
        return this._city;
    }

    validate() {
        AddressValidatorFactory.create().validate(this);

        if (this.notification.hasError()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    toString() {
        return `${this._street}, ${this._number}, ${this._zip} ${this._city}`;
    }
}
