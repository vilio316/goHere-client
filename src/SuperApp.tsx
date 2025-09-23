import { Outlet } from "react-router";
import { Link } from "react-router";
import { FaLocationPin } from "react-icons/fa6";

function SuperApp(){

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

      <div className="md:grid hidden md:col-span-2 md:grid-cols-5 p-1">
        <Link to='/'>Home</Link>
        <span>Locations</span>
        <span>Contact Us</span>
        <span>Contribute</span>
        <span>Random...</span>
      </div>

      <div className="md:grid hidden col-span-1 justify-center">
        <Link to={'/auth/sign-in'} className="bg-yellow-300 text-white text-xl p-1 md:p-2 rounded-2xl text-center hover:bg-yellow-400">
          Login / Register
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