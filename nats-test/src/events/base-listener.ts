import { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void
    private client: Stan;
    protected ackWait = 5 * 1000

    constructor(client: Stan) {
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