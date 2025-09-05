import {APIProvider, Map, useMapsLibrary} from '@vis.gl/react-google-maps';

const key = import.meta.env.VITE_PLACES_API_KEY

const MapTest = () => (
  <APIProvider apiKey={key}>
    <Map
      style={{width: '70vw', height: '75vh'}}
      defaultCenter={{lat: 9.01, lng:7.50}}
      defaultZoom={15}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    />
    <PlacesTest/>
  </APIProvider>
)
export default MapTest


function PlacesTest (){
    const places = useMapsLibrary('places')
      const request = {
        textQuery: "where to watch football",
        fields: ['displayName', 'location', 'businessStatus', "internationalPhoneNumber", "websiteURI", "photos", 'primaryType', 'priceRange'],
        includedType: '',
        useStrictTypeFiltering: true,
        locationBias: {lat: 9.01, lng: 7.5},
        isOpenNow: true,
        language: 'en-US',
        maxResultCount: 8,
    };

    async function log(){
    const places_result = await places?.Place.searchByText(request)
    return places_result?.places
    }

    console.log(log())
    return(
        <p>Test!</p>
    )
}
