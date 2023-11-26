import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Signup() {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", location: "" });

    const submitHandeler = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/createuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
        })
        const json = await response.json();
        console.log(json);
        if (!json.success) {
            alert("Enter Valid Credentials");
        }


    }

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value })
    }
    return (
        <> 
        <div className='container mt-5'>
            <form onSubmit={submitHandeler}>
                <div className="mb-3 form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" placeholder="Enter Name" name="name" value={credentials.name} onChange={onChange} />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" name="email" value={credentials.email} onChange={onChange} />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="password1">Password</label>
                    <input type="password" className="form-control" placeholder="Password" name="password" value={credentials.password} onChange={onChange} />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" className="form-control" placeholder="Enter Location" name="location" value={credentials.location} onChange={onChange} />
                </div>
                <button type="submit" className="m-3 btn btn-success">Submit</button>
                <Link className="m-3 btn btn-danger" to='/login'>Already an User</Link>
            </form>
        </div>
        </>
    )
}
