import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    userId: '123'
  })

  // save the ticket to the db
  await ticket.save()

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  //make two separate changes to the tickets we fetch
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 10 })

  // save the first fetched ticket and expect success
  await expect(firstInstance!.save()).rejects.not.toThrow()

  // save the second fetched ticket and expect an error
  await expect(secondInstance!.save()).rejects.toThrow()
  
})