import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router"

export default function SignUp(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e: any) =>{
        e.preventDefault();
        axios.post('http://localhost:8090/sign-up', {email, password})
        .then((result) => console.log(result))
        navigate('/auth')
    } 

    return(
        <div className='min-h-[50vh] grid w-6/10 rounded-2xl p-1 md:p-2 bg-zinc-700'>
            <p>GoHere</p>
        <div>
            <p>Sign Up</p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">
                    Email address
                </label>
                <input type="email" name="emailAddress" id="email" className='form' onChange={(e) => setEmail(e.target.value)} />
                 <label htmlFor="password">
                    Password
                </label>
                <input type="password" name="password" id="password" className='form' onChange={(e)=> setPassword(e.target.value)}  />
                <button type="submit">Submit</button>
            </form>
            <div>
                <p>Another Way?</p>
                <p>Continue with Google</p>
                <p>Continue with X </p>
            </div>
            
        </div>
          <p>Already have an account? <Link to='/auth' className='underline font-bold'>Sign in</Link> </p>
        </div>
    )
}