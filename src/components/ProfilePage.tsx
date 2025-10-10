import { FaUser } from "react-icons/fa6"
import { useAuthStatus } from "../contexts/AuthContext"
import { ProfileLocation } from "./ProfileLocation"

export default function ProfilePage(){
    const {locations, username, isLoggedIn} = useAuthStatus()

    return(
    <>
    {isLoggedIn?    <div className="md:p-4 p-2">
        <div className="flex gap-x-2">
        <FaUser size={24}/>
        <p className="text-2xl font-bold">Welcome Back, @{username}</p>
        </div>
        
        <div>
            <p className="text-xl underline ">Suggested Locations</p>
            <div className="min-h-[15vh] grid place-items-center">
                <p>No Suggested Locations</p>
                <p>Add more locations for better suggestions</p>
            </div>
        </div>
        <div>
        <p className="text-xl underline">Your Saved Locations ({locations.length})</p>
        {locations.length > 0 ?
        <div className="grid md:grid-cols-4 grid-cols-2 gap-x-2 md:gap-x-4">
         {locations.map((location : string) => (
            <div key={location}>
            <ProfileLocation query={location} />
            </div>
            ))}
            </div>
            : <div>
               <p>No Saved Locations</p>
               <p>Please save more locations and view them here.</p>
                </div>}
        </div>
        </div> : <div>
            <p>Oops!</p>
            <p>Please log in to save and view saved locations</p>
            </div>}
    </>     
    )



}
