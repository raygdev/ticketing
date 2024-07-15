import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId()
    
    await request(app)
      .get(`/api/tickets/${id}`)
      .send()
      .expect(404)
})

it('returns the ticket if the ticket is found', async () => {
    const title = 'Concert'
    const price = 20

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({
        title,
        price
      })
      .expect(201)

    const res = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200)
    
    expect(res.body.title).toEqual(title)
    expect(res.body.price).toEqual(price.toString())
})