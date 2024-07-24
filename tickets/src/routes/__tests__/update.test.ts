import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/ticket'

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId()
    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', signin())
      .send({
        title: 'title',
        price: 20
      })
      .expect(404)
})
it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId()
    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: 'title',
        price: 20
      })
      .expect(401)
})
it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({
        title: 'title',
        price: 20
      })

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', signin())
      .send({
        title: 'Title 1',
        price: 10
      })
      .expect(401)
})
it('returns a 400 if the user provides an invalid title and price', async () => {
    const cookie = signin()
    const response = await request(app)
      .put(`/api/tickets/`)
      .set('Cookie', cookie)
      .send({
        title: 'Title 1',
        price: 10
      })

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 20
      })
      .expect(400)

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title: 'Title',
        price: -10
      })
      .expect(400)
})
it('it updates the provided valid inputs', async () => {
    const cookie = signin()
    const title = 'Some title'
    const price = 20

    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({
        title: 'Title 1',
        price: 10
      })

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title,
        price
      })
      .expect(200)

    const updateResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200)
    
    expect(updateResponse.body.title).toEqual(title)
    expect(updateResponse.body.price).toEqual(price)
})

it('publishes an event', async () => {
  const cookie = signin()
    const title = 'Some title'
    const price = 20

    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({
        title: 'Title 1',
        price: 10
      })

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title,
        price
      })
      .expect(200)

      expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2)
})

it('rejects updates if the ticket is reserved', async () => {
  const cookie = signin()
    const title = 'Some title'
    const price = 20

    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({
        title: 'Title 1',
        price: 10
      })

    const ticket = await Ticket.findById(response.body.id)

    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    await ticket!.save()

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
        title,
        price
      })
      .expect(400)
})