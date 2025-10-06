import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router";
import { FaLocationPin } from "react-icons/fa6";
import { useAuthStatus } from "./contexts/AuthContext";
import axios from "axios";

function SuperApp(){
  const {isLoggedIn, logIn } = useAuthStatus() 
  const navigate = useNavigate()

   async function logOutUser(){
          const {data} = await axios.post('http://localhost:8090/auth/logout')
          const {message} = data 
          window.alert(message)
          logIn(false)
          navigate('/')
          
      }

    return(
        <>
      <div>
      <div className="header grid md:grid-cols-4 items-center border-b-1 border-gray-500 my-2">
      <div className="flex col-span-1 p-2 items-center gap-x-2 ">
        <FaLocationPin size={40} fill="red" />
        <Link to='/'>
        <p className="text-2xl my-1">GoHere</p>
        <p className="my-1 hidden md:block">Your #1 Travel Companion</p>
        </Link>
      </div>

      <div className="md:grid hidden md:col-span-2 md:grid-cols-5 p-1 items-center">
        <Link to='/'>Home</Link>
        <span className="p-2">Locations</span>
        <span className="p-2">Contact Us</span>
        <span className="p-2">Contribute</span>
        <span className="p-2">Random...</span>
      </div>

      <div className="md:grid hidden col-span-1 justify-center relative group">
        <Link to={isLoggedIn? "": '/auth/sign-in'} className="bg-yellow-300 text-white text-xl p-1 md:p-2 rounded-2xl text-center hover:bg-yellow-400 min-w-[10rem]">
          {isLoggedIn? "Logged In!" : "Login/Register"}
        </Link>

        <div className={`absolute z-10 top-0 w-3/4 opacity-0 group-hover:opacity-100 transition-all p-4 bg-yellow-200 
        ${isLoggedIn? 'group-hover:grid': 'hidden'}
          rounded-3xl`}>
          
        <Link to='/'>Home</Link>
        <span className="block my-1">Locations</span>
        <span className="block my-1">Contact Us</span>
        <span className="block my-1">Contribute</span>
        <button className="outline-none border-t-2 border-gray w-full log-out" onClick={() => logOutUser()}> Sign Out</button>
        </div>

      </div>
    </div>

            <div className="p-1 md:p-2">
            <Outlet />
            </div>

        </div>
    </>
    )
}

export default SuperApp