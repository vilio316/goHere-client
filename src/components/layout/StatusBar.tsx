import type { RefObject } from "react";
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { useLocationCoords } from "../../contexts/LocationContext";
import { useQuery } from "@tanstack/react-query";
import { ThemeToggle } from "./ThemeToggle";
import { authClient } from "../../lib/authClient";
import { Link } from "react-router";

export interface StatusBarProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}

export function StatusBar({
  onMenuClick,
  isMenuOpen,
  menuButtonRef,
}: StatusBarProps) {
   const {location} = useLocationCoords();
   const {data: session} = authClient.useSession()
   

   const {data: placeData} = useQuery({
      queryKey: ["location"],
      staleTime: 30 * 60 * 1000,  
      queryFn: async () => {
        try {
          const request = await fetch(
            `${import.meta.env.VITE_API_URL}/search/reverse/${location.lat}/${location.long}`,
          );
          const response = await request.json();
          return response;
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Unknown error",
          );
        }
      },
      enabled: location.lat !== 0 && location.long !== 0,
    })
  function DigitalClock() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
      const timerId = setInterval(() => {
        setTime(new Date());
      }, 1000);

      return () => clearInterval(timerId);
    }, []);

    return (
      <span className="md:text-lg font-bold">{time.toLocaleTimeString()}</span>
    );
  }
  return (
    <div className="bg-dusk-950 flex items-center justify-between px-4 border-b border-dusk-700 font-data text-xs text-text-on-dark py-2">
      <div>
      <DigitalClock />
      {placeData && (
        <p className="md:text-lg font-bold">
          {placeData.address.suburb}, {placeData.address.city}
        </p>
      )}
      </div>
      <div className="flex items-center gap-1 md:gap-x-3">
        {!session || session == null ? (
          <Link className="text-lg font-bold hover:underline" to="/auth">
            Guest
          </Link>
        ) : null}
        {session && session.user && (
          <Link className="text-lg font-bold hover:underline" to="/profile">
            {session.user.name.split(" ")[0]}
          </Link>
        )}
        <ThemeToggle />
        <button
          ref={menuButtonRef}
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          className="focus-visible-ring -mr-2 rounded-md p-2 text-text-on-dark transition-colors hover:bg-dusk-800 md:hidden"
        >
          <FiMenu aria-hidden="true" className="text-xl" />
        </button>
      </div>
    </div>
  );
}
