import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

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

})