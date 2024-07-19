import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('No secret key defined')
    }
    if(!process.env.MONGO_URI) {
        throw new Error('No mongo URI defined')
    }

    try {
        await natsWrapper.connect('ticketing', 'laskedf', 'http://nats-srv:4222')
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to mongodb")
    } catch(e) {
        console.error(e)
    }

    app.listen(3000, () => {
        console.log('listening on port 3000!')
    })
}
start()
