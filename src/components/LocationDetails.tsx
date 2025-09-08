import { useSearchParams } from "react-router"
import MapComponent from "./MapTestComponent"
import { useEffect, useState } from "react"

export function LocationDetails(){
    const [searchParams] = useSearchParams()
    const id_value = searchParams.get('id')

    //states for showing the location details
    const [displayName, setDisplayName] = useState('')
    const [phoneNumber, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [photos, addPhoto] = useState('string')


    useEffect(()=> {
        async function getPlaceDetails (){
            const { Place } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary

            if(id_value){
            const requested_locale = new Place({
                id: id_value
            })
            await requested_locale.fetchFields({
                fields: ['displayName', 'internationalPhoneNumber', 'formattedAddress', 'photos']
            })
            setAddress(String(requested_locale.formattedAddress))
            setDisplayName(String(requested_locale.displayName))
            setPhone(String(requested_locale.internationalPhoneNumber))
            if(requested_locale.photos) addPhoto(requested_locale.photos[0].getURI({maxHeight: 400}))
        }
        }

        getPlaceDetails()
    }, [])


    return(
        <>
            <div className="grid p-2 grid-cols-2">
            <div>
                <MapComponent />
            </div>

            <div>
            <img src={photos} className="rounded-2xl p-2 opacity-75 w-full max-h-[40vh] object-cover" loading="lazy"/>
            <p className="text-2xl font-bold">{displayName}</p>
            <p className="capitalize">{address}</p>
            <p>{phoneNumber}</p>
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