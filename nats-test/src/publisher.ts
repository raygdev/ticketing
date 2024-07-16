import nats from 'node-nats-streaming'

console.clear()

const client = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})

client.on('connect', () => {
    console.log('Publisher connected to nats')

    const data = JSON.stringify({
        title: 'Concert',
        price: 20,
        id: '123'
    })

    client.publish('ticket:created', data, () => {
        console.log('Event published')
    })
})