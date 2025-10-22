import {Link} from 'react-router'
import axios from 'axios'
import { useState } from 'react'
import { FaGoogle, FaXTwitter } from 'react-icons/fa6'
import { ToastNotification } from '../ToastComponents';
import { useToast } from '../../contexts/ToastContext';
import LoaderComp from '../LoaderComp';

export default function Login(){
    const [email, setMail] = useState('')
    const {messageObject, updateMessageObj, showToast} = useToast()
    const [pwd, setPwd] = useState('')
    const [formLoading, updateFormLoad] = useState<null | boolean>(null)
    const [errorParagraph, changeError] = useState('')

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        updateFormLoad(true)
        setTimeout(async() => {
        try{
            const {data} = await axios.post('http://localhost:8090/auth/sign-in', {email, pwd}, {withCredentials: true})
            const {success} = data
            if(email){
            if(success == true){
                localStorage.setItem('userMail', email)
                updateFormLoad(false)
                updateMessageObj({...messageObject, action: 'Sign In', success: true})
                showToast(true)
            }
        }
        }
        catch(error: any){
            changeError(error.response.data.message)
            updateMessageObj({...messageObject, action: error.response.data.message, success: false})
            showToast(true)
            updateFormLoad(false)
        }}, 500)
    }

 return(
    <div className="md:min-h-[50vh] relative min-h-[80vh] grid border-2 border-black md:w-5/10 p-2 md:p-4 rounded-2xl ">
            <ToastNotification />
        <div className='text-center'>
        <Link to='/' className='md:text-3xl text-2xl font-bold text-center'>GoHere </Link>
        <p>Your Number One Tourism Companion</p>
        <p className='text-2xl font-bold md:my-3 my-2'>Sign In</p>
        </div>

        <div className={`absolute ${formLoading == true ? '': 'hidden'} top-0 bg-gray-200 opacity-60 grid border-2 border-black w-full p-2 md:p-4 rounded-2xl h-[100%] `}>
            <LoaderComp/>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full">
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

            <p className='text-red-500'>{pwd.length < 2 ? errorParagraph: null}</p>
            <button type="submit" className='bg-blue-400 p-2 rounded-2xl md:my-2 my-1 text-center min-w-[45%] hover:underline hover:md-text-[20px] hover:font-bold' disabled={
                email.length < 8 || pwd.length <8
            } >
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

            <p className='text-center md:my-2 my-1 hover:font-bold hover:underline'>Forgot password?</p>
            <p className='text-center md:my-2 my-1'>Don't have an account? <Link to="/auth/sign-up" className='underline font-bold'>Sign up</Link> here</p>
            <p className='md:my-2 my-1 text-center'>&copy; 2025 GoHere. All rights reserved. Lorem ipsum dolor amet</p>
        </div>
    </div>
 )   
}