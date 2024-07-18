import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
    queueGroupName = 'orders-service-queue-group'
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data)
       // acknowledgement of message...
       // if not acknowledged, will continue to send message for processing.
        msg.ack()
    }
}