import { Subjects, Publisher, ExpirationCompleteEvent } from "@raygdevtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}