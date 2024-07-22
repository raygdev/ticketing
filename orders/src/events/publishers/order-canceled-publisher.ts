import { Publisher, OrderCanceledEvent, Subjects } from "@raygdevtickets/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
    readonly subject = Subjects.OrderCanceled;
}