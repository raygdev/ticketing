import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'

it('marks an order as canceled', async () => {
  // Create a ticket with ticket model
  const ticket = await Ticket.build({
    title: 'Concert',
    price: 20
  })
  await ticket.save()

  const user = signin()
  // Make request to create order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
        ticketId: ticket.id
    })
    .expect(201)

  // Make a request to cancel order
  const { body: canceledOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // expectation to make sure it is canceled
  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled)
})

it.todo('emits an order canceled event')

