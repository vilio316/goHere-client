import { createContext, useContext, useState } from "react";

type ToastType = {
isVisible: boolean,
showToast: React.Dispatch<React.SetStateAction<boolean>>,
messageObject : {action: string, success: boolean}, 
updateMessageObj : React.Dispatch<React.SetStateAction<{action: string, success: boolean}>>
}

const ToastContext = createContext({} as ToastType)

export const useToast = () => useContext(ToastContext)

export default function ToastProvider(props: {children: React.ReactNode}){
    const [isVisible, showToast] = useState(false)
    const [messageObject, updateMessageObj] = useState<{action: string, success: boolean}>({action: '', success: false})

    return(
        <ToastContext value={{isVisible, showToast, messageObject, updateMessageObj}}>
            {props.children}
        </ToastContext>
    )
}