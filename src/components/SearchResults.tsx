import type { resultType } from "../App";
import { Link } from "react-router";

function SearchResult(props: {
    item: resultType
}){
    const {displayName, plusCode, location, rating, websiteUri, shortFormattedAddress, goodForGroups, goodForChildren, googleMapsUri, primaryTypeDisplayName} = props.item
    return(
        <Link to={`/location/`}>
        <div>
            <p>{displayName.text}</p>
            <span>{primaryTypeDisplayName ? primaryTypeDisplayName.text : ''}</span>
            <p>{rating}</p>
            <p>{shortFormattedAddress}</p>
            
        </div>
        </Link>
    )
}

export {SearchResult }