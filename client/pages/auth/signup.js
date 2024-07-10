import { useState } from "react";
import axios from 'axios'

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([])

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
        const response = await axios.post('/api/users/signup', {
            email,
            password
        })
        console.log(response.data)
    } catch(e) {
        setErrors(e.response.data.errors)
    }

  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {
      errors[0] &&
      <div className="alert alert-danger">
        <h4>Ooops...</h4>
        <ul>
            {errors.map(err => <li key={err.message}>{err.message}</li>)}
        </ul>
      </div>
      }
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
export default Signup;
