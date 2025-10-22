import { useAuthStatus } from "../contexts/AuthContext"
import { useState, useEffect } from "react"
import axios from "axios"
import type { resultType } from "../interfacesAndTypes"
import LoaderComp from "./LoaderComp"
import { Link } from "react-router"
import { useLocationCoords } from "../contexts/LocationContext"
import { FaLocationPin, FaStar } from "react-icons/fa6"

export default function SuggestedLocationWrapper(){
        const {locations} = useAuthStatus()
   
    function SuggestedFromAI(props: {query: string}){
        const {query} = props
        const [suggested, updateSuggested] = useState<string[]>([]) 
        useEffect(()=> {
            async function generateSuggestions(query: string){
                const {data} = await axios.get(`http://localhost:8090/ai/suggest/places like ${query}`) 
                updateSuggested([...suggested, ...data])
            }
            
            generateSuggestions(query)
            

        }, [])

        return(
            <>
            {suggested.length > 0 ? suggested.map((item) => <SuggestedLocation query={item} key={item} />): <LoaderComp/>}
            </>
        )
    }


    return(
        <>
        {locations.length > 0 ?
        <div className="grid md:grid-cols-4 grid-cols-2 md:gap-8 gap-4">{
        locations.map((item) => <SuggestedFromAI query={item.name} key={item.name}/>)
}</div>
        : null}
        </>
    )
}





function SuggestedLocation(props: {query: string}){
    const {query} = props
    const [locationDetailsState, updateDetailsState] = useState({} as resultType)
    const {location } = useLocationCoords()

    //const {showToast, updateMessageObj, messageObject} = useToast()
    
    useEffect(() => {
        async function getResult(query: string) {
        const {data} = await axios.get(`http://localhost:8090/search/${query}`)
            if(data){
           const specificLocation = data[0]
            if(Math.abs(data[0].location.latitude - location.lat) < 0.181 && Math.abs(data[0].location.longitude - location.long) < 0.182){
          updateDetailsState(specificLocation)
        }}}

        getResult(query)
    }, [])



    return(
            <>
        {locationDetailsState.displayName ? 
        <div className='md:p-4 p-2 grid border-1 my-2 border-gray shadow-2xl shadow-green-200 rounded-3xl md:min-h-[12.5rem] min-h-[15rem]'>
        <Link to={`/location/${locationDetailsState.location.latitude}/${locationDetailsState.location.longitude}?id=${locationDetailsState.id}`} className='font-bold capitalize'  >
        {locationDetailsState.displayName ? locationDetailsState.displayName.text : "Loading..."}
        </Link>
        
        <div className='flex md:gap-x-2 gap-x-1'>
        <span>{locationDetailsState.primaryTypeDisplayName.text}</span>
        <div className="flex md:gap-x-2 gap-x-1">
        <FaStar fill="gold" size={20} className="inline"  />
        <p>{locationDetailsState.rating? locationDetailsState.rating : 'Loading...'}</p>
        </div>
        </div>

        <div className='flex md:gap-x-4 gap-x-1'>
        <FaLocationPin fill="red" size={20} className="inline" />
        <p className="capitalize">{locationDetailsState.shortFormattedAddress ? locationDetailsState.shortFormattedAddress : "Loading"}</p>
        </div>
        </div> : null}
        </>
    )
}