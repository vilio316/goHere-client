import axios from "axios"
import type { resultType } from "../interfacesAndTypes"
import { useEffect, useState } from "react"
import { SearchResult } from "./SearchResults"

export default function FromAI(props: {query: string}){
    const [contents, updateContents] = useState({} as resultType)

    useEffect(()=> {
        async function getSingleItem(){
            const {data} = await axios.get(`http://localhost:8090/search/${props.query}`)
            updateContents(data[0])
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