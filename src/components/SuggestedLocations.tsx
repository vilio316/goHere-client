import { useAuthStatus } from "../contexts/AuthContext"
import { useState, useEffect } from "react"
import axios from "axios"
import type { resultType } from "../interfacesAndTypes"
import LoaderComp from "./LoaderComp"
import { Link } from "react-router"

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
            {suggested.length > 0 ? suggested.map((item) => <SuggestedLocation query={item} />): null}
            </>
        )
    }


    return(
        <>
        {locations.length > 0 ?
        <div className="grid grid-cols-4 gap-12">{
        locations.map((item) => <SuggestedFromAI query={item.name}/>)
}</div>
        : <LoaderComp/>}
        </>
    )
}





function SuggestedLocation(props: {query: string}){
    const {query} = props
    const [locationDetailsState, updateDetailsState] = useState({} as resultType)
    //const {locations, updateLocations} = useAuthStatus()
    //const {showToast, updateMessageObj, messageObject} = useToast()
    
    useEffect(() => {
        async function getResult(query: string) {
        const {data} = await axios.get(`http://localhost:8090/search/${query}`)
            if(data){
           const specificLocation = data[0]
          updateDetailsState(specificLocation)
        }}

        getResult(query);
    }, [])



    return(
        <div>
            <>
        {locationDetailsState.displayName ? <>
        <Link to={`/location/${locationDetailsState.location.latitude}/${locationDetailsState.location.longitude}?id=${locationDetailsState.id}`}>
        {locationDetailsState.displayName ? locationDetailsState.displayName.text : "Loading..."}
        </Link>
        <p>{locationDetailsState.rating? locationDetailsState.rating : 'Loading...'}</p>
        <p>{locationDetailsState.shortFormattedAddress ? locationDetailsState.shortFormattedAddress : "Loading"}</p>
</> : <p>Undefined!</p>}</>
        </div>
    )
}