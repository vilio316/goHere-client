import { useEffect, useState } from "react"
import { FaLocationPin } from "react-icons/fa6"
import { Link } from "react-router"
import axios from "axios"
import { SearchResult } from "./components/SearchResults"

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


  useEffect(()=>{

    async function searchFromServer(query: string) {
      const {data} : {data : resultType[]} = await axios.get(`http://localhost:8090/search/${query}}`)
      updateSearchResults(data)
    }
    searchFromServer(search_query)
  }, [search_query])

  return (
    <>
    <div className="header grid md:grid-cols-4 items-center">
      <div className="flex col-span-1 p-2 items-center gap-x-2">
        <FaLocationPin size={40} fill="red" />
        <Link to='/'>
        <p className="text-2xl my-1">GoHere</p>
        <p className="my-1 ">Your #1 Travel Companion</p>
        </Link>
      </div>

      <div className="md:grid hidden md:col-span-2 md:grid-cols-5 p-1">
        <span>About</span>
        <span>Locations</span>
        <span>Contact Us</span>
        <span>Contribute</span>
        <span>Random...</span>
      </div>

      <div className="md:grid hidden col-span-1 justify-center">
        <div className="bg-yellow-300 text-white text-xl p-2 rounded-2xl text-center hover:bg-yellow-400">
          Login / Register
        </div>
      </div>
    </div>

    <div className="grid justify-items-center p-4 md:p-2">
        <input type="search" name="search" id="location_query" required placeholder="Where do you wanna go?" className="rounded-4xl p-2 md:p-4 md:w-[80%] w-[90%] block border-2 h-[5rem] border-black outline-none" autoComplete="true"  onChange={(e) => {
          if(e.target.value.length %3 ==0){
            updateSearchQuery(e.target.value)
          }
        }}/>
        <div className="search_results w-full">
          {search_query.length > 2 ? search_results?.map((item)=> (
            <SearchResult item={item} />
          ))
        : <p>Please enter a longer search term</p>
        }
      {/*Search Results  */}
      {/*Should have a Read More section that links to other page, uses URL state*/}
    </div>
    </div>
    </>
  )
}

export default App
