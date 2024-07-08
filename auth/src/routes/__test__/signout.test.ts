import request from 'supertest'
import { app } from '../../app'

const userCreds = {
    email: 'test@test.com',
    password: 'password'
}

it('clears the cookie after signing out', async () => {
    await request(app)
      .post('/api/users/signup')
      .send(userCreds)
      .expect(201)
    
    const response = await request(app)
      .post('/api/users/signout')
      .send({})
      .expect(200)
    
    expect(response.get('Set-Cookie')).toBeDefined()
    
})