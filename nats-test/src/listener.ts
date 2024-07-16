import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

client.on('connect', () => {
    console.log('Listener connected to nats')

    const subscription = client.subscribe('ticket:created',)

    subscription.on('message', (msg: Message) => {
       const data = msg.getData()

       if(typeof data === 'string') {
        console.log(`Received event #${msg.getSequence()} with data: ${data}`)
       }
    })
})