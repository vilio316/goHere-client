import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type authContextType = {
    isLoggedIn: boolean,
    logIn: React.Dispatch<React.SetStateAction<boolean>>,
    locations: string[],
    updateLocations: React.Dispatch<React.SetStateAction<string[]>>,
    username: string,
    updateUsername: React.Dispatch<React.SetStateAction<string>>
}
const AuthContext = createContext({} as authContextType)

export const useAuthStatus = () => useContext(AuthContext)

export function AuthProvider({children} : React.PropsWithChildren){
    const [isLoggedIn, logIn] = useState(false)
    const string = localStorage.getItem('userMail')
    const [username, updateUsername] = useState('')
    const [locations, updateLocations] = useState<string[]>([])

    useEffect(()=> {
        async function getLoc(query: string|null) {
        const userLocations = await axios.get(`http://localhost:8090/auth/user_location/${query}`)
        const usable_locations : string[] = userLocations.data.foundUser.locations.locations
        const newLocations = usable_locations.filter((item) => (item !== "Empty"))
        updateLocations(newLocations)
    }
        getLoc(string)
    }, [string])

    useEffect(() => {
        async function getUser(query: string|null) {
            if(string !== null){
            const {data} = await axios.get(`http://localhost:8090/auth/get-user/${query}`)
            console.log(data)
            updateUsername(data.result.username)
        }}
        getUser(string)
       
    }, [string])

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
        <AuthContext value={{isLoggedIn, logIn, username, updateUsername, locations, updateLocations}}>
            {children}
        </AuthContext>
    ) 
}
