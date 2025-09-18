import { Outlet } from "react-router";

export default function AuthLayout(){
    return(
        <div className="p-1 md:p-2 mx-auto grid place-items-center h-[100vh]">
            <Outlet/>
        </div>
    )
}