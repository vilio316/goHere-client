import { useEffect, useState } from "react"
import axios from "axios"
import type { resultType } from "../interfacesAndTypes"
import { FaLocationPin, FaStar } from "react-icons/fa6"
import { Link } from "react-router"
import { useAuthStatus } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"

export function ProfileLocation(props: {query: string, id: any}){
    const {query, id} = props
    const [resultState, updateResultState] = useState({} as resultType)
    const {locations, updateLocations} = useAuthStatus()
    const {showToast, updateMessageObj, messageObject} = useToast()
    
    useEffect(() => {
        async function getResult(query: string, id: any) {
            const {data} = await axios.get(`http://localhost:8090/search/${query}`)
           const specificLocation = data?.filter((item: resultType) => item.id == id)
           console.log(specificLocation)
           if(specificLocation[0]){
            console.log(specificLocation[0])
           updateResultState(specificLocation[0])
        }
    }
        getResult(query, id)
    }, [])

     async function postLocationsUnsave(body: any){
            const email = localStorage.getItem('userMail')
            const newBody = body.filter((item: any) => item.name !== resultState.displayName.text)
            updateLocations(newBody)
            const {data} = await axios.post(`http://localhost:8090/auth/update_locations`, {newBody, email})
            const {success} = data
            if(success){
            updateMessageObj({...messageObject, action:'Location unsaved successfully', success: true })
            showToast(true)
            }
        }

    return(
       <>
       <div className="md:p-4 p-2 grid border-1 border-gray shadow-2xl shadow-green-200 rounded-3xl md:min-h-[12.5rem] min-h-[15rem]">
        <div className="flex gap-x-1 md:gap-x-2 my-1 md:my-2 items-center">
            
            {resultState.location && resultState.id ?
        <Link className="font-bold hover:underline w-3/5 capitalize" to={`/location/${resultState.location.latitude}/${resultState.location.longitude}?id=${resultState.id}`}>
          {query}
        </Link> : <p>
            {query}
            </p>}
        <button className="justify-self-end  outline-none border-none rounded-xl text-center bg-yellow-400 text-white p-1 w-2/5 hover:font-bold" onClick={()=> {
            postLocationsUnsave(locations)
        }}>
            Unsave 
        </button>
        </div>
        
        <div className="flex gap-x-1 md:gap-x-2 my-1">
          <span className="capitalize ">{resultState.primaryTypeDisplayName? resultState.primaryTypeDisplayName.text : ''}</span>  
           
            {resultState.rating?
            <div>
        <FaStar fill='gold' className="inline"  />
        <span>{resultState.rating? resultState.rating : ''}</span>
            </div> : "Loading..."
            }
                 
            </div>
        
        <div className="flex gap-x-1">
        <FaLocationPin className="inline fill-red-600" size={18}/>
        <p className="indent-2 text-left w-full capitalize">{resultState.shortFormattedAddress? resultState.shortFormattedAddress: 'Loading...'}</p>
        </div>

       
       </div> 
        </>
    )

}