import { OrderCreatedListener } from "./events/listeners/order-created-listener"
import { natsWrapper } from "./nats-wrapper"

const start = async () => {
    if(!process.env.NATS_URL) {
        throw new Error('No NATS url defined')
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('No NATS cluster id defined')
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('No NATS client id defined')
    }
    console.log(process.env.NATS_URL)

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        )
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen()
        
    } catch(e) {
        console.error(e)
    }
}
start()
