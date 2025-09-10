import {Marker, APIProvider, Map} from '@vis.gl/react-google-maps';
import { useLocationCoords } from '../contexts/LocationContext';

const key = import.meta.env.VITE_PLACES_API_KEY

function MapComponent(props: {
  latitude: number, longitude: number
}){
  const {latitude, longitude} = props
  const {location} = useLocationCoords()
  return(
  <APIProvider apiKey={key}>
    <Map
      className='md:w-[45vw] md:h-[90vh] w-[90vw] h-[30vh] rounded-[40px]'
      defaultCenter={{lat: latitude , lng: longitude}}
      defaultZoom={19}
      gestureHandling={'greedy'}
      disableDefaultUI={false}>
       <Marker position={{
        lat: location.lat , lng: location.long
       }}>
      
       </Marker>
       <Marker position={{
        lat:latitude , lng: longitude 
       }}>
       </Marker>
      </Map>
  </APIProvider>
  )
}
export default MapComponent

