import { FaUser } from "react-icons/fa6"
import { useAuthStatus } from "../contexts/AuthContext"
import { ProfileLocation } from "./ProfileLocation"
import { Link } from "react-router"
import axios from "axios"
import { ToastNotification } from "./ToastComponents"
import SuggestedLocationWrapper from "./SuggestedLocations"


export default function ProfilePage(){
    const {locations, username, isLoggedIn} = useAuthStatus()

     async function clearLocations(){
            const email = localStorage.getItem('userMail')
            const clearedArray = ["Empty"]
            const {data} = await axios.post(`http://localhost:8090/auth/update_locations`, {clearedArray, email})
            console.log(data)
        } 

    return(
        <div className="grid">
    <ToastNotification />
    {isLoggedIn ? <div className="md:p-4 p-2">
        <div className="flex gap-x-2">
        <FaUser size={24}/>
        <p className="text-2xl font-bold">Welcome Back, @{username}</p>
        </div>
        
        <div>
            <p className="text-xl underline ">Suggested Locations</p>
            <div className="min-h-[15vh] grid place-items-center">
              {locations.length > 0 ? <SuggestedLocationWrapper /> :  
              <>
              <p>No Suggested Locations</p>
                <p>Add more locations for better suggestions</p>
                </>}
            </div>
        </div>
        <div>
        <button onClick={clearLocations}>Clear Locations</button>
        <p className="text-xl underline">Your Saved Locations ({locations.length})</p>
        {locations.length > 0 ?
        <div className="grid md:grid-cols-4 grid-cols-2 gap-2 md:gap-4 my-2">
         {locations.map((location : any) => (
            <div key={location.id}>
            <ProfileLocation query={location.name} id={location.placeID}/>
            </div>
            ))}
            </div>
            : <div className="grid place-items-center">
               <p>No Saved Locations</p>
               <p>Please save more locations and view them here.</p>
                </div>}
        </div>
        </div> : <div className="grid place-items-center h-[90vh]">
            <div>
            <p className="text-2xl font-bold">Oops!</p>
            <p>Please <Link to='/auth/sign-in' className="underline">log in</Link> to save and view saved locations</p>
            </div>
            </div>
            }
    </div>
    )



}
