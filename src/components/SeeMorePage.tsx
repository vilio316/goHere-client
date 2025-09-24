import { useEffect, useState } from "react"
import axios from "axios"
import type { resultType } from "../interfacesAndTypes"
import { useSearchParams } from "react-router"
import { SearchResult } from "./SearchResults"

export default function ViewAll(){
    const [searchparams] = useSearchParams()
    const [loadingState, setLoadingState] = useState(true)
    const queryVal = searchparams.get('query')
    const [searchResults, updateSearchResults] = useState<resultType[]>([])

    useEffect(() => {
        async function getFullList(){
        const results = await axios.get(`http://localhost:8090/search/${queryVal}`)
        const {status} = results
        if(status && status ==  200){
            setLoadingState(false)
        }
        const {data} : {data: resultType[]} = results
        console.log(status)
        updateSearchResults(data)
        }

        getFullList();
}, [])

    return(
        <div className="grid p-1 md:p-2">
        <p>Showing <span className="font-bold">{searchResults.length>0 ? searchResults.length : null}</span> results for search term: "{queryVal}" </p>
        <div className="grid w-[90%]">
        {
            loadingState? <p>Loading...</p> : searchResults.map((item) => (
            <SearchResult item={item} key={item.id} />))
        }
        </div>
        </div>
    )
}