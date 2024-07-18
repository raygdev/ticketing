import nats, { Message, Stan } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

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
          // option to manually acknowledge a successful message delivery
          .setManualAckMode(true)
          // set default ack wait time
          .setAckWait(this.ackWait)
          // create a durable name for listener
          .setDurableName(this.queueGroupName)

    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            // create a queue group name
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

class TicketCreatedListener extends Listener {
    subject = 'ticket:created'
    queueGroupName = 'orders-service-queue-group'
    onMessage(data: any, msg: Message): void {
        console.log('Event data!', data)
       // acknowledgement of message...
       // if not acknowledged, will continue to send message for processing.
        msg.ack()
    }
}