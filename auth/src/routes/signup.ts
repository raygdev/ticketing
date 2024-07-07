import express, {Response, Request} from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

router.post("/api/users/signup", (req, res) => {
  res.send("Hi there")
})

export { router as signupRouter }