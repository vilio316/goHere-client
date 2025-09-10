import { useEffect, useState } from "react"
import axios from "axios"

export default function GeocodedInfo(props: {latitude: number, longitude: number}){
    const {latitude, longitude} = props
    const [locationInformation , setLocationInformation] = useState<string>()

    useEffect(() => {
        async function getGeoDetails(latitude: number, longitude: number){
            if(longitude > 0 && latitude > 0){
            const request = await axios.get(`http://localhost:8090/geocoded_location/${latitude}/${longitude}`)
            if(request.data.results.length > 0){
                setLocationInformation(request.data.results[2].formatted_address)
            }
        }
            else{}
    }
        getGeoDetails(latitude, longitude)
    }, [])

    return(
            <p className="w-[80%] text-left">
            Searching from <span className="font-bold">{locationInformation}</span>
            </p>
        
    )
}