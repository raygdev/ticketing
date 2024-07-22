import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@raygdevtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // not really a good option because of coupling a specific db
      // implementation. This would fail if using a different db or
      // switching dbs.
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId)
    if(!ticket) {
      throw new NotFoundError()
    }

    // Make sure the ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket found *and* the order status is *not* canceled.
    // If we find an order from that means the ticket *is* reserved
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete
        ]
      }
    })

    if(existingOrder) {
      throw new BadRequestError("Ticket is already reserved.")
    }

    // Caculate expiration date for this order

    // Build the order and save it to the database

    // Publish an event saying an order was created
    res.send({});
  }
);

export { router as createOrderRouter };