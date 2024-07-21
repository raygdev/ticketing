import mongoose from 'mongoose'
import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@raygdevtickets/common'
import { body } from 'express-validator'

const router = express.Router()

router.post('/api/orders', requireAuth, [
    body('ticketId')
      .not()
      .isEmpty()
      // not really a good option because of coupling a specific db
      // implementation. This would fail if using a different db or
      // switching dbs.
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id must be provided')

],
  async (req: Request, res: Response) => {
    res.send({})
})

export { router as createOrderRouter}