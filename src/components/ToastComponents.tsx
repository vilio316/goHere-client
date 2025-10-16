import React from 'react'
import { useToast } from '../contexts/ToastContext'
import { useAuthStatus } from '../contexts/AuthContext'
import { useNavigate } from 'react-router'

type Props = {children: React.ReactNode}

export default function ToastContainer({children}: Props) {
    const {isVisible} = useToast()
  return (
    <div className={`w-[100vw] absolute h-[100vh] z-10 bg-transparent ${isVisible? "grid": 'hidden'}`}>
        {children}
    </div>
  )
}

export function ToastNotification(){
    const {messageObject, showToast, isVisible} = useToast() 
    const navigate = useNavigate()
    const {logIn} = useAuthStatus()
    function defineNotificationContent(action:string, success?: boolean){
        if(action == 'Sign In' && success == true){
            return 'Sign In Successful'
        }
        else if(action == 'Sign Up' && success == true){
            return 'Sign Up Successful'
        }
        else if(action == 'Log Out' && success == true){
            return 'Log Out Successful'
        }
        else{
            return action
        }
    }

    return(
        <div className={`absolute z-20 toast grid justify-self-center  ${isVisible ? `md:top-20 top-16 opacity-100` :`-top-[200px] opacity-0`}  bg-gray-400 p-4 rounded-2xl border-2 ${messageObject.success ? `border-green-400`: `border-red-400`}`}>
            <div className='flex gap-x-8'>
                <p className=''>{defineNotificationContent(messageObject.action, messageObject.success)}</p>
                <button className='rounded-xl w-12 outline-none bg-yellow-400 text-white' onClick={() => {
                    if(messageObject.action == 'Sign In' && messageObject.success == true){
                        logIn(true),
                        navigate('/')
                    }
                    if(messageObject.action == "Log Out" && messageObject.success == true){
                        logIn(false);
                        navigate('/')
                    }
                    if(messageObject.action == "Sign Up" && messageObject.success == true){
                        navigate('/auth/sign-in')
                    }
                    showToast(false)
                    
                    }}>
                    OK
                </button>
            </div>
        </div>
    )

}