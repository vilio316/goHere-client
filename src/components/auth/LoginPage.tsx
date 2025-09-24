import {Link, useNavigate } from 'react-router'
import axios from 'axios'
import { useState } from 'react'
import { FaGoogle, FaXTwitter } from 'react-icons/fa6'
import { useAuthStatus } from '../../contexts/AuthContext';

export default function Login(){
    const navigate = useNavigate();
    const [email, setMail] = useState('')
    const {logIn } = useAuthStatus()
    const [pwd, setPwd] = useState('')

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try{
            const {data} = await axios.post('http://localhost:8090/auth/sign-in', {email, pwd})
            const {success, message} = data
            if(success){
                window.alert(message);
                logIn(true)
                navigate('/')
            }
        }
        catch(error){
            console.log(error)
        }
    }

 return(
    <div className="min-h-[50vh] grid border-2 border-black md:w-5/10 p-2 md:p-4 rounded-2xl ">
        <div className='text-center'>
        <Link to='/' className='md:text-3xl text-2xl font-bold text-center'>GoHere </Link>
        <p>Your Number One Tourism Companion</p>
        <p className='text-2xl font-bold md:my-3'>Sign In</p>
        </div>

        <form onSubmit={handleSubmit}>
            <legend className='font-bold text-xl'>User Information</legend>

            <fieldset>
            <label htmlFor="email">
                Username or email address
            </label>
            <input type='email' className='form my-1' name='email' id='email' onChange={(e) => setMail(e.target.value)} autoFocus required />
            <label htmlFor="pwd">
                Password
            </label>
            <input type="password" name="password" id="pwd" className={`form my-1 peer:`} onChange={(e) => setPwd(e.target.value)} required />

            <button type="submit" className='bg-blue-400 p-2 rounded-2xl md:my-2 my-1 text-center min-w-[45%] hover:underline hover:md-text-[20px] hover:font-bold'>
                Submit
            </button>

            </fieldset>
        </form>

        <div>
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

          
            <p className='text-center md:my-2 my-1'>Don't have an account? <Link to="/auth/sign-up" className='underline font-bold'>Sign up</Link> here</p>
            <p className='md:my-2 my-1 text-center'>&copy; 2025 GoHere. All rights reserved. Lorem ipsum dolor amet</p>
        </div>
    </div>
 )   
}