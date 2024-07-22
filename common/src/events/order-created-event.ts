import { Subjects  } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated,
    data: {
        userId: string,
        id: string,
        status: OrderStatus,
        expiresAt: string,
        version: number
        ticket: {
            id: string,
            price: number
        }
    }
}