import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
    id: string
    email: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

type CurrentUserFunc = (req: Request, res: Response, next: NextFunction) => void

export const currentUser: CurrentUserFunc  = (req, res, next) => {
    if(!req.session?.jwt) {
        return next()
    }

    try{
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
        req.currentUser = payload
    } catch(e) {}
    next()
}