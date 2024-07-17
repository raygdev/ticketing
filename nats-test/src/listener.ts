import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
})

client.on('connect', () => {
    console.log('Listener connected to nats')
    const options = client
      .subscriptionOptions()
    // option to manually acknowledge a successful message delivery
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      // create a durable name for listener
      .setDurableName('order-service')
    const subscription = client.subscribe(
        'ticket:created',
        // create a queue group
        'orders-service-queue-group',
        options
    )

    subscription.on('message', (msg: Message) => {
       const data = msg.getData()

       // listen for a close event and exit the process
       client.on('close', () => {
            console.log('NATS connection closed')
            process.exit()
       })

       if(typeof data === 'string') {
        console.log(`Received event #${msg.getSequence()} with data: ${data}`)
       }
       // acknowledgement of message...
       // if not acknowledged, will continue to send message for processing.
       msg.ack()
    })
})

// listen for SIGINT or SIGTERM and close the client
process.on('SIGINT', () => client.close())
process.on('SIGTERM', () => client.close())