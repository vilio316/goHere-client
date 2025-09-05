import { useState } from "react"
import { Link } from "react-router";

export default function Check(){
    const [latitude, setLat] = useState(0)
    const [longitude, setLong] = useState(0)


    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        setLat(position.coords.latitude);
        setLong(position.coords.longitude)
    })


    return(
        <>
        <p>Check!</p>
        <p>{latitude}</p>
        <p>{longitude}</p>
        <Link to={`/map_test/${latitude}`}>
        Here
        </Link>
        </>
    )

}