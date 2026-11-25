import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { FaArrowRight, FaBookmark, FaCompass } from "react-icons/fa";
import { authClient } from "../../lib/authClient";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { useQuery } from "@tanstack/react-query";
import { FaTrash } from "react-icons/fa6";
import { useSaveActions } from "../../utils/saveMutations";

export function SavedScreen() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const user = session?.user;
  const {deletePlace, isDeletingPlace} = useSaveActions()

  const {data: userLocations, isFetching: gettingLocations, isSuccess: loadedSavedLocations} = useQuery({
    queryKey: ["saved-places"],
    queryFn: async ()=>{
      const savedRequest = await fetch(`${import.meta.env.VITE_API_URL}/locations/${user?.id}`, {
        credentials: "include",
      })
      const savedResponse : any[] = await savedRequest.json()
      return savedResponse
    }, 
    staleTime: 1* 60 * 60 * 1000, 
    enabled: !!user,
  })

  if (isPending || gettingLocations) {
    return (
      <SavedScreenShell>
        <Card variant="elevated" className="animate-phrase-in">
          <CardBody className="py-12 text-center">
            <p role="status" className="text-body-m text-text-secondary">
              Checking your saved places…
            </p>
          </CardBody>
        </Card>
      </SavedScreenShell>
    );
  }

  if (!user) {
    return (
      <SavedScreenShell>
        <GuestSavedState
          onSignUp={() => navigate("/profile")}
          onExplore={() => navigate("/explore")}
          text="Save Places"
        />
      </SavedScreenShell>
    );
  }

  if(loadedSavedLocations && userLocations && userLocations.length === 0){
    return (
      <SavedScreenShell>
        <EmptySavedState
          firstName={user.name?.split(" ")[0] || "GUEST"}
          onExplore={() => navigate("/explore")}
        />
      </SavedScreenShell>
    );
  }

    if(loadedSavedLocations && userLocations && userLocations.length > 0){
      return(
    <SavedScreenShell>
      <div className="animate-phrase-in">
        <h2 className="font-display text-2xl font-bold text-text-primary">
          Your Saved Places
        </h2>
        <p className="mt-1 text-body-m text-text-secondary">
          {userLocations.length} saved place{userLocations.length > 1 ? "s" : ""}
        </p>

        <ul className="mt-6 flex flex-col gap-4">
          {userLocations.map((location) => (
            <li key={location.osm_id}>
              <Card variant="elevated" className="group md:max-w-4/5">
                <CardBody className="grid grid-cols-5 items-center justify-between md:gap-4 gap-2">
                  <div className="col-span-3">
                    <h3 className="font-medium text-text-primary">
                      {location.name}
                    </h3>
                 
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/place/${location.osm_id}`)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    View
                  </Button>
                  <Button className="bg-transparent hover:bg-transparent" onClick={()=> {
                    deletePlace({
                      user_id: user.id, osm_id: location.osm_id
                    })
                  }}>
                    <FaTrash className="text-lg hover:text-xl transition-all" fill={isDeletingPlace?`yellow` :`red`} />
                  </Button>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </SavedScreenShell>)
  }
}

function SavedScreenShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden place-items-center">
      <div className="flex-1 overflow-y-auto md:px-8 px-4 md:pb-20 pb-6 h-full flex place-items-center">
        <div className="mx-auto w-full md:py-12 py-4">{children}</div>
      </div>
    </div>
  );
}

interface GuestSavedStateProps {
  onSignUp: () => void;
  onExplore: () => void;
  text?: string
}

export function GuestSavedState({ onSignUp, onExplore, text }: GuestSavedStateProps) {
  return (
    <section
      aria-labelledby="saved-guest-title"
      className="animate-phrase-in"
    >
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-tint text-accent-text">
          <FaBookmark aria-hidden="true" size={20} />
        </span>

        <Badge variant="solo" className="mt-4">
          {text}
        </Badge>

        <h2
          id="saved-guest-title"
          className="mt-3 font-display text-2xl font-bold text-text-primary"
        >
          Sign up to {text}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-body-m text-text-secondary">
          Create a free GoHere account to keep the places you love in one spot
          and find them again anytime.
        </p>
      </div>

      <Card className="mt-6">
        <CardBody className="flex flex-col gap-2">
          <Button
            variant="primary"
            fullWidth
            onClick={onSignUp}
            className="gap-2"
          >
            <span>Sign up to save</span>
            <FaArrowRight aria-hidden="true" size={14} />
          </Button>

          <Button
            variant="ghost"
            fullWidth
            onClick={onExplore}
            className="text-text-secondary hover:text-text-primary"
          >
            Continue exploring as guest
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}

interface EmptySavedStateProps {
  firstName: string;
  onExplore: () => void;
}

function EmptySavedState({ firstName, onExplore }: EmptySavedStateProps) {
  return (
    <section
      aria-labelledby="saved-empty-title"
      className="animate-phrase-in"
    >
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-tint text-accent-text">
          <FaCompass aria-hidden="true" size={20} />
        </span>

        <p className="mt-4 text-label-s uppercase text-text-secondary">
          Saved Places
        </p>

        <h2
          id="saved-empty-title"
          className="mt-2 font-display text-2xl font-bold text-text-primary"
        >
          Nothing saved yet, {firstName}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-body-m text-text-secondary">
          Tap Save on any place you want to come back to. Your saved spots will
          show up here.
        </p>
      </div>

      <Card className="mt-6">
        <CardBody className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="text-label-s uppercase text-text-secondary">
            0 saved places
          </p>

          <Button variant="primary" onClick={onExplore} className="gap-2">
            <span>Start exploring</span>
            <FaArrowRight aria-hidden="true" size={14} />
          </Button>
        </CardBody>
      </Card>
    </section>
  );
}
