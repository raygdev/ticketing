import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@raygdevtickets/common'
import { stripe } from '../../stripe'

jest.mock('../../stripe')

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
        token: 'alsdfjal',
        orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})
it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
        token: 'asdfasdf',
        orderId: order.id
    })
    .expect(401)
})
it('returns a 400 when purchasing a canceled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Canceled
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
        token: 'asdfasdf',
        orderId: order.id
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: userId,
      version: 0,
      price: 20,
      status: OrderStatus.Created
    })
    await order.save()

    await request(app)
      .post('/api/payments')
      .set('Cookie', signin(userId))
      .send({
        token: 'tok_visa',
        orderId: order.id
      })
      .expect(201)
    
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(order.price * 100)
    expect(chargeOptions.currency).toEqual('usd')
})