import ValidatorInterface from '../../@shared/validator/validator.interface';
import Order from '../entity/order';
import * as yup from 'yup';

export default class OrderYupValidator implements ValidatorInterface<Order>{
    validate(entity: Order): void {
        try {
            yup.object().shape({
                id: yup.string().required('Id is required'),
                customerId: yup.string().required('CustomerId is required'),
                itemsLength: yup.array().min(1, 'Items are required'),
                itemsQuantity: yup.array().compact(item => item.quantity > 0).max(0, 'Quantity must be greater than 0'),
            }).validateSync({
                id: entity.id,
                customerId: entity.customerId,
                itemsLength: entity.items,
                itemsQuantity: entity.items,
            }, {abortEarly: false});
        } catch (errors) {
            const e = errors as yup.ValidationError;
            e.errors.forEach(error => entity.notification.addError({context: 'order', message: error}));
        }
    }
}
