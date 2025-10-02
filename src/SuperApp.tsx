import { Outlet } from "react-router";
import { Link } from "react-router";
import { FaLocationPin } from "react-icons/fa6";
import { useAuthStatus } from "./contexts/AuthContext";

function SuperApp(){
  const {isLoggedIn } = useAuthStatus()

    return(
        <>
      <div>
      <div className="header grid md:grid-cols-4 items-center">
      <div className="flex col-span-1 p-2 items-center gap-x-2">
        <FaLocationPin size={40} fill="red" />
        <Link to='/'>
        <p className="text-2xl my-1">GoHere</p>
        <p className="my-1 ">Your #1 Travel Companion</p>
        </Link>
      </div>

      <div className="md:grid hidden md:col-span-2 md:grid-cols-5 p-1 items-center">
        <Link to='/'>Home</Link>
        <span className="p-2">Locations</span>
        <span className="p-2">Contact Us</span>
        <span className="p-2">Contribute</span>
        <span className="p-2">Random...</span>
      </div>

      <div className="md:grid hidden col-span-1 justify-center">
        <Link to={isLoggedIn? "": '/auth/sign-in'} className="bg-yellow-300 text-white text-xl p-1 md:p-2 rounded-2xl text-center hover:bg-yellow-400 min-w-[10rem]">
          {isLoggedIn? "Logged In!" : "Login/Register"}
        </Link>
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