import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {

  const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""})
  let history = useHistory();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name, email, password} = credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify({name, email, password})
    });
    const json = await response.json()
    console.log(json)
    if(json.success){
        // save the auth token and redirect
        localStorage.setItem('token', json.authtoken)
        history.push("/")
        props.showAlert("Account Create Successfully", "success")
    }
    else{
        props.showAlert("Invalid Credentials", "danger")
    }
}

const onChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value})
}



  return (
    <div className='container'>
      <h2>Create a new Account</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group my-3">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name='name' onChange={onChange}  aria-describedby="emailHelp" placeholder="Enter Name" />
          
        </div>

        <div className="form-group my-3">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" name='email' onChange={onChange}  aria-describedby="emailHelp" placeholder="Enter email" />
        
        </div>
        <div className="form-group my-3">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={onChange} placeholder="Password" minLength={5} required/>
        </div>
        <div className="form-group my-3">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' onClick={onChange} placeholder="Confirm Password" minLength={5} required/>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
