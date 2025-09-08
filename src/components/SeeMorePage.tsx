import { useEffect, useState } from "react"
import axios from "axios"
import type { resultType } from "../App"
import { useSearchParams } from "react-router"
import { SearchResult } from "./SearchResults"

export default function ViewAll(){
    const [searchparams, changeParams] = useSearchParams()
    const queryVal = searchparams.get('query')
    const [searchResults, updateSearchResults] = useState<resultType[]>([])

    useEffect(() => {
        async function getFullList(){
        const results = await axios.get(`http://localhost:8090/search/${queryVal}`)
        const {data} : {data: resultType[]} = results
        updateSearchResults(data)
        }

        getFullList();
}, [searchResults])

    return(
        <div className="grid">
        <p>Showing full results for search term: "{queryVal}" </p>
        <div className="grid w-[90%]">
        {
            searchResults.map((item) => (
            <SearchResult item={item} key={item.id} />))
        }
        </div>
        </div>
    )
}