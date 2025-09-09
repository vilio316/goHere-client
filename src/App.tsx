import { useEffect, useState } from "react"
import { Link } from "react-router"
import axios from "axios"
import { SearchResult } from "./components/SearchResults"
import { useLocationCoords } from "./contexts/LocationContext"


export interface resultType{
  id: string,
  name: string,
  internationalPhoneNumber: string,
  formattedAddress: string,
  shortFormattedAddress: string,
  photos?: {
    googleMapsUri: string
  }[],
  plusCode: {
    globalCode: string,
    compoundCode: string
  },
  location: {
    longitude: number,
    latitude: number,
  },
  rating?: number, 
  googleMapsUri: string,
  websiteUri: string, 
  displayName: {
    text: string, 
    languageCode: string
  },
  primaryTypeDisplayName: {
    text: string,
    languageCode: string
  }, 
  openNow: boolean,
  goodForGroups: boolean,
  goodForWatchingSports: boolean,
  goodForChildren: boolean
}

function App() {
  const [search_query, updateSearchQuery] = useState("")
  const [search_results, updateSearchResults] = useState<resultType[]>([])
  const { setLocation } = useLocationCoords()

  navigator.geolocation.getCurrentPosition((position) => {setLocation(
    {
      lat: position.coords.latitude , long: position.coords.longitude
    }
  )
  }
)


  useEffect(()=>{

    async function searchFromServer(query: string) {
      if (query.includes('near me') || query.includes('nearby')){
        console.log("Using Nearby Search")
      }
      const {data} : {data : resultType[]} = await axios.get(`http://localhost:8090/search/${query}}`)
      updateSearchResults(data)
    }
    searchFromServer(search_query)
  }, [search_query])

  return (
    <>
    <div className="grid justify-items-center p-4 md:p-2">
        <input type="search" name="search" id="location_query" required placeholder="Where do you wanna go?" className="rounded-4xl p-2 md:p-4 md:w-[80%] w-[90%] block border-2 h-[5rem] border-black outline-none peer invalid:border-2 invalid:border-red-500 autofocus" autoComplete="true" minLength={3}  onChange={(e) => {
          if(e.target.value.length %3 ==0){
            updateSearchQuery(e.target.value)
          }
        }}/>
        <p className="peer-invalid:block hidden peer-invalid:text-red-400">
          Please enter a longer search term
        </p>

        <div className="search_results w-4/5">
          {search_query.length > 2 ? search_results?.slice(0,5).map((item)=> (
            <SearchResult item={item} key = {item.id}/>
          ))
        : null
        }
        <Link to={`/results?query=${
          search_query
        }`} 
        className={`${search_results.length > 0 ? 'block' : 'hidden'}`
        }>See More ... &gt; </Link>
      {/*Search Results  */}
      {/*Should have a Read More section that links to other page, uses URL state*/}
    </div>
    </div>
    </>
  )
}

export default App
