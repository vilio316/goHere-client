import { useEffect, useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import { SearchResult } from "./components/SearchResults"
import type { resultType } from "./interfacesAndTypes"
import GeocodedInfo from "./components/GeocodedInfo"
import LoaderComp from "./components/LoaderComp"
import FromAI from "./components/FromAI"
import { HiSparkles } from "react-icons/hi"
import { FaPaperPlane } from "react-icons/fa6"

function App() {
  const [intermediateState, updateIntermediateState] = useState('')
  const [search_query, updateSearchQuery] = useState("")
  const [search_results, updateSearchResults] = useState<resultType[]>([])
  const [loaded, setLoaded] = useState(false)
  const [AIResults, updateAIResults] = useState<string[]>([])
  const [isUsingAI, setAIUseState ] = useState(false)

  function handleCloseness(query : string, location: string|null ){
    const check_one = query.toLowerCase().includes('near me')
    const check_three = query.toLowerCase().includes('nearby')
    const check_two = query.toLowerCase().includes('close by')

    if(check_one || check_two || check_three){
      return `${query} near ${location}`
    }
    else{
      return ''
    }
  }


  useEffect(()=>{
    async function searchFromServer(query: string) {
      const userLocation = localStorage.getItem('user_location')
      if(isUsingAI && query.length > 3){
        try{
      const {data} : {data: any[]} = await axios.get(`http://localhost:8090/ai/${query} ${handleCloseness(query, userLocation)}`)
      if(data.length > 0){
      updateAIResults(data)
      }
     
  } catch(error){
        console.log(error)
      }
}
    else{
      if(query.length > 1){
      const {data} : {data : resultType[]} = await axios.get(`http://localhost:8090/search/${query}`)
      setLoaded(false)
      updateSearchResults(data)
      setLoaded(true)
    }
    else{
      setLoaded(false)
    }
    }
  }
    searchFromServer(search_query)
  }, [search_query, isUsingAI])

  return (
    <>
    <div className="grid justify-items-center p-2 md:p-1">
      <GeocodedInfo />
      <div className="grid md:w-[90vw] w-[100%] grid-cols-12 items-center my-2 md:my-0">
        <button className={`grid md:justify-items-end justify-items-center md:col-span-1 col-span-2 ${isUsingAI ? "opacity-100" : 'opacity-25'} transition-opacity`} onClick={()=> setAIUseState(!isUsingAI)} title={`${isUsingAI? "Disable AI Search" : "Use AI Search"}`}>
        <span className="p-1 md:p-2">
        <HiSparkles fill="blue" size={28}/>
        </span>
        </button>
        <input type="text" name="search" id="location_query" required placeholder="Where do you wanna go?" className="rounded-4xl p-1 md:w-full md:col-span-9 col-span-8 w-full border-2 indent-4 h-[5rem] border-black outline-none peer invalid:border-2 invalid:border-red-500 autofocus" autoComplete="true" minLength={3}  onChange={(e) => {
         if(!isUsingAI){
         if(e.target.value.length %2 ==0){
            updateSearchQuery(e.target.value)
          }
        }
        else{
            updateIntermediateState(e.target.value)
        }

        }}/>
        <button className={`ai_submit items-center grid grid-cols-2 md:p-2 p-1 md:text-lg text-sm col-span-2 ${isUsingAI ? 'opacity-100': "opacity-0"} justify-self-center place-items-center w-[75%] rounded-2xl md:bg-amber-300 md:hover:bg-amber-400`} onClick={()=> {
          console.log(intermediateState)
          updateSearchQuery(intermediateState);
        }}>
        <span className="p-2 hidden md:grid ms:col-span-1 text-center">Submit</span>
        <FaPaperPlane fill="blue" className="col-span-1 grid md:text-3xl text-lg"/>
        </button>
        </div>
        <p className="peer-invalid:block hidden peer-invalid:text-red-400 text-sm">
          Please enter a longer search term
        </p>
        {isUsingAI ? 
        <div className="search_results w-[90%]">
              {AIResults.length > 0 && search_query.length > 5 ? AIResults.map((result) => <FromAI query={result} key={result} />): search_query.length > 5 ? <LoaderComp/>: null}
        </div> :
        <div className="search_results w-[90%] ">
          {search_query.length > 3 && loaded ? search_results?.slice(0,5).map((item)=> (
            <SearchResult item={item} key = {item.id}/>
          ))
        : search_query.length > 2 ? <LoaderComp /> : null
        }
        <div className="w-full grid justify-center">
        <Link to={`/results?query=${
          search_query
        }`} 
        className={`${search_results.length > 0 && search_query.length > 4 ? 'opacity-100' : 'opacity-0'} bg-yellow-300 grid text-center rounded-[1.5rem] text-xl md:text-2xl p-1 md:p-2`
        }>See More ... &gt; </Link>
        </div>
    </div>}
    </div>
    </>
  )
}

export default App
