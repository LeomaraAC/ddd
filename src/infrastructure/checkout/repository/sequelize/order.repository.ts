import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface';
import Order from '../../../../domain/checkout/entity/order';
import OrderModel from './model/order.model';
import OrderItemModel from './model/order-item.model';
import OrderItem from '../../../../domain/checkout/entity/order-item';

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customerId: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                productId: item.productId,
                quantity: item.quantity
            }))
        }, {include: [{model: OrderItemModel}]});
    }

    async find(id: string): Promise<Order> {
        let orderModel: OrderModel;
        try {
            orderModel = await OrderModel.findOne({where: {id}, include: OrderItemModel, rejectOnEmpty: true});
        } catch (e) {
            throw new Error('Order not found');
        }

        return this.getOrderFromModel(orderModel);
    }

    async findAll(): Promise<Order[]> {
        const ordersModel = await OrderModel.findAll({include: OrderItemModel});
        return ordersModel.map(orderModel => this.getOrderFromModel(orderModel));
    }

    async update(entity: Order): Promise<void> {
        await this.deleteOldItem(entity.id);
        await OrderModel.update({total: entity.total()}, {where: {id: entity.id}});
        await OrderItemModel.bulkCreate(entity.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            productId: item.productId,
            quantity: item.quantity,
            orderId: entity.id
        })));
    }

    private getOrderFromModel(model: OrderModel) {
        const items = model.items.map(itemModel =>
            new OrderItem(itemModel.id, itemModel.name, (itemModel.price / itemModel.quantity),
                itemModel.productId, itemModel.quantity));
        return new Order(model.id, model.customerId, items);
    }

    private async deleteOldItem(orderId: string) {
        await OrderItemModel.destroy({where: {orderId}});
    }
}