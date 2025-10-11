import { Link } from "react-router"

function ErrorPage(){

    return(
        <div className="grid place-items-center h-[90vh]">
            <div>
            <p>Resource or location not found</p>
            <p>Click here to go back to the  <Link to={'/'} className="underline">homepage</Link> or go back to the previous page to refresh the page. </p>
            </div>
         </div>
    )
}

export default ErrorPage