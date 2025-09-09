import { useParams, useSearchParams } from "react-router"
import MapComponent from "./MapTestComponent"
import { useEffect, useReducer, useState } from "react"
import { FaGlobe, FaLocationPin, FaPhone, FaStar } from "react-icons/fa6"

interface locationDetails{
        displayName: string,
        phone: string,
        address: string,
        website: string
        primaryType: string
        rating: string
        deliveryStatus: boolean
        mapsUri: string
    }
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

export function LocationDetails(){
    const [searchParams] = useSearchParams()
    const id_value = searchParams.get('id')
    const params = useParams()
    const [state_value, dispatch] = useReducer(updateLocationDetails, locationStateObj)
    const [photos, addPhoto] = useState('string')

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

    useEffect(()=> {
        async function getPlaceDetails (){
            const { Place } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary

            if(id_value){
            const requested_locale = new Place({
                id: id_value
            })
           
            await requested_locale.fetchFields({
                fields: ['displayName', 'internationalPhoneNumber', 'formattedAddress', 'photos', 'primaryTypeDisplayName', 'websiteURI', 'rating', 'hasDelivery', 'googleMapsURI' ]
            })
           updateFields(requested_locale)
            if(requested_locale.photos && requested_locale.photos.length > 0) addPhoto(requested_locale.photos[0].getURI({maxHeight: 400}))
        }
        }
        async function getDistanceDetails(){
            const distanceService = new google.maps.DistanceMatrixService()

             const origin1 = { lat: 55.93, lng: -3.118 };
  const destinationB = { lat: 50.087, lng: 14.421 };

  const request = {
    origins: [origin1],
    destinations: [destinationB],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

    distanceService.getDistanceMatrix(request).then((response) => {
        console.log(response.rows[0].elements[0].distance, response.rows[0].elements[0].duration)
    })
        }


        getPlaceDetails();
        getDistanceDetails();
    }, [])


    return(
        <>
            <div className="grid p-2 md:grid-cols-2 gap-2">
            <div className="hidden md:grid justify-center p-2">
                <MapComponent latitude={Number(params.lat)} longitude={Number(params?.long)} />
            </div>

            <div>
            { photos !== 'string' ?
            <img src={photos} className="rounded-2xl p-2 opacity-75 w-full max-h-[40vh] object-cover" loading="lazy"/>
            : <></>}

            <p className="text-2xl font-bold">
               
                {state_value.displayName}
                </p>

            <div className="flex gap-x-2 items-center">
                <span>{state_value.primaryType}</span>
                <div className="flex items-center">
                <span className="p-1">
                    <FaStar fill='gold'  className="inline" />
                    </span>
                <span>{state_value.rating}</span>
                </div>
            </div>

            <a href={state_value.mapsUri} className="hover:underline hover:font-bold md:hidden">View on Google Maps</a>
            <p className="capitalize">
                 <span className="p-2 ">
                    <FaLocationPin className="inline" />
                </span>
                {state_value.address}</p>
            <p>
                <span className="p-2"><FaPhone className="inline" /></span>
                {state_value.phone}</p>

              <a href={state_value.website} className="hover:underline hover:font-bold">
                <span className="p-2"><FaGlobe className="inline" /></span>
                {state_value.website}</a>   
            <div>

            <div className="companion-apps p-2 my-2">
                <p className="text-xl font-bold">Companion Apps</p>

            </div>

            </div>
            </div>
            </div>
        </>
    )
}