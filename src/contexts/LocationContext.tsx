import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

const LocationContext = createContext({} as location_context_type )

type location_context_type = {
    location: {lat: number, long: number},
    setLocation: Dispatch<SetStateAction<{lat: number, long: number }>>
}


const useLocationCoords = () => useContext(LocationContext)

type Props = React.PropsWithChildren<{}>

function LocationProvider({children}: Props){
    const [location, setLocation] = useState({
        lat: 0, long: 0
    })

    return(
        <LocationContext value={{location, setLocation}}>
            {children}
        </LocationContext>
    )
}

export {useLocationCoords, LocationProvider}
