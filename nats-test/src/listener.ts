import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

client.on('connect', () => {
    console.log('Listener connected to nats')
    const options = client.subscriptionOptions()
    // option to manually acknowledge a successful message delivery
      .setManualAckMode(true)
    const subscription = client.subscribe(
        'ticket:created',
        'orders-service-queue-group',
        options
    )

    subscription.on('message', (msg: Message) => {
       const data = msg.getData()

       if(typeof data === 'string') {
        console.log(`Received event #${msg.getSequence()} with data: ${data}`)
       }
       // acknowledgement of message...
       // if not acknowledged, will continue to send message for processing.
       msg.ack()
    })
})