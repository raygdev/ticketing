import { Publisher, Subjects, TicketUpdatedEvent } from "@raygdevtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}