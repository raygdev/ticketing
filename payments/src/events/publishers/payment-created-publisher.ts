import { Subjects, Publisher, PaymentCreatedEvent } from "@raygdevtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}