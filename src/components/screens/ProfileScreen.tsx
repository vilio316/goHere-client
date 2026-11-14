import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../layout/ThemeToggle";
import  { authClient}  from "../../lib/authClient";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import {useQuery} from "@tanstack/react-query";

export function ProfileScreen() {
  const {data: session} = authClient.useSession();
  const navigate = useNavigate()

  useEffect(() => {
  if (!session || !session.user) {
    navigate('/auth')
  }}, [session, navigate])

  const {data: userLocations, isFetching: gettingLocations, isSuccess: loadedSavedLocations} = useQuery({
      queryKey: ["saved-places"],
      queryFn: async ()=>{
        try{
        const savedRequest = await fetch(`${import.meta.env.VITE_API_URL}/locations/${session?.user?.id}`, {
          credentials: "include",
        })
        const savedResponse : any[] = await savedRequest.json()
        return savedResponse
      }
      catch(error){
        throw new Error(`Error getting saved places: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }, 
      staleTime: 1* 60 * 60 * 1000, 
      enabled: !!session?.user,
    })

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="max-w-xl mx-auto w-full py-12">
          <h2 className="font-display font-bold text-2xl mb-6">Profile</h2>
          <Card className="mb-4">
            <CardBody className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">
                    {session?.user?.name}
                  </h3>
                  <p className="text-text-secondary text-sm">Exploring since 2026</p>
                </div>
              </div>
            </CardBody>
          </Card>

        {
          gettingLocations && <p>Loading your saved places...</p>
        }

          {
            loadedSavedLocations && userLocations && userLocations.length > 0 && 
            <Link to="/saved">
            <Card className="mb-4">
            <CardBody className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border-subtle">
                <span className="text-text-primary">Places Saved</span>
                <span className="font-data font-semibold text-accent-text">
                  {userLocations?.length || 0}
                </span>
              </div>
           
            </CardBody>
          </Card>
          </Link>}

          <Card>
            <CardBody className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border-subtle">
                <div>
                  <p className="text-text-primary">Appearance</p>
                  <p className="text-text-secondary text-xs">
                    Switch between light and dark mode
                  </p>
                </div>
                <ThemeToggle tone="surface" showLabel />
              </div>
              <Button variant="secondary" fullWidth>
                ⚙️ Settings
              </Button>
              <Button
                variant="ghost"
                fullWidth
                className="text-alert-text border-alert-text/30 hover:bg-alert-text/10"
                onClick={() => authClient.signOut(
                {
                  fetchOptions:{
                    onSuccess: () => {
                      navigate('/')
                    }
                  }
                }
                )}
              >
                Sign out
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
