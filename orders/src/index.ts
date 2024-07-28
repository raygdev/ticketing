import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('No secret key defined')
    }
    if(!process.env.MONGO_URI) {
        throw new Error('No mongo URI defined')
    }

    if(!process.env.NATS_URL) {
        throw new Error('No NATS url defined')
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('No NATS cluster id defined')
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('No NATS client id defined')
    }
    console.log(process.env.NATS_URL)

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        )
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()
        
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
