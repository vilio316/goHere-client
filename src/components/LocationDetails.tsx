import { useParams, useSearchParams } from "react-router"
import MapComponent from "./MapTestComponent"
import axios from "axios"
import { useEffect, useReducer, useState } from "react"
import { FaGlobe, FaLocationPin, FaPhone, FaRoute, FaStar } from "react-icons/fa6"
import { useLocationCoords } from "../contexts/LocationContext"
import CompanionApps from "./CompanionApplications"
import type { locationDetails, mapboxRespsonse } from "../interfacesAndTypes"
import { PlaceContext } from "../contexts/PlaceDetailsContext"
import LoaderComp from "./LoaderComp"
       
let locationStateObj : locationDetails = {
        displayName: '',
        phone: '',
        address: '',
        website: '',
        primaryType : '',
        rating: '',
        deliveryStatus: false, 
        mapsUri: ''
    }    
function updateLocationDetails(state: locationDetails , action : {type: string, payload: any }){
        switch(action.type){
            case 'setDisplayName': {
            return {
                ...state, displayName: action.payload
            }
        }
            case 'setAddress' : {
                return{
                    ...state, address: action.payload
                }
            }

            case 'setMapsUri': {
                return {
                    ...state, mapsUri: action.payload
                }
            }
            case 'setPrimaryType' : {
                return {
                    ...state, primaryType: action.payload
                }
            }
            case 'setRating' : {
                return {
                    ...state, rating: action.payload
                }
            }
            case 'setPhoneNumber' : {
                return {
                    ...state, phone: action.payload
                }
            }

             case 'setWebsite' : {
                return {
                    ...state, website: action.payload
                }
            }


            default: {
                return state
            }
    }
    }

function processNumber(number: number){
    if(number > 1000) return `${(Math.floor(number) / 1000).toFixed(1)} km`
    else return `<1km away`
}

export function LocationDetails(){
    const [searchParams] = useSearchParams()
    const [additionalInfo, updateAdditionalInfo] = useState<{
        childFriendly: boolean | null |undefined,
        wifi: boolean | null |undefined,
        sports: boolean | null |undefined ,
    }>
    ({childFriendly: null, wifi: null, sports: null })
    const {location} = useLocationCoords()
    const id_value = searchParams.get('id')
    const params = useParams()
    const [state_value, dispatch] = useReducer(updateLocationDetails, locationStateObj)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [photos, addPhoto] = useState('string')
    const [distanceDetails, setDistanceDetails] = useState({} as mapboxRespsonse) 

    function updateFields(object: google.maps.places.Place){
            dispatch({
                type: 'setWebsite', payload: object.websiteURI
            })
            dispatch({
                type: "setPhoneNumber", payload: object.internationalPhoneNumber
            })
            dispatch({
                type: 'setDisplayName', payload: object.displayName
            })
            dispatch({
                type: 'setAddress', payload: object.formattedAddress
            })
            dispatch({
                type: 'setPrimaryType', payload: object.primaryTypeDisplayName
            })
            dispatch({
                type: 'setRating', payload: object.rating?.toFixed(2)
            })
            dispatch({
                type: 'setDelivery', payload: object.hasDelivery
            })
            dispatch({
                type: 'setMapsUri', payload: object.googleMapsURI
            })
    }

    //Gets the details of a particular place
    useEffect(()=> {
        async function getPlaceDetails (){
            const { Place } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary

            if(id_value){
            const requested_locale = new Place({
                id: id_value
            })
          
            await requested_locale.fetchFields({
                fields: ['displayName', 'internationalPhoneNumber', 'formattedAddress', 'photos', 'primaryTypeDisplayName', 'websiteURI', 'rating', 'hasDelivery', 'googleMapsURI', 'hasWiFi', 'isGoodForChildren', "isGoodForWatchingSports" ]
            })
           updateFields(requested_locale)
           setLoadingStatus(true)
           updateAdditionalInfo({...additionalInfo
            , childFriendly: requested_locale.isGoodForChildren, wifi: requested_locale.hasWiFi, sports: requested_locale.isGoodForWatchingSports
           })
            if(requested_locale.photos && requested_locale.photos.length > 0) addPhoto(requested_locale.photos[0].getURI({maxHeight: 400}))
        }
        }

        getPlaceDetails()
    }
    , [])
//Effect ends here
    
    {
    //This Effect contacts Mapbox to show distance from the user's estimated location
    useEffect(() => {
            async function getDistanceDetails(){
                const {lat, long} = location
                if(lat > 1 && long > 1){
                const {data} = await axios.get(`http://localhost:8090/distance/${lat}/${long}/${params.lat}/${params.long}`)
                setDistanceDetails(data)
                }

            else{
                console.log("Waiting...")
            }
        }
        getDistanceDetails()
    }
    , [location])
    //Effect ends here
    }

    function FullLocationDetails(){
        return(
            <>
{ photos !== 'string' ?
            <img src={photos} className="rounded-2xl p-2 w-full max-h-[40vh] object-cover" loading="lazy"/>
            : <></>}

            <p className="text-2xl font-bold capitalize">
                {state_value.displayName}
                </p>

            <div className="flex gap-x-2 items-center">
                <span className="capitalize">{state_value.primaryType}</span>
                <div className="flex items-center gap-x-1">
                    <div className="flex gap-x-1 items-center">
                <span className="p-1">
                    <FaStar fill='gold'  className="inline" />
                    </span>
                <span>{state_value.rating}</span>
                </div>

                <div className="flex gap-x-1">
                <span>
                    <FaRoute className="inline" fill='blue' />
                </span>
                <p> 
                    {distanceDetails.code && distanceDetails.code == "Ok" && distanceDetails.distances ? processNumber(Number(distanceDetails.distances[1][0])): "Loading..."}
                </p>
                </div>

                </div>
            </div>

            <a href={state_value.mapsUri} className="hover:underline hover:font-bold md:hidden">View on Google Maps</a>
            <p className="capitalize">
                 <span className="p-2 ">
                    <FaLocationPin className="inline fill-red-600" />
                </span>
                {state_value.address}</p>
            <a className={state_value.phone ? "block": 'hidden'} href={`tel:${state_value.phone}`}>
                <span className="p-2"> <FaPhone className="inline fill-green-600" /> </span>
                {state_value.phone}
            </a>

                <>
              {state_value.website ?
              <a href={state_value.website} target="_blank" className="hover:underline hover:font-bold text-sm md:text-[16px] "> 
                <span className="p-2"><FaGlobe className="inline fill-blue-500" /></span>
                {state_value.website}</a> : null}  
                </>
            <div>

            <div className="flairs">
                {
                    additionalInfo.childFriendly ? "Good for Children" : null
                }
                {
                    additionalInfo.wifi ? "Has Wifi" : null
                }
                {
                    additionalInfo.sports ? "Good for Watching Sports" : null
                }
            </div>
            <div className="companion-apps p-2 my-2">
                <p className="text-xl font-bold">Companion Apps</p>
                <PlaceContext value={state_value}>
                <CompanionApps primaryType={state_value.primaryType} />
                </PlaceContext>
            </div>
        </div>
        </>
        )
    }




    return(
        <>
<div className="grid p-2 md:grid-cols-2 gap-2">
            <div className="hidden md:grid justify-center p-2">
                <MapComponent latitude={Number(Number(params.lat).toFixed(6))} longitude={Number(Number(params?.long))} />
            </div>
            <div>  
            {
                !loadingStatus?
                <LoaderComp />: <FullLocationDetails />
                
            }
            </div>
</div>
        </>
    )
}