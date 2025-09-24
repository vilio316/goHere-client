import { createContext, useContext, useState } from "react";

type authContextType = {
    isLoggedIn: boolean,
    logIn: React.Dispatch<React.SetStateAction<boolean>>
}
const AuthContext = createContext({} as authContextType)

export const useAuthStatus = () => useContext(AuthContext)

export function AuthProvider({children} : React.PropsWithChildren){
    const [isLoggedIn, logIn] = useState(false)
    return(
        <AuthContext value={{isLoggedIn, logIn}}>
            {children}
        </AuthContext>
    ) 
}
