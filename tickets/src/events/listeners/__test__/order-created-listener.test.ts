import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { OrderCreatedEvent, OrderStatus } from "@raygdevtickets/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // create and save a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price: 10,
        userId: '12esds4'
    })

    await ticket.save()
    
    // create the fake data
    const data: OrderCreatedEvent['data'] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId: '12325dfgd',
      status: OrderStatus.Created,
      expiresAt: (new Date()).toLocaleDateString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }

    }
    //@ts-ignore
    const msg: Message = {
      ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('sets the orderId of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
  const { listener, data, ticket, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})