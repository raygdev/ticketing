import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCanceledListener } from "../order-canceled-listener";
import { OrderCanceledEvent } from "@raygdevtickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client)

  const orderId = new mongoose.Types.ObjectId().toHexString()

  const ticket = Ticket.build( {
    userId: '1244325',
    title: 'Concert',
    price: 20
  })

  ticket.set({ orderId })

  await ticket.save()

  const data: OrderCanceledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
        id: ticket.id
    }
  }

  // @ts-ignore
  const msg: Message = {
       ack: jest.fn() 
  }

  return { listener, msg, data, ticket, orderId }
}

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { msg, data, ticket, orderId, listener } = await setup()

  await listener.onMessage(data,msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  
  expect(updatedTicket!.orderId).not.toBeDefined()
  
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  
  expect(msg.ack).toHaveBeenCalled()

})

