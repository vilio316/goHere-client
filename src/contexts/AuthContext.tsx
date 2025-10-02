import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type authContextType = {
    isLoggedIn: boolean,
    logIn: React.Dispatch<React.SetStateAction<boolean>>
}
const AuthContext = createContext({} as authContextType)

export const useAuthStatus = () => useContext(AuthContext)

export function AuthProvider({children} : React.PropsWithChildren){
    const [isLoggedIn, logIn] = useState(false)

    useEffect(()=> {
        async function checkAuth(){
            const {data}= await axios.get('http://localhost:8090/auth/verify', {withCredentials: true})
            try{
                if(data.id){
                    logIn(true)
                }
            }
            catch(error){console.log(error)}
        }

        checkAuth()
    }, [])

    return(
        <AuthContext value={{isLoggedIn, logIn}}>
            {children}
        </AuthContext>
    ) 
}
