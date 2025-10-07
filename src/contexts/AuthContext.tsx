import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type authContextType = {
    isLoggedIn: boolean,
    logIn: React.Dispatch<React.SetStateAction<boolean>>,
    //userEmail: string,
    //updateUserDetails: React.Dispatch<React.SetStateAction<string>>,
    username: string,
    updateUsername: React.Dispatch<React.SetStateAction<string>>
}
const AuthContext = createContext({} as authContextType)

export const useAuthStatus = () => useContext(AuthContext)

export function AuthProvider({children} : React.PropsWithChildren){
    const [isLoggedIn, logIn] = useState(false)
    const string = localStorage.getItem('userMail')
    const [username, updateUsername] = useState('')

    useEffect(()=> {
        async function getLoc(query: string|null) {
        const userLocations = await axios.get(`http://localhost:8090/auth/user_location/${query}`)
        console.log(userLocations.data)
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
        <AuthContext value={{isLoggedIn, logIn, username, updateUsername}}>
            {children}
        </AuthContext>
    ) 
}
