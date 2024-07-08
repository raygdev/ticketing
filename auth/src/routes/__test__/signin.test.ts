import request from 'supertest'
import { app } from '../../app'

const userCreds = {
    email: 'test@test.com',
    password: 'password'
}

it('fails when an email that does not exist is supplied', async () => {
    await request(app)
      .post('/api/users/signin')
      .send(userCreds)
      .expect(400)
})

it('fails when an incorrect password is supplied', async () => {
    await request(app)
      .post('/api/users/signup')
      .send(userCreds)
      .expect(201)

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'passs'
      })
      .expect(400)
})

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/users/signup')
      .send(userCreds)
      .expect(201)

    const response = await request(app)
      .post('/api/users/signin')
      .send(userCreds)
      .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})