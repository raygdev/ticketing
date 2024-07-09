import { useState } from "react"

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
    <form>
        <h1>Sign up</h1>
        <div className="form-group">
            <label>Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" />
        </div>
        <button className="btn btn-primary">Sign Up</button>
    </form>
    )
}
export default Signup