import { Outlet, useNavigate } from "react-router";
import { Link } from "react-router";
import { FaLocationPin, FaUser } from "react-icons/fa6";
import { useAuthStatus } from "./contexts/AuthContext";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";

function SuperApp(){
  const {isLoggedIn, logIn, username, updateLocations } = useAuthStatus() 
  const navigate = useNavigate()

   async function logOutUser(){
          const {data} = await axios.post('http://localhost:8090/auth/logout')
          const {message} = data 
          window.alert(message)
          logIn(false)
          updateLocations([''])
          localStorage.setItem('userMail', '')
          navigate('/')   
          
      }

    return(
        <>
      <div>
      <div className="header grid grid-cols-4 items-center border-b-1 border-gray-500 my-2">
      <div className="flex col-span-2 md:col-span-1 p-2 items-center md:gap-x-2 gap-x-1 ">
        <FaLocationPin size={40} fill="red" />
        <Link to='/' className="hover:underline hover:font-bold">
        <p className="text-2xl my-1">GoHere</p>
        <p className="my-1 hidden md:block">Your #1 Travel Companion</p>
        </Link>
      </div>

      <div className="md:grid hidden md:col-span-2 md:grid-cols-5 p-1 items-center">
        <Link to='/' className="hover:underline" >Home</Link>
        <Link to='/me#locations' className="hover:underline">Locations</Link>
        <span className="p-2">Contact Us</span>
        <span className="p-2">Contribute</span>
        <span className="p-2">Random...</span>
      </div>

      {/*Mobile Nav */}
      <div className="grid col-span-2 md:hidden justify-end mobile-nav">
        <div className="group relative p-2">
          {isLoggedIn? <FaUser size={24} fill="gray"/> :<GiHamburgerMenu fill='gray' size={24} />}
          <div className="links grid group-hover:opacity-100 transition-opacity opacity-0 absolute top-0 right-0 bg-gray-400 p-2 w-[10rem] rounded-2xl">
        <Link to='/' className="hover:font-bold hover:underline link ">Home</Link>
        <Link to='/me' className="hover:font-bold hover:underline link">Your Profile</Link>
        <Link to='/' className="hover:font-bold hover:underline link">Contact Us</Link >
        <span className="block my-1">Contribute</span>
        {!isLoggedIn ? 
        <Link className="outline-none border-t-2 border-gray w-full log-in hover:underline p-2" to='/auth/sign-in' > Sign In</Link>:
        <button className="outline-none border-t-2 border-gray w-full log-out p-2" onClick={() => logOutUser()}> Sign Out</button>
} 
        </div>
        </div>
      </div>
      {/*End */}

      <div className="md:grid hidden col-span-1 justify-center relative group">
        <Link to={isLoggedIn? "": '/auth/sign-in'} className="bg-yellow-300 text-white text-xl p-1 md:p-2 rounded-2xl text-center hover:bg-yellow-400 min-w-[10rem]">
          {isLoggedIn ? `${username.length > 2 ? `@${username}`: "Loading..."}` : "Login/Register"}
        </Link>

        <div className={`absolute z-10 top-0 w-3/4 opacity-0 group-hover:opacity-100 transition-all p-4 bg-yellow-200 
        ${isLoggedIn? 'group-hover:grid': 'hidden'}
          rounded-3xl`}>
          
        <Link to='/'>Home</Link>
        <Link to='/me'>Your Profile</Link>
        <Link to='/'>Contact Us</Link >
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