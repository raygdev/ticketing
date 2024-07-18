import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'

import { TicketCreatedListener } from './events/ticket-created-listener'

console.clear()

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

client.on('connect', () => {
    console.log('Listener connected to nats')

    // listen for a close event and exit the process
    client.on('close', () => {
        console.log('NATS connection closed')
        process.exit()
    })
    new TicketCreatedListener(client).listen()
})

// listen for SIGINT or SIGTERM and close the client
process.on('SIGINT', () => client.close())
process.on('SIGTERM', () => client.close())

