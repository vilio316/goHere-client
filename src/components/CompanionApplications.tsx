import { useContext } from "react"
import { PlaceContext } from "../contexts/PlaceDetailsContext"

export default function CompanionApps(props: {primaryType: string})
{
    const value = useContext(PlaceContext);
    const { primaryType } = props 
    const basic_companions = {
        maps: 'Google Maps',
        cabs: ['Bolt', 'Uber', "InDrive"],
        orderProviders: [],
        booking: '',
        scheduleVisit: ''
    }

    function addCompanions(){
    if(primaryType){
    switch (primaryType.toLowerCase()){
        case 'restaurant':{
            return {...basic_companions, orderProviders: ['Glovo', 'Chowdeck', "Company Website"]}
        }
         case 'fast food restaurant':{
            return {...basic_companions, orderProviders: ['Glovo', 'Chowdeck', "Company Website"]}
        }
         case 'pizza restaurant':{
            return {...basic_companions, orderProviders: ['Glovo', 'Chowdeck', "Company Website"]}
        }
        case 'hotel': {
            return {...basic_companions, booking: 'Hotels.ng'}
        }
        case 'university' : {
            return{...basic_companions, scheduleVisit: 'Uni Site'}
        }
        default: {
            return basic_companions
        }
    }
}
else{
    return basic_companions
}
}
    const full_companions = addCompanions()
    return(
        <>{
        full_companions? 
        <div className="grid grid-cols-2 gap-x-2">
        <p>
            Book a ride with <select className="">
                {full_companions.cabs.map((cab) => <option className="font-bold" value={cab} key={cab}>{cab}</option>)}
            </select>
        </p>
        <p>
           View on <a className="hover:font-bold hover:underline" href={value.mapsUri}>{full_companions?.maps}</a>
        </p>
      
            {
                full_companions.scheduleVisit.length > 1 ? 
                  <a href={value.website}>
                Schedule a visit </a> : null
            }
            
            {
                full_companions.orderProviders.length > 0 ? 
                <p>Place an <a className="underline" href=''>order</a> with: <select>
                {full_companions.orderProviders.map((orderer) => <option value={orderer} key={orderer} >
                    {orderer}
                    </option>
                )  }
                </select> </p>
            : null}
            {
                full_companions.booking.length> 0 ? <p>
                    Book with <a className="hover:font-bold underline" href={`https://${full_companions.booking}/hotels/search?query=${value.displayName}`} target="_blank">
                    {full_companions.booking}
                    </a>
                </p> : null
            }
     
        </div>
: null }</>
    )

}