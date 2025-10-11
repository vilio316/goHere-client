import { useEffect, useState } from "react"
import axios from "axios"
import type { resultType } from "../interfacesAndTypes"
import { FaLocationPin, FaStar } from "react-icons/fa6"
import { Link } from "react-router"

export function ProfileLocation(props: {query: string}){
    const {query} = props
    const [resultState, updateResultState] = useState({} as resultType)
    
    useEffect(() => {
        async function getResult(query: string) {
            const {data} = await axios.get(`http://localhost:8090/search/${query}`)
            updateResultState(data[0])
            console.log(resultState)
        }
        getResult(query)
    }, [])

    return(
       <>
       <div className="p-2 grid border-1 border-gray shadow-2xl shadow-green-200 rounded-3xl h-full">
        <div className="flex gap-x-1 md:gap-x-2 my-1 md:my-2 items-center">
            {resultState.location && resultState.displayName ?
        <Link className="font-bold hover:underline w-3/5" to={`/location/${resultState.location.latitude}/${resultState.location.longitude}`}>
            {resultState.displayName ? resultState.displayName.text: 'Loading...'}
        </Link> : <p>
             {resultState.displayName ? resultState.displayName.text: 'Loading...'}
            </p>}
        <button className="justify-self-end  outline-none border-none rounded-xl text-center bg-yellow-400 text-white p-1 w-1/3 hover:font-bold ">
            Unsave 
        </button>
        </div>
        
        <div className="flex gap-x-1 md:gap-x-2 my-1">
          <span className="capitalize ">{resultState.primaryTypeDisplayName? resultState.primaryTypeDisplayName.text : ''}</span>  
           
            {resultState.rating?
            <div>
        <FaStar fill='gold' className="inline"  />
        <span>{resultState.rating? resultState.rating : ''}</span>
            </div> : null
            }
                 
            </div>
        
        <div className="flex gap-x-1">
        <FaLocationPin className="inline fill-red-600" size={18}/>
        <p className="indent-2 text-left w-full">{resultState.shortFormattedAddress? resultState.shortFormattedAddress: ''}</p>
        </div>

       
       </div> 
        </>
    )

}