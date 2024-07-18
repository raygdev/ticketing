import nats, { Message, Stan } from 'node-nats-streaming'
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

abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void
    private client: Stan;
    protected ackWait = 5 * 1000

    constructor(cleint: Stan) {
        this.client = client
    }

    subscriptionOptions() {
        return this.client
          .subscriptionOptions()
          .setDeliverAllAvailable()
          .setManualAckMode(true)
          .setAckWait(this.ackWait)
          .setDurableName(this.queueGroupName)

    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )

        subscription.on('message', (msg: Message) => {
            console.log(
                `Message Received: ${this.subject} / ${this.queueGroupName}`
            )

            const parsedData = this.parseMessage(msg)
            this.onMessage(parsedData, msg)
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData()

        return typeof data === 'string'
          ? JSON.parse(data)
          : JSON.parse(data.toString('utf-8'))
    }
}