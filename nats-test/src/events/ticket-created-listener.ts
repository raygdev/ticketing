import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
    subject = 'ticket:created'
    queueGroupName = 'orders-service-queue-group'
    onMessage(data: any, msg: Message): void {
        console.log('Event data!', data)
       // acknowledgement of message...
       // if not acknowledged, will continue to send message for processing.
        msg.ack()
    }
}