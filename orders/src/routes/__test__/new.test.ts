import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"

it('returns an error if ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId })
    .expect(404)
})
it('returns an error if ticket is already reserved', async () => {

})
it('reserves a ticket', async () => {

})