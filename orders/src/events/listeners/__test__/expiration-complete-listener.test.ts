import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { OrderStatus, ExpirationCompleteEvent } from '@raygdevtickets/common'
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: '1iuniundf',
    expiresAt: new Date(),
    ticket
  })

  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { ticket, order, data, msg, listener }

}

it('updates the order status to canceled', async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data,msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})
it('emit an OrderCanceled event', async () => {
  const { listener, order, data, msg } = await setup()

  await listener.onMessage(data,msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(eventData.id).toEqual(order.id)
})
it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data,msg)

  expect(msg.ack).toHaveBeenCalled()
})