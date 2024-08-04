const NewTicket = () => {
  return (
    <div>
        <h1>Create a Ticket</h1>
        <form className="d-flex flex-column gap-3">
            <div className="form-group">
                <label>Title</label>
                <input className="form-control" />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input className="form-control" />
            </div>
            <button className="btn btn-primary align-self-start">Submit</button>
        </form>
    </div>
  )
}

export default NewTicket