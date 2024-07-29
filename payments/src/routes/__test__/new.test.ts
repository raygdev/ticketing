import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

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

})
it('returns a 400 when purchasing a canceled order', async () => {

})