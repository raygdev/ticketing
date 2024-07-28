import { OrderCanceledEvent, OrderStatus } from "@raygdevtickets/common";
import { OrderCanceledListener } from "../order-canceled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

const setup = async () => {
    const listener = new OrderCanceledListener(natsWrapper.client)
    const id = new mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id,
        userId: '1oijsdoij',
        status: OrderStatus.Created,
        version: 0,
        price: 20
    })

    await order.save()

    const data: OrderCanceledEvent['data'] = {
        id,
        version: 1,
        ticket: {
          id: 'jygjkygk'
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { order, listener, msg, data }
}

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data,msg)

  const updateOrder = await Order.findById(order.id)

  expect(updateOrder!.status).toEqual(OrderStatus.Canceled)
})
it('acks the message', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data,msg)

  expect(msg.ack).toHaveBeenCalled()
})
