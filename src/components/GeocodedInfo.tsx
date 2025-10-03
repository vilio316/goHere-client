import { useEffect, useState } from "react"
import axios from "axios"
import { useLocationCoords } from "../contexts/LocationContext"

export default function GeocodedInfo(){
    const [locationInformation , setLocationInformation] = useState<string>()
    const {location} = useLocationCoords()

    useEffect(() => {
        async function getGeoDetails(latitude: number, longitude: number){
            if(longitude > 0 && latitude > 0){
            const request = await axios.get(`http://localhost:8090/geocoded_location/${latitude}/${longitude}`)
            if(request.data.results.length > 0){
                setLocationInformation(request.data.results[1].formatted_address)
                localStorage.setItem('user_location', `${request.data.results[1].address_components[4].long_name} , ${request.data.results[1].address_components[3].long_name}`)
            }
        }
            else{
                setLocationInformation('loading...')
            }
    }
        getGeoDetails(location.lat, location.long)
    }, [location])

    return(
            <p className="w-[90%] text-left h-12 text-wrap text-ellipsis overflow-clip">
            Searching from <span className="font-bold">{locationInformation}</span>
            </p>
        
    )
}