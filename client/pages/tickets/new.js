import { useState } from "react"

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  return (
    <div>
        <h1>Create a Ticket</h1>
        <form className="d-flex flex-column gap-3">
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" />
            </div>
            <button className="btn btn-primary align-self-start">Submit</button>
        </form>
    </div>
  )
}

export default NewTicket