import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus
} from "@raygdevtickets/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token")
      .not()
      .isEmpty()
      .withMessage("Token is required"),
    body("orderId")
      .not()
      .isEmpty()
      .withMessage("Order id is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if(!order) {
        throw new NotFoundError()
    }

    if(order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if(order.status === OrderStatus.Canceled) {
      throw new BadRequestError('Cannot pay for a canceled order')
    }

    res.send({ succes: true })
  }
);

export { router as createChargeRouter };