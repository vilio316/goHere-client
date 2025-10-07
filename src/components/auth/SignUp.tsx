
import { useState } from "react";
import { Link, useNavigate } from "react-router"
import { FaGoogle, FaXTwitter } from "react-icons/fa6"; 
import axios from "axios";

export default function SignUp(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, updateUsername] = useState('')
    const [doublePassword, confirmPassword] = useState('')
    const navigate = useNavigate()
    const locations = {}
    const passBool = doublePassword === password && password.length > 0 && doublePassword.length > 0

    const handleSubmit = async(e:any) => {
        e.preventDefault();
        if(doublePassword === password){
            try {
                const {data} = await axios.post('http://localhost:8090/auth/sign-up', {email, password, username, locations}, {withCredentials: true})
                const {success} = data
                const result = await axios.post('http://localhost:8090/auth/add_profile_details', {email, username, locations})
                const successful = result.data.success
                if(success && successful){
                    window.alert("Sign up Successful!")
                   navigate('/auth/sign-in')
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    return(
        <div className='min-h-[50vh] grid md:w-5/10 rounded-2xl p-2 md:p-4 border-2 border-black'>
            <div className="grid">
            <Link to='/' className="text-2xl font-bold text-center">GoHere </Link>
             <p className="text-center">Your Number One Tourism Companion</p>

            <p className="text-center my-1 md:my-2 font-bold text-2xl">Sign Up</p>

            <form onSubmit={handleSubmit}>
                <legend className="text-xl font-bold">
                    Sign-Up Information
                </legend>

                <fieldset>
                <label htmlFor="email">
                    Email address
                </label>
                <input type="email" name="emailAddress" id="email" className='form' onChange={(e) => setEmail(e.target.value)} required />
                 
                <label htmlFor="username">
                    Username
                </label>
                <input type="text" name="username" id="username" className="form" required onChange={(e)=> updateUsername(e.target.value)} />

                 <label htmlFor="password">
                    Password
                </label>
                <input type="password" name="password" id="password" required className='form invalid:border-red-600' minLength={8} onChange={(e)=> setPassword(e.target.value)}  />
                
                 <label htmlFor="confPassword">
                   Confirm Password
                </label>
                <input type="password" name="confirm_password" id="confPassword" className={`border-2 ${passBool ? 'border-blue-700' : 'border-red-400'} outline-none block rounded-xl p-1 indent-4 w-[90%]`} required minLength={8} onChange={(e) => confirmPassword(e.target.value)} />
                </fieldset>

                <button type="submit" className='bg-blue-400 p-2 rounded-2xl md:my-2 my-1 text-center min-w-[45%] hover:underline hover:md-text-[20px] hover:font-bold disabled:opacity-50 disabled:bg-red-400' 
                disabled={
                    !passBool || password.length < 8
                }
                >
                Submit
            </button>

            </form>
            <div>
                <p className="text-center">OR</p>
                  <div className='grid md:grid-cols-2 gap-2 my-2 md:my-1'>
                               <p className='md:p-2 p-1 md:rounded-2xl rounded-3xl bg-gradient-to-br from-white to-blue-400 text-center hover:to-blue-600 transition-colors'>Continue with 
                                   <span className='md:p-2 p-1'>
                                       <FaGoogle fill='red' size={24} className='inline' />
                                   </span>
                               </p>
                               <p className='md:p-2 p-1 md:rounded-2xl rounded-3xl bg-gradient-to-br from-white to-blue-400 text-center hover:to-blue-600 transition-colors'>Continue with 
                                    <span className='md:p-2 p-1'>
                                       <FaXTwitter fill='black' size={24} className='inline' />
                                   </span>
                                   </p>
                           </div>
            </div>
            
        </div>
          <p className=" md:my-2 my-1 text-center">Already have an account? <Link to='/auth/sign-in' className='underline font-bold'>Sign in</Link> </p>
           <p className='md:my-2 my-1 text-center'>&copy; 2025 GoHere. All rights reserved. Lorem ipsum dolor amet</p>
        </div>
    )
}