import { useContext } from "react"
import { PlaceContext } from "../contexts/PlaceDetailsContext"
import { FaCar, FaHotel, FaMap, FaPlane } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
export default function CompanionApps(props: {primaryType: string})
{
    const value = useContext(PlaceContext);
    const { primaryType } = props 
    const basic_companions = {
        maps: 'Google Maps',
        cabs: ['Bolt', 'Uber', "InDrive"],
        planes: '',
        orderProviders: [],
        booking: '',
        scheduleVisit: ''
    }

    function addCompanions(){
     if(primaryType.toLowerCase().includes('airport')){
        return {...basic_companions, planes: 'Wakanow'}
     }   
    if(primaryType){
    switch (primaryType.toLowerCase()){
        case 'restaurant':{
            return {...basic_companions, orderProviders: ['Glovo', 'Chowdeck', "Website"]}
        }
         case 'fast food restaurant':{
            return {...basic_companions, orderProviders: ['Glovo', 'Chowdeck', "Website"]}
        }
         case 'pizza restaurant':{
            return {...basic_companions, orderProviders: ['Glovo', 'Chowdeck', "Website"]}
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
        <div className="grid md:grid-cols-2 gap-x-2">
        <div className="flex gap-x-2 p-1">
            <FaCar fill="blue" size={24} className="inline"/>
            <a className="underline">Book a ride</a> with <select className="border-1 p-0.5 rounded-md border-black">
                {full_companions.cabs.map((cab) => <option className="font-bold" value={cab} key={cab}>{cab}</option>)}
            </select>
        </div >
        
        <div className="flex gap-x-2 p-1">
            <FaMap className="inline" fill='blue' size={24} />
           <p>View on <a className="hover:font-bold hover:underline" target="_blank" href={value.mapsUri}>{full_companions?.maps}</a></p>
        </div>
            {
                full_companions.scheduleVisit.length > 1 ? 
                <div className="flex gap-x-1 p-1 items-center">
                    <FaHome size={24} fill="green" />
                  <a href={value.website} className="hover:underline hover:font-bold">
                Schedule a visit </a>
                </div> : null
            }
            
            {
                full_companions.orderProviders.length > 0 ? 
                 <div className="flex gap-x-1 p-1 items-center">
                    <IoFastFood fill="green" size={24}/>
                <p>Place an <a className="underline" href=''>order</a> with: <select>
                {full_companions.orderProviders.map((orderer) => <option value={orderer} key={orderer} >
                    {orderer}
                    </option>
                )  }
                </select> </p></div>
            : null}
            {
                full_companions.booking.length> 0 ? 
                <div className="flex gap-x-1 p-1 items-center">
                    <FaHotel fill="blue" className="inline"/>
                <p>
                    Book with <a className="hover:font-bold underline" href={`https://${full_companions.booking}/hotels/search?query=${value.displayName}`} target="_blank">
                    {full_companions.booking}
                    </a>
                </p> 
                </div>
                : null
            }
            {
                 full_companions.planes.length> 0 ? 
                <div className="flex gap-x-1 p-1 items-center">
                    <FaPlane fill="blue" className="inline"/>
                <p>
                    Book a flight with <a className="hover:font-bold underline" href="https://wakanow.com/en-ng"  target="_blank">
                    {full_companions.planes}
                    </a>
                </p> 
                </div>
                : null
            }
     
        </div>
: null }</>
    )

}