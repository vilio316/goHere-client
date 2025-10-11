export default function ErrorComponent(props: {code?: any, message: string}){
    const {message} = props
    return (
        <div className="grid w-[90%]">
        <p className="capitalize text-2xl font-bold">
            {message}
        </p>
        <p>Oops! An error occured with your network or our servers. Please check your network connection or retry your search! </p>
        </div>
    )
}