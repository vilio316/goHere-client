import { createContext, useContext } from "react";

const AuthContext = createContext({authState: false})

const useAuthStatus = () => useContext(AuthContext)

export function AuthProvider({children} : React.PropsWithChildren){
    
    return(
        <AuthContext value={}>
            {children}
        </AuthContext>
    )
}
