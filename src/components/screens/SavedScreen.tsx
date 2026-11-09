import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { FaArrowRight, FaBookmark, FaCompass } from "react-icons/fa";
import { authClient } from "../../lib/authClient";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";

export function SavedScreen() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const user = session?.user;

  if (isPending) {
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
        />
      </SavedScreenShell>
    );
  }

  return (
    <SavedScreenShell>
      <EmptySavedState
        firstName={user.name?.split(" ")[0] || "GUEST"}
        onExplore={() => navigate("/explore")}
      />
    </SavedScreenShell>
  );
}

function SavedScreenShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="mx-auto w-full max-w-xl py-12">{children}</div>
      </div>
    </div>
  );
}

interface GuestSavedStateProps {
  onSignUp: () => void;
  onExplore: () => void;
}

function GuestSavedState({ onSignUp, onExplore }: GuestSavedStateProps) {
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
          Save places
        </Badge>

        <h2
          id="saved-guest-title"
          className="mt-3 font-display text-2xl font-bold text-text-primary"
        >
          Sign up to save places
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
          Saved places
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
