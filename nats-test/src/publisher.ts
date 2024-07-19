import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher'

console.clear()

const client = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

client.on('connect', () => {
    console.log('Publisher connected to nats')
    const publisher = new TicketCreatedPublisher(client)
    publisher.publish({
        id: '123',
        title: 'Concert',
        price: 20
    })
})