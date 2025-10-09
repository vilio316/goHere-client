import { FaUser } from "react-icons/fa6"
import { useAuthStatus } from "../contexts/AuthContext"
import { ProfileLocation } from "./ProfileLocation"

export default function ProfilePage(){
    const {locations, username} = useAuthStatus()
    return(
        <div className="md:p-4 p-2">
        <div className="flex gap-x-2">
        <FaUser size={24}/>
        <p className="text-2xl font-bold">Welcome Back, @{username}</p>
        </div>
        
        <div>
            <p>Suggested Locations</p>
        </div>
        <div>
        <p className="bold text-2xl underline">Your Saved Locations ({locations.length})</p>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-x-2 md:gap-x-4">
        {locations.length > 0 ? locations.map((location : string) => (
            <div key={location}>
            <ProfileLocation query={location} />
            </div>
            )): null}
        </div>
        </div>
        </div>
    )
}