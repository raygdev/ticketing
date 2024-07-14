import mongoose from 'mongoose'

import { app } from './app'

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('No secret key defined')
    }

    try {
        await mongoose.connect("mongodb://tickets-mongo-srv:27017/auth")
        console.log("Connected to mongodb")
    } catch(e) {
        console.error(e)
    }

    app.listen(3000, () => {
        console.log('listening on port 3000!')
    })
}
start()
