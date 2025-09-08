import { FaGlobe, FaPhone, FaStar } from "react-icons/fa6";
import type { resultType } from "../App";
import { Link } from "react-router";

function SearchResult(props: {
    item: resultType
}){
    const {displayName, id,location, rating, websiteUri, shortFormattedAddress, goodForGroups, goodForChildren, primaryTypeDisplayName, internationalPhoneNumber} = props.item
    return(
     
        <div className="my-2 p-2 border-2 border-black grid grid-cols-5 group items-center">
            <div className="col-span-4">
                <Link to={`/location/${location.latitude
        }/${location.longitude}?id=${id}`}>
            <p className="font-bold text-2xl">{displayName.text}</p>
            <div className="flex md:gap-x-4">
            <span>{primaryTypeDisplayName ? primaryTypeDisplayName.text : ''}</span>

            <div className="flex gap-x-[2px] items-center">
            <FaStar fill="gold" size={16}/>
            <p>{rating?.toFixed(2)}</p>
            </div>
            </div>
            <p className="capitalize">{shortFormattedAddress}</p>
             </Link>
            </div>
       
            <div className="col-span-1 opacity-0 flex gap-x-4 group-hover:opacity-100 transition-opacity justify-end">
               <div>
                <a href={websiteUri ? websiteUri : ''} title="Visit Website Here" className={`
                    ${websiteUri.length > 0? 'opacity-100' : 'opacity-25'}
                    `} aria-disabled={websiteUri.length == 0 } >
                    <FaGlobe size={24} />
                </a>
                </div>

                <div>
                 <a href={`tel:${internationalPhoneNumber}`} title="Call" className={
                    `
                      ${internationalPhoneNumber.length > 0? 'opacity-100' : 'opacity-25'}
                    `
                 }   aria-disabled={internationalPhoneNumber.length == 0 }  >
                    <FaPhone size={24}/>
                </a>
                </div>
             </div>

        </div>
    )
}

export {SearchResult }