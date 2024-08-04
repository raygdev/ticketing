import { useState } from "react";
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/')
  })

  function onBlur() {
    const value = parseFloat(price)

    if(isNaN(value)) {
        return;
    }

    setPrice(value.toFixed(2))
  }

  function onSubmit(e) {
    e.preventDefault()
    doRequest()
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary align-self-start">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
