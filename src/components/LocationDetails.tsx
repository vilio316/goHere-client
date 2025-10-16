import { useParams, useSearchParams } from "react-router"
import MapComponent from "./MapTestComponent"
import axios from "axios"
import { useEffect, useReducer, useState } from "react"
import { FaBookmark, FaChild, FaGlobe, FaLocationPin, FaPhone, FaRoute, FaStar, FaTv, FaWifi } from "react-icons/fa6"
import { useLocationCoords } from "../contexts/LocationContext"
import CompanionApps from "./CompanionApplications"
import type { locationDetails, mapboxRespsonse } from "../interfacesAndTypes"
import { PlaceContext } from "../contexts/PlaceDetailsContext"
import LoaderComp from "./LoaderComp"
import { useAuthStatus } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import { ToastNotification } from "./ToastComponents"
       
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

    //Gets the details of a particular place from the Google Maps API
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
        const {displayName} = state_value
         const {updateLocations, locations, isLoggedIn } = useAuthStatus()
         const {updateMessageObj, messageObject, showToast} = useToast()
        const thisItem = locations.filter((item) => item.name == displayName)
    
         function saveLocation(){
            if(isLoggedIn){
            if(thisItem.length < 1){
            updateLocations([...locations, {name: displayName, placeID : id_value}]);
            postLocations(locations)
            updateMessageObj({...messageObject, action: 'Location Save Successful', success: true})
            showToast(true)
        }
            else{
                const newArr = locations.filter((item) => item.name !== displayName)
                updateLocations(newArr);
                postLocationsUnsave(locations);
                updateMessageObj({...messageObject, action: "Location Unsaved Successfully", success: true})
                showToast(true)
            }
            }
            else{
                updateMessageObj({...messageObject, action: "Please Log in to save Locations", success: false})
                showToast(true)
            }
        }

        async function postLocations(body: any){
            const email = localStorage.getItem('userMail')
            const newBody = [...body, {name: displayName, id: id_value}]
            const {data} = await axios.post(`http://localhost:8090/auth/update_locations`, {newBody, email})
            console.log(data)
        }

        async function postLocationsUnsave(body: any){
            const email = localStorage.getItem('userMail')
            const newBody = body.filter((item: any) => item.name !== displayName)
            const {data} = await axios.post(`http://localhost:8090/auth/update_locations`, {newBody, email})
            console.log(data)
        }

        return(
            <>
            { photos !== 'string' ?
            <img src={photos} className="rounded-2xl p-2 w-full max-h-[40vh] object-cover" loading="lazy"/>
            : <></>}

            <div className="md:text-2xl text-xl p-1 font-bold capitalize grid grid-cols-6 gap-x-2">
                <p className="grid col-span-4 items-center">
                <span>
                {state_value.displayName}
                </span>

                 <span className="flairs flex gap-x-2">
                {
                    additionalInfo.childFriendly ? <FaChild fill='blue' className="inline" title="Good for Children" size={16} />: null
    }
                
                  {  additionalInfo.wifi ? <FaWifi fill="blue" className="inline" title="Has WiFi" size={16} /> : null
                }
                {
                    additionalInfo.sports ? <FaTv className="inline" title="Good for Watching Sports" size={16} /> : null
                }

            </span>
                </p>
                <button className="outline-none col-span-2 justify-right bg-yellow-400 p-2 rounded-2xl text-white text-sm gap-x-1 items-center w-[85%]" onClick={() => {
                saveLocation()
                }}>
                    <FaBookmark fill='white' className="inline" />
                    <span className="p-2">{thisItem.length > 0 ? "Unsave Location" : "Save Location"}</span>
                </button> 
                </div>

            <div className="flex gap-x-4 items-center my-2 md:my-1">
                <span className="capitalize">{state_value.primaryType}</span>
                <div className="flex items-center gap-x-2">
                    <div className="flex gap-x-1 items-center">
                <span>
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

            <p className="capitalize">
                 <span className="p-2 ">
                    <FaLocationPin className="inline fill-red-600" />
                </span>
                {state_value.address}</p>
            <a className={state_value.phone ? "block": 'hidden'} href={`tel:${state_value.phone}`}>
                <span className="p-2"><FaPhone className="inline fill-green-600" /> </span>
                {state_value.phone}
            </a>

                <>
              {state_value.website ?
              <a href={state_value.website} target="_blank" className="hover:underline hover:font-bold text-sm md:text-[16px] "> 
                <span className="p-2"><FaGlobe className="inline fill-blue-500" /></span>
                {state_value.website}</a> : null}  
                </>
            <div>

           
            <div className="companion-apps p-1 md:p-2 my-2">
                <p className="text-xl font-bold">Related Services</p>
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
            <ToastNotification/>
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