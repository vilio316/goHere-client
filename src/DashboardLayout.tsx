import { Outlet } from "react-router";
import {
  FaChartLine,
  FaCreditCard,
  FaList,
  FaLocationPin,
} from "react-icons/fa6";
import { Link } from "react-router";
import { FaHome } from "react-icons/fa";

export default function DashLayout() {
  return (
    <div className="p-4">
      <div className="header grid grid-cols-6 p-1 items-center">
        <div className="flex col-span-4 md:col-span-4 p-1 items-center md:gap-x-2 gap-x-1 ">
          <FaLocationPin size={40} fill="red" />
          <Link to="/" className="hover:underline hover:font-bold">
            <p className="text-2xl my-1">GoHere</p>
            <p className="my-1 hidden md:block">Your #1 Travel Companion</p>
          </Link>
        </div>
        <div className="items-center w-1/2 justify-self-end grid col-span-2 bg-yellow-400 text-white rounded-xl hover:rounded-2xl p-2 text-center">
          <button>Logged In!</button>
        </div>
      </div>

      <div className="grid grid-cols-6 my-4">
        <div className="md:col-span-2 lg:col-span-1 grid border-2 border-red-400 p-4">
          <Link to={"/owner"} className="items-center flex gap-x-2">
            <FaHome className="inline text-4xl font-bold fill-blue-400 bg-blue-100" />
            <span className="font-bold">Home</span>
          </Link>
          <Link to={"/owner/listings"} className="items-center flex gap-x-2">
            {" "}
            <FaList className="inline text-4xl font-bold fill-blue-400 bg-blue-100" />
            <span className="font-bold">Your Listings</span>
          </Link>
          <Link
            to={"/owner/payments-and-subscriptions"}
            className="items-center flex gap-x-2"
          >
            <FaCreditCard className="inline text-4xl font-bold fill-blue-400 bg-blue-100 " />
            <span>Payments and Subscriptions</span>
          </Link>
          <Link to={"/owner/analytics"} className="items-center flex gap-x-2">
            <FaChartLine className="inline text-4xl font-bold fill-blue-400 bg-blue-100 " />
            <span className="font-bold">Analytics</span>
          </Link>
          <Link to={"/"} className="items-center flex gap-x-2">
            Extra Thing
          </Link>
          <button className="outline-none border-0">Sign Out</button>
        </div>

        <div className="grid md:col-span-4 lg:col-span-5 p-4 md:min-h-[80vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
