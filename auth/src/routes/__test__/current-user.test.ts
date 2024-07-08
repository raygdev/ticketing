import request from 'supertest'
import { app } from '../../app'

const userCreds = {
    email: 'test@test.com',
    password: 'password'
}

it('responsed with details about the current user', async () => {
    const authResponse = await request(app)
      .post('/api/users/signup')
      .send(userCreds)
      .expect(201)

    const cookie = authResponse.get('Set-Cookie')

    const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie!)
      .send()
      .expect(200)

    expect(response.body.currentUser.email).toEqual('test@test.com')
})