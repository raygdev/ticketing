import { TicketUpdatedListener } from "../ticket-updated-listener"
import { TicketUpdatedEvent } from "@raygdevtickets/common"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new Concert',
    price: 999,
    userId: '123123'
  }
  
  // create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticket', async () => {
  const { msg, data, listener, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks a message', async () => {

})