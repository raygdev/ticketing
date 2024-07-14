import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@raygdevtickets/common";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [body("title").not().isEmpty().withMessage("title is required")],
  validateRequest,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as createTicketRouter };
