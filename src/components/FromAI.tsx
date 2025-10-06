import axios from "axios"
import type { resultType } from "../interfacesAndTypes"
import { useEffect, useState } from "react"
import { SearchResult } from "./SearchResults"
import { useLocationCoords } from "../contexts/LocationContext"

export default function FromAI(props: {query: string}){
    const [contents, updateContents] = useState({} as resultType)
    const {location} = useLocationCoords()
    
    useEffect(()=> {
        async function getSingleItem(){
            const {data} : {data: resultType[]} = await axios.get(`http://localhost:8090/search/${props.query}`)
            if(Math.abs(data[0].location.latitude - location.lat) < 0.181 && Math.abs(data[0].location.longitude - location.long) < 0.182){
                updateContents(data[0])
            }
        }
        getSingleItem()
    }, [])

    return(<>
    {
        contents && contents.location ? <SearchResult item={contents} /> : null
    }
    </>
    )
}