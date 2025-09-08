import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { useLocationCoords } from '../contexts/LocationContext';

const key = import.meta.env.VITE_PLACES_API_KEY

function MapComponent(){
  const {location} = useLocationCoords()
  console.log(location)
  return(
  <APIProvider apiKey={key}>
    <Map
      style={{width: '45vw', height: '70vh'}}
      defaultCenter={{lat: location.lat , lng: location.long}}
      defaultZoom={15}
      gestureHandling={'greedy'}
      disableDefaultUI={false}>
        <Marker position={{
          lat: location.lat, lng: location.long
        }} />
      </Map>
  </APIProvider>
  )
}
export default MapComponent

