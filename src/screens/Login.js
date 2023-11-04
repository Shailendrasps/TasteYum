import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const submitHandeler = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/loginuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    const json = await response.json();
    console.log(json);
    
    if (!json.success) {
      alert('Enter valid credentials')
    } else {
      localStorage.setItem("authToken",json.authToken);
      console.log(localStorage.getItem("authToken"));
      navigate('/');
    }
  }
  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  }

  return (
    <div>
      <div className='container'>
        <form onSubmit={submitHandeler}>
          <div className="mb-3 form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" placeholder="Enter email" name="email" value={credentials.email} onChange={onChange} />
          </div>
          <div className="mb-3 form-group">
            <label htmlFor="password1">Password</label>
            <input type="password" className="form-control" placeholder="Password" name="password" value={credentials.password} onChange={onChange} />
          </div>
          <button type="submit" className="m-3 btn btn-success">Submit</button>
          <Link className="m-3 btn btn-danger" to='/createuser'>Create Account</Link>
        </form>
      </div>
    </div>
  )
}
