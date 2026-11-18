import {useMutation, useQueryClient} from '@tanstack/react-query'
import {authClient} from '../lib/authClient'

interface SaveLocationsParams {
name: string; 
osm_id: number;
osm_type: "node" | "way" | "relation";
lat: string | number;
lon: string | number;

}


export const useSaveActions = () => {
const queryClient = useQueryClient()
const {mutateAsync: savePlace, isPending: isSavingPlace, isSuccess: isPlaceSaved} = useMutation({
    mutationFn: async (object: SaveLocationsParams) => {
        const session = await authClient.getSession()
        if(!session) {
            throw new Error('User not authenticated')
        }
        const response = await fetch(`${import.meta.env.VITE_API_URL}/locations/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                location: object,
                user_id: session.data?.user.id
            }),
        });
        const data = await response.json();
        return data;
    },
    onSuccess: async() =>{
          await Promise.all([
        queryClient.invalidateQueries({queryKey: ['saved-places']}), 
        queryClient.invalidateQueries({queryKey: ['user-recs']}),
        ])
    }
})

const {mutateAsync: deletePlace, isPending: isDeletingPlace, isSuccess: placeDeleted} = useMutation({
    mutationFn: async(object: {
        user_id: string, osm_id: string
    })=>{
        const request = await fetch(`${import.meta.env.VITE_API_URL}/locations/${object.user_id}/${object.osm_id}`, {
            method: "DELETE", 
            credentials:'include'
        })
        const response = await request.json()
       return response
    }, 
    onSuccess: async ()=> {
        await Promise.all([
        queryClient.invalidateQueries({queryKey: ['saved-places']}), 
        queryClient.invalidateQueries({queryKey: ['user-recs']}),
        ])
    }
}
)

return{
    savePlace, isPlaceSaved, isSavingPlace, deletePlace, isDeletingPlace, placeDeleted
}

}